/**
 * Loan Validation Schemas
 * Schemas untuk validasi peminjaman - digunakan di frontend dan backend
 */

import { z } from 'zod'
import {
  assetConditionSchema,
  idSchema,
  loanStatusSchema,
  paginationSchema,
} from './common.schema'

// Kondisi untuk peminjaman (tanpa 'Hilang')
const loanConditionSchema = z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat'], {
  message: 'Pilih kondisi yang valid',
})

// ============================================
// Create Loan Schema (Single Asset - Legacy)
// ============================================

export const loanSchema = z.object({
  assetId: z.coerce.number().int().positive('Aset wajib dipilih'),
  tanggalPinjam: z.string().min(1, 'Tanggal pinjam wajib diisi'),
  tujuanPinjam: z.string().optional(),
  catatan: z.string().optional(),
})

export type LoanFormInput = z.input<typeof loanSchema>
export type LoanFormValues = z.infer<typeof loanSchema>

// ============================================
// Create Loan Schema (Multiple Items)
// ============================================

export const loanItemSchema = z.object({
  assetId: z.coerce.number().int().positive('Aset wajib dipilih'),
  conditionBefore: loanConditionSchema.optional(),
})

export const createLoanSchema = z.object({
  tanggalPinjam: z.string().min(1, 'Tanggal pinjam wajib diisi'),
  tujuanPinjam: z.string().optional(),
  catatan: z.string().optional(),
  items: z.array(loanItemSchema).min(1, 'Minimal 1 aset harus dipinjam'),
})

export type CreateLoanInput = z.input<typeof createLoanSchema>
export type CreateLoanValues = z.infer<typeof createLoanSchema>

// ============================================
// Return Loan Schema
// ============================================

export const returnItemSchema = z.object({
  assetId: z.coerce.number().int().positive(),
  conditionAfter: loanConditionSchema,
})

export const returnLoanSchema = z.object({
  items: z.array(returnItemSchema).min(1, 'Minimal 1 aset harus dikembalikan'),
})

export type ReturnLoanInput = z.input<typeof returnLoanSchema>
export type ReturnLoanValues = z.infer<typeof returnLoanSchema>

// ============================================
// Loan Filter Schema
// ============================================

export const loanFilterSchema = paginationSchema.extend({
  status: loanStatusSchema.optional(),
  requestedBy: z.coerce.number().optional(),
  assetId: z.coerce.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type LoanFilterInput = z.input<typeof loanFilterSchema>
export type LoanFilterValues = z.infer<typeof loanFilterSchema>

// ============================================
// Loan ID Schema (for params)
// ============================================

export const loanIdSchema = z.object({
  id: idSchema,
})

export type LoanIdParams = z.infer<typeof loanIdSchema>
