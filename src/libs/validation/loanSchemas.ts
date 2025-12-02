import { z } from 'zod'
import type {
  AssetCondition,
  Loan,
  LoanItem,
  LoanStatus,
} from '../../../shared/types/entities'

// Re-export types
export type { Loan, LoanItem, LoanStatus }

// Backward compatibility - simple loan schema for single asset
export const loanSchema = z.object({
  assetId: z.coerce.number().int().positive('Aset wajib dipilih'),
  tanggalPinjam: z.string().min(1, 'Tanggal pinjam wajib diisi'),
  tujuanPinjam: z.string().optional(),
  catatan: z.string().optional(),
})

export type LoanFormValues = z.infer<typeof loanSchema>

// Skema validasi untuk form create peminjaman (multiple items)
export const createLoanSchema = z.object({
  tanggalPinjam: z.string().min(1, 'Tanggal pinjam wajib diisi'),
  tujuanPinjam: z.string().optional(),
  catatan: z.string().optional(),
  items: z
    .array(
      z.object({
        assetId: z.coerce.number().int().positive('Aset wajib dipilih'),
        conditionBefore: z
          .enum(['Baik', 'Rusak Ringan', 'Rusak Berat'])
          .optional(),
      })
    )
    .min(1, 'Minimal 1 aset harus dipinjam'),
})

export type CreateLoanFormInput = z.input<typeof createLoanSchema>
export type CreateLoanFormValues = z.infer<typeof createLoanSchema>

// Skema validasi untuk form pengembalian
export const returnLoanSchema = z.object({
  items: z
    .array(
      z.object({
        assetId: z.coerce.number().int().positive(),
        conditionAfter: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat'], {
          message: 'Kondisi pengembalian wajib dipilih',
        }),
      })
    )
    .min(1, 'Minimal 1 aset harus dikembalikan'),
})

export type ReturnLoanFormInput = z.input<typeof returnLoanSchema>
export type ReturnLoanFormValues = z.infer<typeof returnLoanSchema>

// Skema untuk filter peminjaman
export const loanFilterSchema = z.object({
  status: z.enum(['Dipinjam', 'Dikembalikan', 'Terlambat']).optional(),
  requestedBy: z.coerce.number().optional(),
  assetId: z.coerce.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
})

export type LoanFilterValues = z.infer<typeof loanFilterSchema>

// Type untuk detail peminjaman dengan relasi lengkap
export interface LoanDetail extends Loan {
  requester: {
    id: number
    name: string
    username: string
    email: string | null
  }
  items: Array<
    LoanItem & {
      asset: {
        id: number
        kodeAset: string
        namaBarang: string
        merk: string | null
        kondisi: AssetCondition
      }
    }
  >
}
