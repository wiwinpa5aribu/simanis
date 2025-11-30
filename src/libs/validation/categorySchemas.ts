import { z } from 'zod'
import type { AssetCategory } from '../../../shared/types/entities'

// Re-export type
export type { AssetCategory as Category }

// Skema validasi untuk form kategori aset
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Nama kategori wajib diisi')
    .max(64, 'Nama kategori maksimal 64 karakter'),
  description: z.string().optional(),
})

export type CategoryFormInput = z.input<typeof categorySchema>
export type CategoryFormValues = z.infer<typeof categorySchema>
