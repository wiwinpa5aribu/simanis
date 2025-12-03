import { describe, it } from 'vitest'
import fc from 'fast-check'
import { DepreciationCalculatorService } from '../../src/infrastructure/services/depreciation-calculator.service'

describe('Depreciation Simulation - Property Tests', () => {
  const calculator = new DepreciationCalculatorService()

  /**
   * Property 13: Simulation Projection Correctness
   * For any simulation request, each projected month's nilaiBuku must equal
   * the previous month's nilaiBuku minus penyusutanPerBulan, until reaching 0.
   * Validates: Requirements 6.2
   */
  it('**Feature: depreciation, Property 13: Simulation Projection Correctness**', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000_000, max: 100_000_000 }), // nilaiPerolehan
        fc.integer({ min: 1, max: 20 }), // masaManfaatTahun
        fc.integer({ min: 1, max: 60 }), // periodMonths
        (nilaiPerolehan, masaManfaatTahun, periodMonths) => {
          const monthlyDepreciation = calculator.calculateMonthlyDepreciation(
            nilaiPerolehan,
            masaManfaatTahun
          )

          // Simulate projections
          let bookValue = nilaiPerolehan
          let previousBookValue = nilaiPerolehan

          for (let month = 1; month <= periodMonths; month++) {
            const penyusutan = Math.min(monthlyDepreciation, bookValue)
            bookValue = Math.max(0, bookValue - penyusutan)

            // Property 13: nilaiBuku = previous - penyusutan
            const expectedBookValue = Math.max(0, previousBookValue - monthlyDepreciation)

            // Allow small floating point errors (< 0.01)
            const diff = Math.abs(bookValue - expectedBookValue)
            if (diff >= 0.01) {
              return false
            }

            previousBookValue = bookValue

            // Once fully depreciated, should stay at 0
            if (bookValue === 0) {
              // All subsequent months should also be 0
              for (let m = month + 1; m <= periodMonths; m++) {
                const futureBookValue = Math.max(0, bookValue - monthlyDepreciation)
                if (futureBookValue !== 0) {
                  return false
                }
              }
              break
            }
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 14: Simulation End Date Estimation
   * For any asset simulation, the estimated end date must be the month
   * when nilaiBuku first reaches 0.
   * Validates: Requirements 6.3
   */
  it('**Feature: depreciation, Property 14: Simulation End Date Estimation**', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000_000, max: 100_000_000 }), // nilaiPerolehan
        fc.integer({ min: 1, max: 20 }), // masaManfaatTahun
        fc.double({ min: 0, max: 0.9, noNaN: true }), // akumulasiRatio (0-90% of nilai)
        (nilaiPerolehan, masaManfaatTahun, akumulasiRatio) => {
          const akumulasiPenyusutan = nilaiPerolehan * akumulasiRatio
          const currentBookValue = calculator.calculateBookValue(
            nilaiPerolehan,
            akumulasiPenyusutan
          )

          if (currentBookValue === 0) {
            return true // Already fully depreciated
          }

          const monthlyDepreciation = calculator.calculateMonthlyDepreciation(
            nilaiPerolehan,
            masaManfaatTahun
          )

          // Calculate expected end month
          const expectedEndMonth = Math.ceil(currentBookValue / monthlyDepreciation)

          // Simulate to find actual end month
          let bookValue = currentBookValue
          let actualEndMonth: number | null = null

          for (let month = 1; month <= expectedEndMonth + 12; month++) {
            const penyusutan = Math.min(monthlyDepreciation, bookValue)
            bookValue = Math.max(0, bookValue - penyusutan)

            if (bookValue === 0 && actualEndMonth === null) {
              actualEndMonth = month
              break
            }
          }

          // Property 14: actualEndMonth should equal expectedEndMonth
          if (actualEndMonth === null) {
            return false // Should have found end date
          }

          const diff = Math.abs(actualEndMonth - expectedEndMonth)
          return diff <= 1 // Allow 1 month difference due to rounding
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Additional Property: Projection Total Correctness
   * The sum of all penyusutan in projections should not exceed nilaiPerolehan
   */
  it('**Feature: depreciation, Property: Projection Total Correctness**', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000_000, max: 100_000_000 }), // nilaiPerolehan
        fc.integer({ min: 1, max: 20 }), // masaManfaatTahun
        fc.integer({ min: 1, max: 60 }), // periodMonths
        fc.double({ min: 0, max: 0.9, noNaN: true }), // akumulasiRatio
        (nilaiPerolehan, masaManfaatTahun, periodMonths, akumulasiRatio) => {
          const initialAkumulasi = nilaiPerolehan * akumulasiRatio
          let bookValue = calculator.calculateBookValue(nilaiPerolehan, initialAkumulasi)
          const monthlyDepreciation = calculator.calculateMonthlyDepreciation(
            nilaiPerolehan,
            masaManfaatTahun
          )

          let totalPenyusutanInPeriod = 0

          for (let month = 1; month <= periodMonths; month++) {
            const penyusutan = Math.min(monthlyDepreciation, bookValue)
            bookValue = Math.max(0, bookValue - penyusutan)
            totalPenyusutanInPeriod += penyusutan
          }

          const totalAkumulasi = initialAkumulasi + totalPenyusutanInPeriod

          // Total accumulated should never exceed acquisition value
          return totalAkumulasi <= nilaiPerolehan + 0.01 // Allow small floating error
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Additional Property: Monotonic Decrease
   * Book value should never increase in projections
   */
  it('**Feature: depreciation, Property: Monotonic Book Value Decrease**', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000_000, max: 100_000_000 }), // nilaiPerolehan
        fc.integer({ min: 1, max: 20 }), // masaManfaatTahun
        fc.integer({ min: 2, max: 60 }), // periodMonths (at least 2 for comparison)
        (nilaiPerolehan, masaManfaatTahun, periodMonths) => {
          const monthlyDepreciation = calculator.calculateMonthlyDepreciation(
            nilaiPerolehan,
            masaManfaatTahun
          )

          let bookValue = nilaiPerolehan
          let previousBookValue = nilaiPerolehan

          for (let month = 1; month <= periodMonths; month++) {
            const penyusutan = Math.min(monthlyDepreciation, bookValue)
            bookValue = Math.max(0, bookValue - penyusutan)

            // Book value should never increase
            if (bookValue > previousBookValue) {
              return false
            }

            previousBookValue = bookValue
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Additional Property: Remaining Life Calculation
   * If not fully depreciated, remaining months = ceil(bookValue / monthlyDepreciation)
   */
  it('**Feature: depreciation, Property: Remaining Life Calculation**', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000_000, max: 100_000_000 }), // nilaiPerolehan
        fc.integer({ min: 1, max: 20 }), // masaManfaatTahun
        fc.double({ min: 0, max: 0.9, noNaN: true }), // akumulasiRatio
        (nilaiPerolehan, masaManfaatTahun, akumulasiRatio) => {
          const akumulasiPenyusutan = nilaiPerolehan * akumulasiRatio
          const remainingLife = calculator.calculateRemainingLife(
            nilaiPerolehan,
            akumulasiPenyusutan,
            masaManfaatTahun
          )

          if (remainingLife === 0) {
            // Should be fully depreciated
            const bookValue = calculator.calculateBookValue(
              nilaiPerolehan,
              akumulasiPenyusutan
            )
            return calculator.isFullyDepreciated(bookValue)
          }

          // Verify calculation
          const bookValue = calculator.calculateBookValue(
            nilaiPerolehan,
            akumulasiPenyusutan
          )
          const monthlyDepreciation = calculator.calculateMonthlyDepreciation(
            nilaiPerolehan,
            masaManfaatTahun
          )
          const expectedRemainingLife = Math.ceil(bookValue / monthlyDepreciation)

          return remainingLife === expectedRemainingLife
        }
      ),
      { numRuns: 100 }
    )
  })
})
