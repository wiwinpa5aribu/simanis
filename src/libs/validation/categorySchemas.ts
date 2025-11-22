import { z } from 'zod'

// Skema validasi untuk form kategori aset
// Memastikan nama kategori diisi dan memiliki panjang minimal
export const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi').max(100, 'Nama kategori maksimal 100 karakter'),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

// Tipe data Kategori dari Backend
export interface Category {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}
