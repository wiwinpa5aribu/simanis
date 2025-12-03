import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { DepreciationCalculatorService } from './depreciation-calculator.service'

describe('DepreciationCalculatorService', () => {
  const service = new DepreciationCalculatorService()

  describe('calculateMonthlyDepreciation', () => {
    it('should calculate monthly depreciation correctly', () => {
      // Example: Asset 10,000,000 with 5 years useful life
      // Monthly = 10,000,000 / (5 * 12) = 166,666.67
      const monthly = service.calculateMonthlyDepreciation(10_000_000, 5)
      expect(monthly).toBeCloseTo(166_666.67, 2)
    })

    it('should handle 1 year useful life', () => {
      const monthly = service.calculateMonthlyDepreciation(12_000_000, 1)
      expect(monthly).toBe(1_000_000)
    })

    it('should throw error for zero or negative useful life', () => {
      expect(() =>
        service.calculateMonthlyDepreciation(10_000_000, 0)
      ).toThrow()
      expect(() =>
        service.calculateMonthlyDepreciation(10_000_000, -1)
      ).toThrow()
    })

    it('should throw error for negative acquisition value', () => {
      expect(() =>
        service.calculateMonthlyDepreciation(-10_000_000, 5)
      ).toThrow()
    })
  })

  describe('calculateBookValue', () => {
    it('should calculate book value correctly', () => {
      // 10 million - 2 million accumulated = 8 million
      const bookValue = service.calculateBookValue(10_000_000, 2_000_000)
      expect(bookValue).toBe(8_000_000)
    })

    it('should return 0 when accumulated exceeds acquisition value', () => {
      const bookValue = service.calculateBookValue(10_000_000, 12_000_000)
      expect(bookValue).toBe(0)
    })

    it('should return acquisition value when no depreciation', () => {
      const bookValue = service.calculateBookValue(10_000_000, 0)
      expect(bookValue).toBe(10_000_000)
    })

    it('should throw error for negative values', () => {
      expect(() => service.calculateBookValue(-10_000_000, 1_000_000)).toThrow()
      expect(() => service.calculateBookValue(10_000_000, -1_000_000)).toThrow()
    })
  })

  describe('calculateAccumulatedDepreciation', () => {
    it('should calculate accumulated depreciation for multiple months', () => {
      // 10 million, 5 years, after 12 months
      // Monthly = 166,666.67, accumulated = 2,000,000
      const accumulated = service.calculateAccumulatedDepreciation(
        10_000_000,
        5,
        12
      )
      expect(accumulated).toBeCloseTo(2_000_000, 2)
    })

    it('should not exceed acquisition value', () => {
      // Even if months exceed useful life
      const accumulated = service.calculateAccumulatedDepreciation(
        10_000_000,
        5,
        100
      )
      expect(accumulated).toBe(10_000_000)
    })
  })

  describe('isFullyDepreciated', () => {
    it('should return true for zero book value', () => {
      expect(service.isFullyDepreciated(0)).toBe(true)
    })

    it('should return true for negative book value', () => {
      expect(service.isFullyDepreciated(-100)).toBe(true)
    })

    it('should return false for positive book value', () => {
      expect(service.isFullyDepreciated(1000)).toBe(false)
    })
  })

  describe('calculateRemainingLife', () => {
    it('should calculate remaining months correctly', () => {
      // 10 million acquisition, 2 million accumulated, 5 years useful life
      // Book value = 8 million, monthly = 166,666.67
      // Remaining = 8,000,000 / 166,666.67 = 48 months
      const remaining = service.calculateRemainingLife(10_000_000, 2_000_000, 5)
      expect(remaining).toBe(48)
    })

    it('should return 0 for fully depreciated asset', () => {
      const remaining = service.calculateRemainingLife(
        10_000_000,
        10_000_000,
        5
      )
      expect(remaining).toBe(0)
    })
  })

  // ============================================================
  // PROPERTY 7: Depreciation Formula Correctness
  // Validates: Requirements 3.2
  // ============================================================
  describe('Property 7: Depreciation Formula Correctness', () => {
    it('should satisfy: monthly depreciation × useful life (months) = acquisition value', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 1_000_000_000 }), // nilaiPerolehan
          fc.integer({ min: 1, max: 50 }), // masaManfaatTahun
          (nilaiPerolehan, masaManfaatTahun) => {
            const monthly = service.calculateMonthlyDepreciation(
              nilaiPerolehan,
              masaManfaatTahun
            )
            const totalMonths = masaManfaatTahun * 12
            const totalDepreciation = monthly * totalMonths

            // Should equal within floating point precision
            expect(Math.abs(totalDepreciation - nilaiPerolehan)).toBeLessThan(
              0.01
            )
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should satisfy: book value = acquisition - accumulated depreciation', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 1_000_000_000 }), // nilaiPerolehan
          fc.integer({ min: 0, max: 1_000_000_000 }), // akumulasi (can be any value)
          (nilaiPerolehan, akumulasi) => {
            const bookValue = service.calculateBookValue(
              nilaiPerolehan,
              akumulasi
            )
            const expected = Math.max(0, nilaiPerolehan - akumulasi)

            expect(bookValue).toBe(expected)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  // ============================================================
  // PROPERTY 9: Zero Book Value Skip
  // Validates: Requirements 3.4
  // ============================================================
  describe('Property 9: Zero Book Value Skip', () => {
    it('should identify fully depreciated assets', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 1_000_000_000 }), // nilaiPerolehan
          (nilaiPerolehan) => {
            // When accumulated equals or exceeds acquisition value
            const bookValue = service.calculateBookValue(
              nilaiPerolehan,
              nilaiPerolehan
            )

            expect(service.isFullyDepreciated(bookValue)).toBe(true)
            expect(bookValue).toBe(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should handle over-depreciation correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 1_000_000_000 }), // nilaiPerolehan
          fc.integer({ min: 1, max: 1_000_000_000 }), // excess
          (nilaiPerolehan, excess) => {
            const akumulasi = nilaiPerolehan + excess
            const bookValue = service.calculateBookValue(
              nilaiPerolehan,
              akumulasi
            )

            // Book value should never be negative
            expect(bookValue).toBe(0)
            expect(service.isFullyDepreciated(bookValue)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should calculate remaining life as 0 for fully depreciated assets', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 1_000_000_000 }), // nilaiPerolehan
          fc.integer({ min: 1, max: 50 }), // masaManfaatTahun
          (nilaiPerolehan, masaManfaatTahun) => {
            const remaining = service.calculateRemainingLife(
              nilaiPerolehan,
              nilaiPerolehan, // fully depreciated
              masaManfaatTahun
            )

            expect(remaining).toBe(0)
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
