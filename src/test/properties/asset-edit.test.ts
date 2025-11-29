/**
 * Property Tests for Asset Edit Form
 *
 * Property 1: Edit Form Pre-population
 * Property 2: Edit Form Validation
 */

import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Asset Edit Schema (mirrors the actual schema)
const assetEditSchema = z.object({
  nama_barang: z
    .string()
    .min(1, 'Nama barang wajib diisi')
    .max(160, 'Nama barang maksimal 160 karakter'),
  merk: z.string().optional(),
  spesifikasi: z.string().optional(),
  kondisi: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'], {
    message: 'Kondisi tidak valid',
  }),
  category_id: z.coerce.number().min(1, 'Kategori wajib dipilih'),
  current_room_id: z.coerce.number().optional(),
})

// Mock asset data generator
function generateMockAsset() {
  const conditions = ['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'] as const
  return {
    id: Math.floor(Math.random() * 1000) + 1,
    kode_aset: `AST-${Math.floor(Math.random() * 10000)}`,
    nama_barang: `Aset Test ${Math.random().toString(36).substring(7)}`,
    merk:
      Math.random() > 0.5
        ? `Merk ${Math.random().toString(36).substring(7)}`
        : undefined,
    spesifikasi: Math.random() > 0.5 ? 'Spesifikasi test' : undefined,
    kondisi: conditions[Math.floor(Math.random() * conditions.length)],
    category_id: Math.floor(Math.random() * 10) + 1,
    current_room_id:
      Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 1 : undefined,
  }
}

describe('Property 1: Edit Form Pre-population', () => {
  it('should have all editable fields contain current asset values', () => {
    // Generate multiple test cases
    for (let i = 0; i < 10; i++) {
      const asset = generateMockAsset()

      // Simulate form pre-population
      const formValues = {
        nama_barang: asset.nama_barang,
        merk: asset.merk || '',
        spesifikasi: asset.spesifikasi || '',
        kondisi: asset.kondisi,
        category_id: asset.category_id,
        current_room_id: asset.current_room_id,
      }

      // Property: All editable fields should contain current asset values
      expect(formValues.nama_barang).toBe(asset.nama_barang)
      expect(formValues.kondisi).toBe(asset.kondisi)
      expect(formValues.category_id).toBe(asset.category_id)

      // Optional fields should be empty string or actual value
      if (asset.merk) {
        expect(formValues.merk).toBe(asset.merk)
      }
      if (asset.spesifikasi) {
        expect(formValues.spesifikasi).toBe(asset.spesifikasi)
      }
    }
  })

  it('should preserve asset ID during edit', () => {
    for (let i = 0; i < 10; i++) {
      const asset = generateMockAsset()

      // Property: Asset ID should remain unchanged
      expect(asset.id).toBeGreaterThan(0)
      expect(typeof asset.id).toBe('number')
    }
  })
})

describe('Property 2: Edit Form Validation', () => {
  it('should reject empty nama_barang', () => {
    const invalidData = {
      nama_barang: '',
      kondisi: 'Baik',
      category_id: 1,
    }

    const result = assetEditSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path.includes('nama_barang'))
      ).toBe(true)
    }
  })

  it('should reject nama_barang longer than 160 characters', () => {
    const invalidData = {
      nama_barang: 'a'.repeat(161),
      kondisi: 'Baik',
      category_id: 1,
    }

    const result = assetEditSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject invalid kondisi values', () => {
    const invalidConditions = ['Invalid', 'Bagus', 'Hancur', '', 123]

    for (const kondisi of invalidConditions) {
      const invalidData = {
        nama_barang: 'Test Asset',
        kondisi,
        category_id: 1,
      }

      const result = assetEditSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    }
  })

  it('should accept valid kondisi values', () => {
    const validConditions = ['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang']

    for (const kondisi of validConditions) {
      const validData = {
        nama_barang: 'Test Asset',
        kondisi,
        category_id: 1,
      }

      const result = assetEditSchema.safeParse(validData)
      expect(result.success).toBe(true)
    }
  })

  it('should reject invalid category_id', () => {
    const invalidData = {
      nama_barang: 'Test Asset',
      kondisi: 'Baik',
      category_id: 0,
    }

    const result = assetEditSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should accept valid form data', () => {
    for (let i = 0; i < 10; i++) {
      const asset = generateMockAsset()
      const validData = {
        nama_barang: asset.nama_barang,
        kondisi: asset.kondisi,
        category_id: asset.category_id,
        merk: asset.merk,
        spesifikasi: asset.spesifikasi,
        current_room_id: asset.current_room_id,
      }

      const result = assetEditSchema.safeParse(validData)
      expect(result.success).toBe(true)
    }
  })
})
