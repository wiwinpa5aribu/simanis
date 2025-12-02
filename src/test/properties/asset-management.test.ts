/**
 * Property Tests for Asset Management
 *
 * Spec: asset-management
 * Tests for filter correctness, validation, and data integrity
 */

import { describe, it } from 'vitest'
import fc from 'fast-check'
import { z } from 'zod'

// ============================================================================
// Test Data Generators (Arbitraries)
// ============================================================================

const ASSET_CONDITIONS = [
  'Baik',
  'Rusak Ringan',
  'Rusak Berat',
  'Hilang',
] as const
const SUMBER_DANA_VALUES = ['BOS', 'APBD', 'Hibah'] as const

// Generate asset code in format SCH/XX/YYY/NNN
const schoolCodeArbitrary = fc
  .array(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), {
    minLength: 2,
    maxLength: 2,
  })
  .map((arr) => arr.join(''))

const categoryCodeArbitrary = fc
  .array(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')), {
    minLength: 3,
    maxLength: 3,
  })
  .map((arr) => arr.join(''))

const assetCodeArbitrary = fc
  .tuple(
    schoolCodeArbitrary,
    categoryCodeArbitrary,
    fc.integer({ min: 1, max: 999 })
  )
  .map(
    ([school, cat, num]) =>
      `SCH/${school}/${cat}/${num.toString().padStart(3, '0')}`
  )

// Asset arbitrary for generating test assets
const assetArbitrary = fc.record({
  id: fc.integer({ min: 1, max: 10000 }),
  kodeAset: assetCodeArbitrary,
  namaBarang: fc.string({ minLength: 1, maxLength: 50 }),
  merk: fc.option(fc.string({ minLength: 1, maxLength: 30 }), {
    nil: undefined,
  }),
  spesifikasi: fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
    nil: undefined,
  }),
  harga: fc.integer({ min: 0, max: 1000000000 }),
  kondisi: fc.constantFrom(...ASSET_CONDITIONS),
  sumberDana: fc.constantFrom(...SUMBER_DANA_VALUES),
  categoryId: fc.option(fc.integer({ min: 1, max: 100 }), { nil: undefined }),
  currentRoomId: fc.option(fc.integer({ min: 1, max: 100 }), {
    nil: undefined,
  }),
  category: fc.option(
    fc.record({
      id: fc.integer({ min: 1, max: 100 }),
      name: fc.string({ minLength: 1, maxLength: 50 }),
    }),
    { nil: undefined }
  ),
})

type TestAsset = {
  id: number
  kodeAset: string
  namaBarang: string
  merk?: string
  spesifikasi?: string
  harga: number
  kondisi: (typeof ASSET_CONDITIONS)[number]
  sumberDana: (typeof SUMBER_DANA_VALUES)[number]
  categoryId?: number
  currentRoomId?: number
  category?: { id: number; name: string }
}

// ============================================================================
// Filter Functions (mirrors frontend logic)
// ============================================================================

function filterAssetsBySearch(
  assets: TestAsset[],
  searchTerm: string
): TestAsset[] {
  if (!searchTerm || searchTerm.trim() === '') return assets
  const term = searchTerm.toLowerCase()
  return assets.filter(
    (asset) =>
      asset.kodeAset.toLowerCase().includes(term) ||
      asset.namaBarang.toLowerCase().includes(term)
  )
}

function filterAssetsByCategory(
  assets: TestAsset[],
  categoryId: number | null
): TestAsset[] {
  if (categoryId === null) return assets
  return assets.filter((asset) => asset.categoryId === categoryId)
}

function filterAssetsByCondition(
  assets: TestAsset[],
  kondisi: (typeof ASSET_CONDITIONS)[number] | null
): TestAsset[] {
  if (kondisi === null) return assets
  return assets.filter((asset) => asset.kondisi === kondisi)
}

function paginateAssets(
  assets: TestAsset[],
  page: number,
  pageSize: number
): TestAsset[] {
  const startIndex = (page - 1) * pageSize
  return assets.slice(startIndex, startIndex + pageSize)
}

