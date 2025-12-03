/**
 * Common Validation Schemas
 * Reusable schemas untuk validasi umum
 */

import { z } from 'zod'

// ============================================
// Enum Values (sesuai Prisma Schema - Title Case)
// ============================================

const ASSET_CONDITIONS = [
  'Baik',
  'Rusak Ringan',
  'Rusak Berat',
  'Hilang',
] as const

export const SUMBER_DANA_VALUES = ['BOS', 'APBD', 'Hibah'] as const

export const LOAN_STATUS_VALUES = [
  'Dipinjam',
  'Dikembalikan',
  'Terlambat',
] as const

// ============================================
// Base Schemas
// ============================================

/** Schema untuk kondisi aset */
export const assetConditionSchema = z.enum(ASSET_CONDITIONS, {
  message: 'Pilih kondisi aset yang valid',
})

/** Schema untuk sumber dana */
export const sumberDanaSchema = z.enum(SUMBER_DANA_VALUES, {
  message: 'Sumber dana harus BOS, APBD, atau Hibah',
})

/** Schema untuk status peminjaman */
export const loanStatusSchema = z.enum(LOAN_STATUS_VALUES, {
  message: 'Status peminjaman tidak valid',
})

// ============================================
// Pagination Schema
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
})

export type PaginationInput = z.input<typeof paginationSchema>
export type PaginationValues = z.infer<typeof paginationSchema>

// ============================================
// ID Schema
// ============================================

export const idSchema = z.coerce.number().int().positive('ID tidak valid')

// ============================================
// Date Schema
// ============================================

/** Schema untuk tanggal dalam format string (YYYY-MM-DD) */
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')

/** Schema untuk tanggal opsional */
export const optionalDateStringSchema = z.string().optional()

// ============================================
// Types
// ============================================

// Types are exported from types/entities.ts to avoid duplication
