import { z } from 'zod'
import type {
  Asset,
  AssetCategory,
  AssetCondition,
  SumberDana,
} from '../../../shared/types/entities'

// Re-export types
export type { Asset, AssetCategory, AssetCondition, SumberDana }

// Enum values sesuai Prisma Schema (Title Case)
export const ASSET_CONDITIONS = [
  'Baik',
  'Rusak Ringan',
  'Rusak Berat',
  'Hilang',
] as const
export const SUMBER_DANA_VALUES = ['BOS', 'APBD', 'Hibah'] as const

// Skema validasi untuk form create aset
export const createAssetSchema = z.object({
  namaBarang: z.string().min(1, 'Nama barang wajib diisi').max(160),
  merk: z.string().max(120).optional(),
  spesifikasi: z.string().optional(),
  tahunPerolehan: z.string().optional(), // Format: YYYY-MM-DD
  harga: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  sumberDana: z.enum(['BOS', 'APBD', 'Hibah'], {
    errorMap: () => ({ message: 'Sumber dana harus BOS, APBD, atau Hibah' }),
  }),
  kondisi: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'], {
    errorMap: () => ({ message: 'Pilih kondisi aset yang valid' }),
  }),
  categoryId: z.coerce
    .number()
    .int()
    .positive('Kategori wajib dipilih')
    .optional(),
  masaManfaatTahun: z.coerce.number().int().min(0).default(0),
  currentRoomId: z.coerce.number().int().positive().optional(),
})

// Input type untuk form (sebelum transform)
export type CreateAssetFormInput = z.input<typeof createAssetSchema>

// Output type setelah validasi
export type CreateAssetFormValues = z.infer<typeof createAssetSchema>

// Skema validasi untuk form update aset
export const updateAssetSchema = z.object({
  namaBarang: z.string().min(1).max(160).optional(),
  merk: z.string().max(120).optional(),
  spesifikasi: z.string().optional(),
  kondisi: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang']).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  currentRoomId: z.coerce.number().int().positive().optional(),
})

export type UpdateAssetFormInput = z.input<typeof updateAssetSchema>
export type UpdateAssetFormValues = z.infer<typeof updateAssetSchema>

// Skema untuk filter aset
export const assetFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  kondisi: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang']).optional(),
  roomId: z.coerce.number().optional(),
  buildingId: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
})

export type AssetFilterValues = z.infer<typeof assetFilterSchema>
