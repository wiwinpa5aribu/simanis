/**
 * Asset Management - Property-Based Tests
 *
 * Implementasi dari Correctness Properties yang didefinisikan di:
 * @see .kiro/specs/asset-management/design.md
 *
 * Property-based testing menggunakan fast-check untuk memvalidasi
 * behavior sistem dengan input yang di-generate secara random.
 * Ini membantu menemukan edge cases yang tidak terpikirkan.
 */

import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

// ============================================
// ARBITRARIES (Data Generators)
// ============================================

/**
 * Generator untuk Asset yang valid
 */
const assetArbitrary = fc.record({
  id: fc.integer({ min: 1, max: 10000 }),
  kodeAset: fc.stringMatching(/^SCH\/\d{2}\/[A-Z]{3}\/\d{3}$/),
  namaBarang: fc.string({ minLength: 1, maxLength: 160 }),
  categoryId: fc.integer({ min: 1, max: 100 }),
  kondisi: fc.constantFrom('Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'),
  harga: fc.integer({ min: 0, max: 1000000000 }),
  sumberDana: fc.constantFrom('BOS', 'APBD', 'Hibah'),
})

/**
 * Generator untuk Kode Aset yang valid
 */
const kodeAsetArbitrary = fc
  .tuple(
    fc.constantFrom('SCH'),
    fc.integer({ min: 1, max: 99 }).map((n) => n.toString().padStart(2, '0')),
    fc.constantFrom('ELK', 'FRN', 'BKU', 'OLR', 'KDR', 'LAB', 'LNY'),
    fc.integer({ min: 1, max: 999 }).map((n) => n.toString().padStart(3, '0'))
  )
  .map(
    ([prefix, schoolCode, catCode, seq]) =>
      `${prefix}/${schoolCode}/${catCode}/${seq}`
  )

/**
 * Generator untuk search term
 */
const searchTermArbitrary = fc.string({ minLength: 0, maxLength: 50 })

// ============================================
// PROPERTY TESTS
// ============================================

