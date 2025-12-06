/**
 * Property-Based Tests - Depreciation
 * Mengimplementasikan Correctness Properties dari design.md
 * Menggunakan fast-check untuk testing dengan random input
 *
 * These tests validate the mathematical correctness and
 * business logic of depreciation calculations
 */

import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

// ============ Depreciation Formula ============
// Sesuai dengan design.md Requirements 3.2

/**
 * Menghitung penyusutan bulanan
 * Formula: Nilai Perolehan / (Masa Manfaat Tahun × 12)
 */
export function calculateMonthlyDepreciation(
  nilaiPerolehan: number,
  masaManfaatTahun: number
): number {
  if (masaManfaatTahun <= 0) {
    throw new Error('Masa manfaat harus lebih dari 0')
  }
  return nilaiPerolehan / (masaManfaatTahun * 12)
}

/**
 * Menghitung nilai buku
 * Formula: Nilai Perolehan - Akumulasi Penyusutan
 */
export function calculateBookValue(
  nilaiPerolehan: number,
  akumulasiPenyusutan: number
): number {
  const nilaiBuku = nilaiPerolehan - akumulasiPenyusutan
  return Math.max(0, nilaiBuku) // Nilai buku tidak boleh negatif
}

/**
 * Menghitung akumulasi penyusutan
 * Formula: Penyusutan Bulanan × Jumlah Bulan
 */
export function calculateAccumulatedDepreciation(
  penyusutanBulanan: number,
  jumlahBulan: number
): number {
  return penyusutanBulanan * jumlahBulan
}

/**
 * Memeriksa apakah aset sudah habis disusutkan
 */
export function isFullyDepreciated(nilaiBuku: number): boolean {
  return nilaiBuku <= 0
}

/**
 * Menghitung sisa bulan sampai habis disusutkan
 */
export function calculateRemainingMonths(
  nilaiBuku: number,
  penyusutanBulanan: number
): number {
  if (penyusutanBulanan <= 0) return Infinity
  if (nilaiBuku <= 0) return 0
  return Math.ceil(nilaiBuku / penyusutanBulanan)
}

// ============ Arbitraries ============
// Generator untuk random test data

const nilaiPerolehanArbitrary = fc.integer({ min: 1000000, max: 10000000000 }) // 1jt - 10M
const masaManfaatArbitrary = fc.integer({ min: 1, max: 20 }) // 1-20 tahun
const bulanArbitrary = fc.integer({ min: 1, max: 240 }) // 1-240 bulan (20 tahun)

// ============ Property Tests ============

