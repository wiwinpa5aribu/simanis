/**
 * Asset Validation Schemas
 * Schemas untuk validasi aset - digunakan di frontend dan backend
 */

import { z } from 'zod'
import {
  assetConditionSchema,
  idSchema,
  paginationSchema,
  sumberDanaSchema,
} from './common.schema'

// ============================================
// Create Asset Schema
// ============================================

export const createAssetSchema = z.object({
  kodeAset: z
    .string()
    .min(1, 'Kode aset wajib diisi')
    .max(50, 'Kode aset maksimal 50 karakter'),
  namaBarang: z
    .string()
    .min(1, 'Nama barang wajib diisi')
    .max(160, 'Nama barang maksimal 160 karakter'),
  merk: z.string().max(120, 'Merk maksimal 120 karakter').optional(),
  spesifikasi: z.string().optional(),
  tahunPerolehan: z.string().optional(),
  harga: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  sumberDana: sumberDanaSchema,
  kondisi: assetConditionSchema,
  categoryId: z.coerce
    .number()
    .int()
    .positive('Kategori wajib dipilih')
    .optional(),
  masaManfaatTahun: z.coerce.number().int().min(0).default(0),
  currentRoomId: z.coerce.number().int().positive().optional(),
})

export type CreateAssetInput = z.input<typeof createAssetSchema>
export type CreateAssetValues = z.infer<typeof createAssetSchema>

// Backward compatibility alias
export const assetSchema = createAssetSchema
export type AssetFormValues = CreateAssetValues

// ============================================
// Update Asset Schema
// ============================================

export const updateAssetSchema = z.object({
  kodeAset: z.string().max(50).optional(),
  namaBarang: z.string().min(1).max(160).optional(),
  merk: z.string().max(120).optional(),
  spesifikasi: z.string().optional(),
  kondisi: assetConditionSchema.optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  currentRoomId: z.coerce.number().int().positive().optional(),
})

export type UpdateAssetInput = z.input<typeof updateAssetSchema>
export type UpdateAssetValues = z.infer<typeof updateAssetSchema>

// ============================================
// Asset Filter Schema
// ============================================

export const assetFilterSchema = paginationSchema.extend({
  search: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  kondisi: assetConditionSchema.optional(),
  roomId: z.coerce.number().optional(),
  buildingId: z.coerce.number().optional(),
})

export type AssetFilterInput = z.input<typeof assetFilterSchema>
export type AssetFilterValues = z.infer<typeof assetFilterSchema>

// ============================================
// Asset ID Schema (for params)
// ============================================

export const assetIdSchema = z.object({
  id: idSchema,
})

export type AssetIdParams = z.infer<typeof assetIdSchema>