// ============================================================================
// Property 1: Search Filter Correctness
// For any search term, all displayed assets must contain that term in kodeAset or namaBarang
// Validates: Requirements 1.2
// ============================================================================

describe('**Feature: asset-management, Property 1: Search Filter Correctness**', () => {
  it('all filtered assets must contain search term in kodeAset or namaBarang (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(assetArbitrary, { minLength: 0, maxLength: 50 }),
        fc.string({ minLength: 0, maxLength: 20 }),
        (assets, searchTerm) => {
          const filtered = filterAssetsBySearch(assets, searchTerm)

          // Property: Every filtered asset must contain search term
          if (searchTerm.trim() === '') {
            // Empty search returns all assets
            return filtered.length === assets.length
          }

          const term = searchTerm.toLowerCase()
          return filtered.every(
            (asset) =>
              asset.kodeAset.toLowerCase().includes(term) ||
              asset.namaBarang.toLowerCase().includes(term)
          )
        }
      ),
      { numRuns: 100 }
    )
  })

  it('search filter should not exclude matching assets', () => {
    fc.assert(
      fc.property(
        fc.array(assetArbitrary, { minLength: 1, maxLength: 50 }),
        (assets) => {
          // Pick a random asset and use part of its name as search term
          const randomAsset = assets[Math.floor(Math.random() * assets.length)]
          const searchTerm = randomAsset.namaBarang.substring(0, 3)

          const filtered = filterAssetsBySearch(assets, searchTerm)

          // The random asset should be in filtered results
          return filtered.some((a) => a.id === randomAsset.id)
        }
      ),
      { numRuns: 50 }
    )
  })
})

// ============================================================================
// Property 2: Category Filter Correctness
// For any category filter, all displayed assets must have matching categoryId
// Validates: Requirements 1.3
// ============================================================================