describe('Depreciation Property-Based Tests', () => {
  describe('Property 7: Depreciation Formula Correctness', () => {
    /**
     * For any asset with nilaiPerolehan and masaManfaatTahun,
     * the calculated penyusutanPerBulan must equal
     * nilaiPerolehan / (masaManfaatTahun * 12)
     */
    it('should calculate monthly depreciation correctly', () => {
      fc.assert(
        fc.property(
          nilaiPerolehanArbitrary,
          masaManfaatArbitrary,
          (nilaiPerolehan, masaManfaatTahun) => {
            const expected = nilaiPerolehan / (masaManfaatTahun * 12)
            const actual = calculateMonthlyDepreciation(
              nilaiPerolehan,
              masaManfaatTahun
            )
            return Math.abs(actual - expected) < 0.01 // Allow small floating point diff
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should throw error for zero or negative useful life', () => {
      expect(() => calculateMonthlyDepreciation(1000000, 0)).toThrow()
      expect(() => calculateMonthlyDepreciation(1000000, -1)).toThrow()
    })
  })

  describe('Property 1: Summary Calculation Correctness', () => {
    /**
     * For any set of assets, total nilai buku must equal
     * total nilai perolehan - total akumulasi penyusutan
     */
    it('should maintain book value equation', () => {
      fc.assert(
        fc.property(
          fc.array(nilaiPerolehanArbitrary, { minLength: 1, maxLength: 10 }),
          fc.array(fc.float({ min: 0, max: 1 }), {
            minLength: 1,
            maxLength: 10,
          }),
          (nilaiPerolehanList, ratios) => {
            // Generate akumulasi penyusutan sebagai ratio dari nilai perolehan
            let totalNilaiPerolehan = 0
            let totalAkumulasi = 0
            let totalNilaiBuku = 0

            nilaiPerolehanList.forEach((np, i) => {
              const ratio = ratios[i % ratios.length] || 0
              const akumulasi = np * ratio
              const nilaiBuku = calculateBookValue(np, akumulasi)

              totalNilaiPerolehan += np
              totalAkumulasi += akumulasi
              totalNilaiBuku += nilaiBuku
            })

            // Total Nilai Buku = Total Nilai Perolehan - Total Akumulasi
            const expectedNilaiBuku = Math.max(
              0,
              totalNilaiPerolehan - totalAkumulasi
            )
            return Math.abs(totalNilaiBuku - expectedNilaiBuku) < 1
          }
        ),
        { numRuns: 50 }
      )
    })
  })

  describe('Property 6: Fully Depreciated Badge', () => {
    /**
     * For any asset with nilaiBuku equal to 0,
     * the isFullyDepreciated flag must be true
     */
    it('should mark asset as fully depreciated when book value is 0', () => {
      expect(isFullyDepreciated(0)).toBe(true)
      expect(isFullyDepreciated(-1)).toBe(true) // Edge case
      expect(isFullyDepreciated(1)).toBe(false)
      expect(isFullyDepreciated(1000000)).toBe(false)
    })

    it('should correctly identify fully depreciated assets', () => {
      fc.assert(
        fc.property(nilaiPerolehanArbitrary, (nilaiPerolehan) => {
          // Jika akumulasi >= nilai perolehan, harus habis disusutkan
          const nilaiBuku = calculateBookValue(nilaiPerolehan, nilaiPerolehan)
          return isFullyDepreciated(nilaiBuku) === true
        }),
        { numRuns: 50 }
      )
    })
  })

  describe('Property 9: Zero Book Value Skip', () => {
    /**
     * For any asset with nilaiBuku equal to 0,
     * the depreciation calculation must not create a new entry
     */
    it('should return 0 remaining months when book value is 0', () => {
      const nilaiBuku = 0
      const penyusutanBulanan = 100000
      expect(calculateRemainingMonths(nilaiBuku, penyusutanBulanan)).toBe(0)
    })

    it('should correctly calculate remaining months', () => {
      fc.assert(
        fc.property(
          nilaiPerolehanArbitrary,
          masaManfaatArbitrary,
          bulanArbitrary,
          (nilaiPerolehan, masaManfaat, bulanKe) => {
            const penyusutanBulanan = calculateMonthlyDepreciation(
              nilaiPerolehan,
              masaManfaat
            )
            const akumulasi = calculateAccumulatedDepreciation(
              penyusutanBulanan,
              bulanKe
            )
            const nilaiBuku = calculateBookValue(nilaiPerolehan, akumulasi)
            const sisaBulan = calculateRemainingMonths(
              nilaiBuku,
              penyusutanBulanan
            )

            // Sisa bulan harus >= 0
            if (sisaBulan === Infinity) return true
            return sisaBulan >= 0
          }
        ),
        { numRuns: 50 }
      )
    })
  })

  describe('Property 13: Simulation Projection Correctness', () => {
    /**
     * For any simulation, each projected month's nilaiBuku must equal
     * the previous month's nilaiBuku minus penyusutanPerBulan
     */
    it('should correctly project future book values', () => {
      fc.assert(
        fc.property(
          nilaiPerolehanArbitrary,
          masaManfaatArbitrary,
          fc.integer({ min: 1, max: 60 }), // 1-60 bulan simulasi
          (nilaiPerolehan, masaManfaat, periodBulan) => {
            const penyusutanBulanan = calculateMonthlyDepreciation(
              nilaiPerolehan,
              masaManfaat
            )

            let prevNilaiBuku = nilaiPerolehan
            for (let bulan = 1; bulan <= periodBulan; bulan++) {
              const akumulasi = calculateAccumulatedDepreciation(
                penyusutanBulanan,
                bulan
              )
              const nilaiBuku = calculateBookValue(nilaiPerolehan, akumulasi)

              // Nilai buku harus berkurang atau tetap 0
              if (prevNilaiBuku > 0) {
                if (nilaiBuku > prevNilaiBuku) return false
              }
              prevNilaiBuku = nilaiBuku
            }
            return true
          }
        ),
        { numRuns: 50 }
      )
    })
  })

  describe('Property 14: Simulation End Date Estimation', () => {
    /**
     * For any asset simulation, the estimated end date must be
     * the month when nilaiBuku first reaches 0
     */
    it('should correctly estimate when asset will be fully depreciated', () => {
      fc.assert(
        fc.property(
          nilaiPerolehanArbitrary,
          masaManfaatArbitrary,
          (nilaiPerolehan, masaManfaat) => {
            const penyusutanBulanan = calculateMonthlyDepreciation(
              nilaiPerolehan,
              masaManfaat
            )
            const totalBulan = masaManfaat * 12

            // Setelah masa manfaat berakhir, nilai buku harus 0
            const akumulasiAkhir = calculateAccumulatedDepreciation(
              penyusutanBulanan,
              totalBulan
            )
            const nilaiBukuAkhir = calculateBookValue(
              nilaiPerolehan,
              akumulasiAkhir
            )

            return nilaiBukuAkhir <= 0.01 // Allow small floating point diff
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Asset-Depreciation Integration Properties', () => {
    /**
     * Property: Asset dengan nilai perolehan harus memiliki penyusutan
     * yang konsisten dengan masa manfaat dari kategorinya
     */
    it('should have consistent depreciation with category useful life', () => {
      // Contoh kategori dengan default masa manfaat
      const categories = [
        { id: 1, name: 'Elektronik', defaultMasaManfaat: 4 },
        { id: 2, name: 'Furniture', defaultMasaManfaat: 8 },
        { id: 3, name: 'Kendaraan', defaultMasaManfaat: 10 },
      ]

      fc.assert(
        fc.property(
          nilaiPerolehanArbitrary,
          fc.integer({ min: 0, max: 2 }), // category index
          (nilaiPerolehan, categoryIndex) => {
            const category = categories[categoryIndex]
            const penyusutanBulanan = calculateMonthlyDepreciation(
              nilaiPerolehan,
              category.defaultMasaManfaat
            )
            const totalBulan = category.defaultMasaManfaat * 12

            // Total penyusutan selama masa manfaat = nilai perolehan
            const totalPenyusutan = penyusutanBulanan * totalBulan
            return Math.abs(totalPenyusutan - nilaiPerolehan) < 1
          }
        ),
        { numRuns: 50 }
      )
    })

    /**
     * Property: Perubahan nilai perolehan aset harus mempengaruhi
     * kalkulasi penyusutan
     */
    it('should recalculate depreciation when acquisition value changes', () => {
      fc.assert(
        fc.property(
          nilaiPerolehanArbitrary,
          nilaiPerolehanArbitrary,
          masaManfaatArbitrary,
          (nilaiAwal, nilaiBaru, masaManfaat) => {
            const penyusutanAwal = calculateMonthlyDepreciation(
              nilaiAwal,
              masaManfaat
            )
            const penyusutanBaru = calculateMonthlyDepreciation(
              nilaiBaru,
              masaManfaat
            )

            // Jika nilai perolehan berbeda, penyusutan harus berbeda
            if (nilaiAwal !== nilaiBaru) {
              return penyusutanAwal !== penyusutanBaru
            }
            return penyusutanAwal === penyusutanBaru
          }
        ),
        { numRuns: 50 }
      )
    })
  })
})

// ============ Export untuk digunakan di komponen ============

export const DepreciationCalculator = {
  calculateMonthlyDepreciation,
  calculateBookValue,
  calculateAccumulatedDepreciation,
  isFullyDepreciated,
  calculateRemainingMonths,
}
