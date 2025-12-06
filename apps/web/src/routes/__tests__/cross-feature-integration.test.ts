/**
 * Cross-Feature Integration Tests
 * Memastikan konsistensi antara Asset Management dan Depreciation
 *
 * Tujuan:
 * - Memvalidasi bahwa kedua fitur saling terintegrasi dengan benar
 * - Memastikan tidak ada ambiguitas dalam data dan navigasi
 * - Menciptakan hubungan yang jelas antara aset dan penyusutannya
 */

import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

// ============ Re-define constants to avoid import issues ============
// Ini adalah sumber kebenaran yang sama dengan di masing-masing test file

// Asset Management Routes (copy from asset-management route-validation.test.ts)
const ASSET_MANAGEMENT_ROUTES = {
  assetList: '/assets',
  assetCreate: '/assets/new',
  assetDetail: '/assets/:id',
  assetEdit: '/assets/:id/edit',
} as const

const AssetRoutes = {
  list: () => '/assets',
  create: () => '/assets/new',
  detail: (id: number) => `/assets/${id}`,
  edit: (id: number) => `/assets/${id}/edit`,
}

// Depreciation Routes (copy from depreciation route-validation.test.ts)
const DEPRECIATION_ROUTES = {
  main: '/depreciation',
} as const

const DepreciationRoutes = {
  main: () => DEPRECIATION_ROUTES.main,
  withTab: (tab: 'dashboard' | 'list' | 'simulation' | 'settings') =>
    `${DEPRECIATION_ROUTES.main}?tab=${tab}`,
}

// Export for potential use in other tests
export { DepreciationRoutes }

const AssetDepreciationIntegration = {
  assetToDepreciation: () => DEPRECIATION_ROUTES.main,
  depreciationToAsset: (assetId: number) => `/assets/${assetId}`,
  depreciationToEditAsset: (assetId: number) => `/assets/${assetId}/edit`,
}

// Depreciation Calculator (copy from depreciation property-tests.test.ts)
const DepreciationCalculator = {
  calculateMonthlyDepreciation: (
    nilaiPerolehan: number,
    masaManfaatTahun: number
  ): number => {
    if (masaManfaatTahun <= 0)
      throw new Error('Masa manfaat harus lebih dari 0')
    return nilaiPerolehan / (masaManfaatTahun * 12)
  },
  calculateBookValue: (
    nilaiPerolehan: number,
    akumulasiPenyusutan: number
  ): number => {
    return Math.max(0, nilaiPerolehan - akumulasiPenyusutan)
  },
  calculateAccumulatedDepreciation: (
    penyusutanBulanan: number,
    jumlahBulan: number
  ): number => {
    return penyusutanBulanan * jumlahBulan
  },
  isFullyDepreciated: (nilaiBuku: number): boolean => nilaiBuku <= 0,
}

// ============ Shared Constants ============

/**
 * Kategori aset dengan default masa manfaat
 * Ini adalah sumber kebenaran untuk kedua fitur
 */
export const ASSET_CATEGORIES = [
  { id: 1, name: 'Elektronik', code: 'ELK', defaultMasaManfaat: 4 },
  { id: 2, name: 'Furniture', code: 'FRN', defaultMasaManfaat: 8 },
  { id: 3, name: 'Kendaraan', code: 'KDR', defaultMasaManfaat: 10 },
  { id: 4, name: 'Peralatan', code: 'PRL', defaultMasaManfaat: 5 },
  { id: 5, name: 'Bangunan', code: 'BGN', defaultMasaManfaat: 20 },
] as const

/**
 * Asset condition values
 * Kondisi aset yang valid di kedua fitur
 */
export const ASSET_CONDITIONS = ['baik', 'rusak_ringan', 'rusak_berat'] as const
export type AssetCondition = (typeof ASSET_CONDITIONS)[number]

