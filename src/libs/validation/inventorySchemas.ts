/**
 * Skema Validasi untuk Inventarisasi
 *
 * Menggunakan Zod untuk validasi form inventarisasi
 */

import { z } from 'zod'

// Validasi untuk file gambar
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const inventoryCreateSchema = z.object({
  asset_id: z
    .number({
      message: 'Aset wajib dipilih',
    })
    .positive('ID aset harus valid'),

  photo: z
    .instanceof(File, { message: 'File foto wajib diupload' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Ukuran file maksimal 5MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Tipe file harus JPEG, PNG, atau WebP'
    )
    .optional(),

  note: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),
})

export type InventoryCreateInput = z.infer<typeof inventoryCreateSchema>

// Skema untuk filter inventarisasi
export const inventoryFilterSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
})

export type InventoryFilterInput = z.infer<typeof inventoryFilterSchema>
