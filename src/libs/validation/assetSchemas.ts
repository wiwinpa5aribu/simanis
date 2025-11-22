import { z } from 'zod'

// Enum Kondisi Aset
export const ASSET_CONDITIONS = ['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'] as const

// Skema validasi untuk form aset (Minimal)
export const assetSchema = z.object({
  kode_aset: z.string().min(1, 'Kode aset wajib diisi'),
  nama_barang: z.string().min(1, 'Nama barang wajib diisi'),
  category_id: z.coerce.number().min(1, 'Kategori wajib dipilih'),
  kondisi: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'], {
    message: 'Pilih kondisi aset yang valid',
  }),
  // Field opsional (bisa dikembangkan nanti)
  merk: z.string().optional(),
  spesifikasi: z.string().optional(),
  tahun_perolehan: z.coerce.number().optional(),
  harga: z.coerce.number().optional(),
  sumber_dana: z.string().optional(),
})

export type AssetFormValues = z.infer<typeof assetSchema>

// Tipe data Aset dari Backend
export interface Asset {
  id: number
  kode_aset: string
  nama_barang: string
  category_id: number
  category_name?: string // Opsional, jika backend join tabel
  kondisi: (typeof ASSET_CONDITIONS)[number]
  merk?: string
  spesifikasi?: string
  tahun_perolehan?: number
  harga?: number
  sumber_dana?: string
  photo_url?: string // URL foto aset
  created_at?: string
  updated_at?: string
}