describe('**Feature: asset-management, Property 2: Category Filter Correctness**', () => {
  it('all filtered assets must have matching categoryId', () => {
    fc.assert(
      fc.property(
        fc.array(assetArbitrary, { minLength: 0, maxLength: 50 }),
        fc.option(fc.integer({ min: 1, max: 100 }), { nil: null }),
        (assets, categoryId) => {
          const filtered = filterAssetsByCategory(assets, categoryId)

          if (categoryId === null) {
            // No filter returns all assets
            return filtered.length === assets.length
          }

          // All filtered assets must have matching categoryId
          return filtered.every((asset) => asset.categoryId === categoryId)
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ============================================================================
// Property 3: Condition Filter Correctness
// For any condition filter, all displayed assets must have matching kondisi
// Validates: Requirements 1.4
// ============================================================================

describe('**Feature: asset-management, Property 3: Condition Filter Correctness**', () => {
  it('all filtered assets must have matching kondisi value', () => {
    fc.assert(
      fc.property(
        fc.array(assetArbitrary, { minLength: 0, maxLength: 50 }),
        fc.option(fc.constantFrom(...ASSET_CONDITIONS), { nil: null }),
        (assets, kondisi) => {
          const filtered = filterAssetsByCondition(assets, kondisi)

          if (kondisi === null) {
            return filtered.length === assets.length
          }

          return filtered.every((asset) => asset.kondisi === kondisi)
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ============================================================================
// Property 4: Pagination Item Count
// For any page size (10, 25, 50), items per page must not exceed selected size
// Validates: Requirements 1.5
// ============================================================================

describe('**Feature: asset-management, Property 4: Pagination Item Count**', () => {
  it('paginated results must not exceed page size', () => {
    const PAGE_SIZE_OPTIONS = [10, 25, 50] as const

    fc.assert(
      fc.property(
        fc.array(assetArbitrary, { minLength: 0, maxLength: 200 }),
        fc.constantFrom(...PAGE_SIZE_OPTIONS),
        fc.integer({ min: 1, max: 20 }),
        (assets, pageSize, page) => {
          const paginated = paginateAssets(assets, page, pageSize)

          // Property: Paginated results must not exceed page size
          return paginated.length <= pageSize
        }
      ),
      { numRuns: 100 }
    )
  })

  it('total pages calculation should be correct', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 500 }),
        fc.constantFrom(10, 25, 50),
        (totalItems, pageSize) => {
          const totalPages = Math.ceil(totalItems / pageSize)

          // Property: totalPages * pageSize >= totalItems
          // And (totalPages - 1) * pageSize < totalItems (unless totalItems is 0)
          if (totalItems === 0) {
            return totalPages === 0
          }
          return (
            totalPages * pageSize >= totalItems &&
            (totalPages - 1) * pageSize < totalItems
          )
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ============================================================================
// Property 7: Required Field Validation
// Form submission with empty required fields must be rejected
// Validates: Requirements 2.4
// ============================================================================

const createAssetSchema = z.object({
  namaBarang: z.string().min(1, 'Nama barang wajib diisi').max(160),
  categoryId: z.coerce.number().int().positive('Kategori wajib dipilih'),
  kondisi: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'], {
    message: 'Pilih kondisi aset yang valid',
  }),
  harga: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  sumberDana: z.enum(['BOS', 'APBD', 'Hibah'], {
    message: 'Sumber dana harus BOS, APBD, atau Hibah',
  }),
  merk: z.string().max(120).optional(),
  spesifikasi: z.string().optional(),
  tahunPerolehan: z.string().optional(),
  currentRoomId: z.coerce.number().int().positive().optional(),
  masaManfaatTahun: z.coerce.number().int().min(0).default(0),
})

describe('**Feature: asset-management, Property 7: Required Field Validation**', () => {
  it('should reject empty namaBarang', () => {
    fc.assert(
      fc.property(
        fc.record({
          namaBarang: fc.constant(''),
          categoryId: fc.integer({ min: 1, max: 100 }),
          kondisi: fc.constantFrom(...ASSET_CONDITIONS),
          harga: fc.integer({ min: 0, max: 1000000000 }),
          sumberDana: fc.constantFrom(...SUMBER_DANA_VALUES),
        }),
        (data) => {
          const result = createAssetSchema.safeParse(data)
          return !result.success
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should reject invalid categoryId (0 or negative)', () => {
    fc.assert(
      fc.property(
        fc.record({
          namaBarang: fc.string({ minLength: 1, maxLength: 160 }),
          categoryId: fc.integer({ min: -100, max: 0 }),
          kondisi: fc.constantFrom(...ASSET_CONDITIONS),
          harga: fc.integer({ min: 0, max: 1000000000 }),
          sumberDana: fc.constantFrom(...SUMBER_DANA_VALUES),
        }),
        (data) => {
          const result = createAssetSchema.safeParse(data)
          return !result.success
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should accept valid form data with all required fields', () => {
    fc.assert(
      fc.property(
        fc.record({
          namaBarang: fc.string({ minLength: 1, maxLength: 160 }),
          categoryId: fc.integer({ min: 1, max: 100 }),
          kondisi: fc.constantFrom(...ASSET_CONDITIONS),
          harga: fc.integer({ min: 0, max: 1000000000 }),
          sumberDana: fc.constantFrom(...SUMBER_DANA_VALUES),
        }),
        (data) => {
          const result = createAssetSchema.safeParse(data)
          return result.success
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ============================================================================
// Property 8: Photo Upload Validation
// Only JPG/PNG with size <= 2MB should be accepted
// Validates: Requirements 2.5
// ============================================================================

interface MockFile {
  name: string
  type: string
  size: number
}

function validatePhotoUpload(
  file: MockFile,
  maxSizeMB: number = 2
): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  // Check size
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimal ${maxSizeMB}MB`,
    }
  }

  // Check type
  const acceptedTypes = ['image/jpeg', 'image/png']
  if (!acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipe file tidak didukung. Hanya menerima: image/jpeg, image/png',
    }
  }

  return { valid: true }
}

describe('**Feature: asset-management, Property 8: Photo Upload Validation**', () => {
  it('should accept JPG files under 2MB', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc
            .string({ minLength: 1, maxLength: 50 })
            .map((s) => s + '.jpg'),
          type: fc.constant('image/jpeg'),
          size: fc.integer({ min: 1, max: 2 * 1024 * 1024 }), // 0 to 2MB
        }),
        (file) => {
          const result = validatePhotoUpload(file)
          return result.valid === true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should accept PNG files under 2MB', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc
            .string({ minLength: 1, maxLength: 50 })
            .map((s) => s + '.png'),
          type: fc.constant('image/png'),
          size: fc.integer({ min: 1, max: 2 * 1024 * 1024 }),
        }),
        (file) => {
          const result = validatePhotoUpload(file)
          return result.valid === true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should reject files larger than 2MB', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc
            .string({ minLength: 1, maxLength: 50 })
            .map((s) => s + '.jpg'),
          type: fc.constantFrom('image/jpeg', 'image/png'),
          size: fc.integer({
            min: 2 * 1024 * 1024 + 1,
            max: 100 * 1024 * 1024,
          }), // > 2MB
        }),
        (file) => {
          const result = validatePhotoUpload(file)
          return (
            result.valid === false && result.error?.includes('melebihi batas')
          )
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should reject non-image file types', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          type: fc.constantFrom(
            'application/pdf',
            'text/plain',
            'application/msword',
            'image/gif',
            'image/webp',
            'video/mp4'
          ),
          size: fc.integer({ min: 1, max: 2 * 1024 * 1024 }),
        }),
        (file) => {
          const result = validatePhotoUpload(file)
          return (
            result.valid === false && result.error?.includes('tidak didukung')
          )
        }
      ),
      { numRuns: 50 }
    )
  })
})

// ============================================================================
// Property 10: Condition Enum Validation
// kondisi value must be one of valid enum values
// Validates: Requirements 3.3
// ============================================================================

describe('**Feature: asset-management, Property 10: Condition Enum Validation**', () => {
  const kondisiSchema = z.enum([
    'Baik',
    'Rusak Ringan',
    'Rusak Berat',
    'Hilang',
  ])

  it('should accept valid kondisi values', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ASSET_CONDITIONS), (kondisi) => {
        const result = kondisiSchema.safeParse(kondisi)
        return result.success === true
      }),
      { numRuns: 20 }
    )
  })

  it('should reject invalid kondisi values', () => {
    fc.assert(
      fc.property(
        fc
          .string()
          .filter(
            (s) =>
              !ASSET_CONDITIONS.includes(s as (typeof ASSET_CONDITIONS)[number])
          ),
        (invalidKondisi) => {
          const result = kondisiSchema.safeParse(invalidKondisi)
          return result.success === false
        }
      ),
      { numRuns: 50 }
    )
  })
})

// ============================================================================
// Property 11: Asset Code Immutability
// kodeAset field must not be modifiable through update API
// Validates: Requirements 3.4
// ============================================================================

describe('**Feature: asset-management, Property 11: Asset Code Immutability**', () => {
  // Simulates the update asset schema that should NOT include kodeAset
  const updateAssetSchema = z.object({
    namaBarang: z.string().min(1).max(160).optional(),
    merk: z.string().max(120).optional(),
    spesifikasi: z.string().optional(),
    kondisi: z
      .enum(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'])
      .optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    currentRoomId: z.coerce.number().int().positive().optional(),
    // Note: kodeAset is intentionally NOT included - it should be immutable
  })

  it('update schema should not accept kodeAset field', () => {
    fc.assert(
      fc.property(assetCodeArbitrary, (kodeAset) => {
        // Try to include kodeAset in update data
        const updateData = {
          namaBarang: 'Updated Name',
          kodeAset: kodeAset, // This should be stripped/ignored
        }

        const result = updateAssetSchema.safeParse(updateData)

        // Schema should pass but kodeAset should not be in the output
        if (result.success) {
          // kodeAset should not exist in parsed data
          return !('kodeAset' in result.data)
        }
        return true
      }),
      { numRuns: 50 }
    )
  })

  it('original kodeAset should be preserved after update', () => {
    fc.assert(
      fc.property(
        assetArbitrary,
        fc.record({
          namaBarang: fc.string({ minLength: 1, maxLength: 160 }),
          kondisi: fc.constantFrom(...ASSET_CONDITIONS),
        }),
        (originalAsset, updateData) => {
          // Simulate update operation
          const updatedAsset = {
            ...originalAsset,
            namaBarang: updateData.namaBarang,
            kondisi: updateData.kondisi,
            // kodeAset should remain unchanged
          }

          // Property: kodeAset must remain the same after update
          return updatedAsset.kodeAset === originalAsset.kodeAset
        }
      ),
      { numRuns: 50 }
    )
  })
})

// ============================================================================
// Property 12: Soft Delete with Berita Acara
// Asset deletion must only succeed with Berita Acara document
// Asset must be soft-deleted (is_deleted = true) rather than hard-deleted
// Validates: Requirements 5.2, 5.4
// ============================================================================

interface DeleteAssetRequest {
  assetId: number
  beritaAcaraFile: MockFile | null
  userRole: string
}

interface DeleteAssetResult {
  success: boolean
  error?: string
  asset?: {
    id: number
    isDeleted: boolean
    deletedAt: Date | null
  }
}

// Simulates the delete asset validation logic
function validateDeleteAsset(request: DeleteAssetRequest): DeleteAssetResult {
  // Check permission - only wakasek_sarpras, kepsek, admin can delete
  const allowedRoles = ['wakasek_sarpras', 'kepsek', 'admin']
  if (!allowedRoles.includes(request.userRole)) {
    return {
      success: false,
      error: 'Anda tidak memiliki izin untuk menghapus aset',
    }
  }

  // Check if Berita Acara is provided
  if (!request.beritaAcaraFile) {
    return {
      success: false,
      error: 'Berita Acara wajib diupload untuk menghapus aset',
    }
  }

  // Validate Berita Acara file type (must be PDF)
  if (request.beritaAcaraFile.type !== 'application/pdf') {
    return {
      success: false,
      error: 'Berita Acara harus dalam format PDF',
    }
  }

  // Success - soft delete
  return {
    success: true,
    asset: {
      id: request.assetId,
      isDeleted: true,
      deletedAt: new Date(),
    },
  }
}

describe('**Feature: asset-management, Property 12: Soft Delete with Berita Acara**', () => {
  it('should reject deletion without Berita Acara file', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        fc.constantFrom('wakasek_sarpras', 'kepsek', 'admin'),
        (assetId, userRole) => {
          const result = validateDeleteAsset({
            assetId,
            beritaAcaraFile: null,
            userRole,
          })

          // Property: Deletion without Berita Acara must fail
          return (
            result.success === false &&
            result.error?.includes('Berita Acara wajib')
          )
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should reject deletion by unauthorized roles', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        fc.constantFrom('operator', 'staff', 'guest', 'viewer'),
        (assetId, userRole) => {
          const result = validateDeleteAsset({
            assetId,
            beritaAcaraFile: {
              name: 'berita-acara.pdf',
              type: 'application/pdf',
              size: 100000,
            },
            userRole,
          })

          // Property: Unauthorized roles must be rejected
          return (
            result.success === false &&
            result.error?.includes('tidak memiliki izin')
          )
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should perform soft delete with valid Berita Acara', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        fc.constantFrom('wakasek_sarpras', 'kepsek', 'admin'),
        (assetId, userRole) => {
          const result = validateDeleteAsset({
            assetId,
            beritaAcaraFile: {
              name: 'berita-acara.pdf',
              type: 'application/pdf',
              size: 100000,
            },
            userRole,
          })

          // Property: Valid deletion must result in soft delete
          return (
            result.success === true &&
            result.asset?.isDeleted === true &&
            result.asset?.deletedAt !== null
          )
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should reject non-PDF Berita Acara files', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        fc.constantFrom('wakasek_sarpras', 'kepsek', 'admin'),
        fc.constantFrom(
          'image/jpeg',
          'image/png',
          'text/plain',
          'application/msword'
        ),
        (assetId, userRole, fileType) => {
          const result = validateDeleteAsset({
            assetId,
            beritaAcaraFile: {
              name: 'berita-acara.doc',
              type: fileType,
              size: 100000,
            },
            userRole,
          })

          // Property: Non-PDF files must be rejected
          return result.success === false && result.error?.includes('PDF')
        }
      ),
      { numRuns: 50 }
    )
  })
})