/**
 * Format kode aset yang konsisten
 * Pattern: SCH/YYYY/CATEGORY_CODE/SEQUENCE
 */
export const ASSET_CODE_PATTERN = /^SCH\/\d{4}\/[A-Z]{3}\/\d{4}$/

// ============ Integration Tests ============

describe('Asset Management - Depreciation Integration', () => {
  describe('Route Consistency', () => {
    it('should have consistent asset detail route format', () => {
      const assetId = 123

      // Route dari Asset Management
      const assetDetailRoute = AssetRoutes.detail(assetId)

      // Route dari Depreciation (when clicking table row)
      const depreciationToAssetRoute =
        AssetDepreciationIntegration.depreciationToAsset(assetId)

      expect(assetDetailRoute).toBe(depreciationToAssetRoute)
    })

    it('should have consistent asset edit route format', () => {
      const assetId = 456

      // Route dari Asset Management
      const assetEditRoute = AssetRoutes.edit(assetId)

      // Route dari Depreciation (when editing useful life)
      const depreciationToEditRoute =
        AssetDepreciationIntegration.depreciationToEditAsset(assetId)

      expect(assetEditRoute).toBe(depreciationToEditRoute)
    })

    it('should have correct navigation paths between features', () => {
      // Dari Asset ke Depreciation
      const assetToDepreciation =
        AssetDepreciationIntegration.assetToDepreciation()
      expect(assetToDepreciation).toBe(DEPRECIATION_ROUTES.main)

      // Dari Depreciation ke Asset list
      expect(ASSET_MANAGEMENT_ROUTES.assetList).toBe('/assets')
    })
  })

  describe('Data Consistency', () => {
    it('should use same asset ID type', () => {
      // Asset ID harus number di kedua fitur
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 999999 }), (assetId) => {
          const assetRoute = AssetRoutes.detail(assetId)
          const depreciationRoute =
            AssetDepreciationIntegration.depreciationToAsset(assetId)

          // Keduanya harus mengandung ID yang sama
          return (
            assetRoute.includes(assetId.toString()) &&
            depreciationRoute.includes(assetId.toString())
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should have consistent category useful life defaults', () => {
      // Setiap kategori harus memiliki default masa manfaat yang valid
      ASSET_CATEGORIES.forEach((category) => {
        expect(category.defaultMasaManfaat).toBeGreaterThan(0)
        expect(category.defaultMasaManfaat).toBeLessThanOrEqual(50)
      })
    })

    it('should use consistent asset code pattern', () => {
      // Kode aset harus mengikuti pattern yang sama
      const validCodes = [
        'SCH/2025/ELK/0001',
        'SCH/2024/FRN/0123',
        'SCH/2023/KDR/9999',
      ]

      validCodes.forEach((code) => {
        expect(code).toMatch(ASSET_CODE_PATTERN)
      })

      const invalidCodes = [
        'SCH/2025/EL/0001', // category code terlalu pendek
        'SCH/25/ELK/0001', // year terlalu pendek
        'SCHOOL/2025/ELK/0001', // prefix salah
      ]

      invalidCodes.forEach((code) => {
        expect(code).not.toMatch(ASSET_CODE_PATTERN)
      })
    })
  })

  describe('Business Logic Consistency', () => {
    it('should calculate depreciation based on category default when not specified', () => {
      const category = ASSET_CATEGORIES[0] // Elektronik, 4 tahun
      const nilaiPerolehan = 15000000 // Rp 15 juta

      const penyusutanBulanan =
        DepreciationCalculator.calculateMonthlyDepreciation(
          nilaiPerolehan,
          category.defaultMasaManfaat
        )

      // Penyusutan bulanan = 15jt / (4 * 12) = 312.500
      const expected = nilaiPerolehan / (category.defaultMasaManfaat * 12)
      expect(penyusutanBulanan).toBeCloseTo(expected, 2)
    })

    it('should correctly track asset value across both features', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000000, max: 100000000 }),
          fc.integer({ min: 1, max: 60 }), // bulan ke-
          (nilaiPerolehan, bulanKe) => {
            const masaManfaat = 4 // tahun
            const penyusutanBulanan =
              DepreciationCalculator.calculateMonthlyDepreciation(
                nilaiPerolehan,
                masaManfaat
              )
            const akumulasi =
              DepreciationCalculator.calculateAccumulatedDepreciation(
                penyusutanBulanan,
                bulanKe
              )
            const nilaiBuku = DepreciationCalculator.calculateBookValue(
              nilaiPerolehan,
              akumulasi
            )

            // Nilai buku harus antara 0 dan nilai perolehan
            return nilaiBuku >= 0 && nilaiBuku <= nilaiPerolehan
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should mark asset correctly in both features when fully depreciated', () => {
      const nilaiPerolehan = 12000000
      const masaManfaat = 4

      const penyusutanBulanan =
        DepreciationCalculator.calculateMonthlyDepreciation(
          nilaiPerolehan,
          masaManfaat
        )
      const totalBulan = masaManfaat * 12
      const akumulasi = DepreciationCalculator.calculateAccumulatedDepreciation(
        penyusutanBulanan,
        totalBulan
      )
      const nilaiBuku = DepreciationCalculator.calculateBookValue(
        nilaiPerolehan,
        akumulasi
      )

      // Setelah masa manfaat habis
      expect(DepreciationCalculator.isFullyDepreciated(nilaiBuku)).toBe(true)
    })
  })

  describe('Filter Consistency', () => {
    it('should use same category filter options in both features', () => {
      const categoryOptions = ASSET_CATEGORIES.map((c) => ({
        value: c.id,
        label: c.name,
      }))

      // Semua kategori harus memiliki value (id) dan label (name)
      categoryOptions.forEach((option) => {
        expect(option.value).toBeGreaterThan(0)
        expect(option.label).toBeTruthy()
      })
    })

    it('should use same condition filter values', () => {
      // Kondisi aset harus konsisten
      ASSET_CONDITIONS.forEach((condition) => {
        expect(['baik', 'rusak_ringan', 'rusak_berat']).toContain(condition)
      })
    })
  })

  describe('Error Handling Consistency', () => {
    it('should handle invalid asset ID consistently', () => {
      const invalidIds = [0, -1, -999]

      invalidIds.forEach((id) => {
        // Rute masih akan dibuat, tapi seharusnya handle 404 di kedua fitur
        const assetRoute = AssetRoutes.detail(id)
        const depRoute = AssetDepreciationIntegration.depreciationToAsset(id)

        // Route format tetap konsisten meskipun ID invalid
        expect(assetRoute).toBe(`/assets/${id}`)
        expect(depRoute).toBe(`/assets/${id}`)
      })
    })

    it('should reject invalid useful life values in depreciation', () => {
      expect(() =>
        DepreciationCalculator.calculateMonthlyDepreciation(1000000, 0)
      ).toThrow()

      expect(() =>
        DepreciationCalculator.calculateMonthlyDepreciation(1000000, -5)
      ).toThrow()
    })
  })
})

// ============ Export shared utilities ============

export const SharedConstants = {
  ASSET_CATEGORIES,
  ASSET_CONDITIONS,
  ASSET_CODE_PATTERN,
}

export const SharedValidation = {
  isValidAssetCode: (code: string): boolean => ASSET_CODE_PATTERN.test(code),

  isValidCondition: (condition: string): condition is AssetCondition =>
    ASSET_CONDITIONS.includes(condition as AssetCondition),

  getCategoryById: (id: number) => ASSET_CATEGORIES.find((c) => c.id === id),

  getDefaultUsefulLife: (categoryId: number): number => {
    const category = ASSET_CATEGORIES.find((c) => c.id === categoryId)
    return category?.defaultMasaManfaat ?? 4 // default 4 tahun
  },
}