describe('Asset Management Properties', () => {
  /**
   * Property 1: Search Filter Correctness
   * @see design.md - Property 1
   *
   * Untuk setiap search term, semua aset yang ditampilkan harus
   * mengandung term tersebut di kodeAset atau namaBarang (case-insensitive).
   */
  describe('Property 1: Search Filter Correctness', () => {
    const filterAssetsBySearch = <
      T extends { kodeAset: string; namaBarang: string },
    >(
      assets: T[],
      searchTerm: string
    ): T[] => {
      if (!searchTerm.trim()) return assets
      const term = searchTerm.toLowerCase()
      return assets.filter(
        (asset) =>
          asset.kodeAset.toLowerCase().includes(term) ||
          asset.namaBarang.toLowerCase().includes(term)
      )
    }

    it('**Feature: asset-management, Property 1: Search Filter Correctness**', () => {
      fc.assert(
        fc.property(
          fc.array(assetArbitrary, { minLength: 0, maxLength: 100 }),
          searchTermArbitrary,
          (assets, searchTerm) => {
            const filtered = filterAssetsBySearch(assets, searchTerm)
            const termLower = searchTerm.toLowerCase()

            // Semua hasil harus mengandung search term
            return filtered.every(
              (asset) =>
                !searchTerm.trim() || // Empty search returns all
                asset.kodeAset.toLowerCase().includes(termLower) ||
                asset.namaBarang.toLowerCase().includes(termLower)
            )
          }
        ),
        { numRuns: 100 }
      )
    })

    it('empty search should return all assets', () => {
      fc.assert(
        fc.property(
          fc.array(assetArbitrary, { minLength: 0, maxLength: 50 }),
          (assets) => {
            const filtered = filterAssetsBySearch(assets, '')
            return filtered.length === assets.length
          }
        ),
        { numRuns: 50 }
      )
    })
  })

  /**
   * Property 2: Category Filter Correctness
   * @see design.md - Property 2
   */
  describe('Property 2: Category Filter Correctness', () => {
    const filterByCategory = <T extends { categoryId: number }>(
      assets: T[],
      categoryId: number | null
    ): T[] => {
      if (categoryId === null) return assets
      return assets.filter((asset) => asset.categoryId === categoryId)
    }

    it('**Feature: asset-management, Property 2: Category Filter Correctness**', () => {
      fc.assert(
        fc.property(
          fc.array(assetArbitrary, { minLength: 0, maxLength: 100 }),
          fc.integer({ min: 1, max: 100 }),
          (assets, categoryId) => {
            const filtered = filterByCategory(assets, categoryId)
            return filtered.every((asset) => asset.categoryId === categoryId)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 3: Condition Filter Correctness
   * @see design.md - Property 3
   */
  describe('Property 3: Condition Filter Correctness', () => {
    type Kondisi = 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Hilang'

    const filterByKondisi = <T extends { kondisi: string }>(
      assets: T[],
      kondisi: Kondisi | null
    ): T[] => {
      if (kondisi === null) return assets
      return assets.filter((asset) => asset.kondisi === kondisi)
    }

    it('**Feature: asset-management, Property 3: Condition Filter Correctness**', () => {
      fc.assert(
        fc.property(
          fc.array(assetArbitrary, { minLength: 0, maxLength: 100 }),
          fc.constantFrom<Kondisi>(
            'Baik',
            'Rusak Ringan',
            'Rusak Berat',
            'Hilang'
          ),
          (assets, kondisi) => {
            const filtered = filterByKondisi(assets, kondisi)
            return filtered.every((asset) => asset.kondisi === kondisi)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 4: Pagination Item Count
   * @see design.md - Property 4
   */
  describe('Property 4: Pagination Item Count', () => {
    const paginate = <T>(items: T[], page: number, pageSize: number): T[] => {
      const start = (page - 1) * pageSize
      return items.slice(start, start + pageSize)
    }

    it('**Feature: asset-management, Property 4: Pagination Item Count**', () => {
      fc.assert(
        fc.property(
          fc.array(assetArbitrary, { minLength: 0, maxLength: 200 }),
          fc.integer({ min: 1, max: 20 }),
          fc.constantFrom(10, 25, 50),
          (assets, page, pageSize) => {
            const paginated = paginate(assets, page, pageSize)
            return paginated.length <= pageSize
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 5: Asset Code Format Validation
   * @see design.md - Property 5
   */
  describe('Property 5: Asset Code Format Validation', () => {
    const ASSET_CODE_PATTERN = /^SCH\/\d{2}\/[A-Z]{3}\/\d{3}$/

    const validateAssetCode = (code: string): boolean => {
      return ASSET_CODE_PATTERN.test(code)
    }

    it('**Feature: asset-management, Property 5: Asset Code Format Validation**', () => {
      fc.assert(
        fc.property(kodeAsetArbitrary, (kodeAset) => {
          return validateAssetCode(kodeAset)
        }),
        { numRuns: 100 }
      )
    })

    it('should reject invalid asset codes', () => {
      const invalidCodes = [
        'INVALID',
        'SCH/1/ELK/001', // School code should be 2 digits
        'SCH/01/EL/001', // Category should be 3 chars
        'SCH/01/ELK/1', // Sequence should be 3 digits
        'ABC/01/ELK/001', // Should start with SCH
      ]

      invalidCodes.forEach((code) => {
        expect(
          validateAssetCode(code),
          `Code "${code}" should be invalid`
        ).toBe(false)
      })
    })
  })

  /**
   * Property 7: Required Field Validation
   * @see design.md - Property 7
   */
  describe('Property 7: Required Field Validation', () => {
    interface CreateAssetInput {
      namaBarang?: string
      categoryId?: number
      kondisi?: string
      harga?: number
      sumberDana?: string
    }

    const validateCreateAsset = (
      input: CreateAssetInput
    ): { valid: boolean; errors: string[] } => {
      const errors: string[] = []

      if (!input.namaBarang?.trim()) {
        errors.push('namaBarang is required')
      }
      if (!input.categoryId || input.categoryId <= 0) {
        errors.push('categoryId is required')
      }
      if (!input.kondisi) {
        errors.push('kondisi is required')
      }
      if (input.harga === undefined || input.harga < 0) {
        errors.push('harga is required and must be >= 0')
      }
      if (!input.sumberDana) {
        errors.push('sumberDana is required')
      }

      return { valid: errors.length === 0, errors }
    }

    it('**Feature: asset-management, Property 7: Required Field Validation**', () => {
      // Valid input should pass
      fc.assert(
        fc.property(
          fc.record({
            namaBarang: fc.string({ minLength: 1 }),
            categoryId: fc.integer({ min: 1 }),
            kondisi: fc.constantFrom(
              'Baik',
              'Rusak Ringan',
              'Rusak Berat',
              'Hilang'
            ),
            harga: fc.integer({ min: 0 }),
            sumberDana: fc.constantFrom('BOS', 'APBD', 'Hibah'),
          }),
          (input) => {
            const result = validateCreateAsset(input)
            return result.valid === true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should reject when required fields are missing', () => {
      const testCases: CreateAssetInput[] = [
        {}, // All missing
        { namaBarang: 'Test' }, // Missing others
        {
          namaBarang: '',
          categoryId: 1,
          kondisi: 'Baik',
          harga: 1000,
          sumberDana: 'BOS',
        }, // Empty name
      ]

      testCases.forEach((input) => {
        const result = validateCreateAsset(input)
        expect(
          result.valid,
          `Input ${JSON.stringify(input)} should be invalid`
        ).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })
    })
  })

  /**
   * Property 10: Condition Enum Validation
   * @see design.md - Property 10
   */
  describe('Property 10: Condition Enum Validation', () => {
    const VALID_CONDITIONS = [
      'Baik',
      'Rusak Ringan',
      'Rusak Berat',
      'Hilang',
    ] as const

    const isValidKondisi = (kondisi: string): boolean => {
      return (VALID_CONDITIONS as readonly string[]).includes(kondisi)
    }

    it('**Feature: asset-management, Property 10: Condition Enum Validation**', () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_CONDITIONS), (kondisi) =>
          isValidKondisi(kondisi)
        ),
        { numRuns: 20 }
      )
    })

    it('should reject invalid conditions', () => {
      const invalidConditions = ['Good', 'Bad', 'Rusak', 'Baik Sekali', '']
      invalidConditions.forEach((kondisi) => {
        expect(isValidKondisi(kondisi), `"${kondisi}" should be invalid`).toBe(
          false
        )
      })
    })
  })
})

export { assetArbitrary, kodeAsetArbitrary, searchTermArbitrary }
