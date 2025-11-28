import { z } from 'zod'

// Skema validasi untuk form peminjaman
export const loanSchema = z.object({
  asset_id: z.coerce.number().min(1, 'Aset wajib dipilih'),
  borrower_name: z.string().min(1, 'Nama peminjam wajib diisi'),
  loan_date: z.string().min(1, 'Tanggal pinjam wajib diisi'),
  return_date: z.string().optional(), // Opsional saat meminjam, diisi saat kembali
  notes: z.string().optional(),
})

export type LoanFormValues = z.infer<typeof loanSchema>

// Tipe data Peminjaman dari Backend
export interface Loan {
  id: number
  asset_id: number
  asset_name?: string
  asset_code?: string
  borrower_name: string
  loan_date: string
  return_date?: string | null
  status: 'Dipinjam' | 'Dikembalikan'
  notes?: string
  created_at?: string
  updated_at?: string
}

// Tipe data Detail Peminjaman dengan informasi lengkap
export interface LoanItem {
  assetId: number
  conditionBefore: string
  conditionAfter: string | null
  asset: {
    id: number
    kodeAset: string
    namaBarang: string
    merk: string
    kondisi: string
  }
}

export interface LoanDetail {
  id: number
  requestedBy: number
  tanggalPinjam: string
  tanggalKembali: string | null
  tujuanPinjam: string
  status: 'Dipinjam' | 'Dikembalikan' | 'Terlambat'
  catatan: string | null
  requester: {
    id: number
    name: string
    username: string
    email: string
  }
  items: LoanItem[]
}
