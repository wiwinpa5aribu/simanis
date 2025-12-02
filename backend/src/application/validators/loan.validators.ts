import { z } from 'zod'

/**
 * Create loan schema
 */
export const createLoanSchema = z.object({
  requestedBy: z.number().int().positive(),
  tanggalPinjam: z.string(), // Will be converted to Date
  tujuanPinjam: z.string().optional(),
  catatan: z.string().optional(),
  items: z
    .array(
      z.object({
        assetId: z.number().int().positive(),
        conditionBefore: z
          .enum(['Baik', 'Rusak Ringan', 'Rusak Berat'])
          .optional(),
      })
    )
    .min(1, 'Minimal 1 aset harus dipinjam'),
})

/**
 * Return loan schema
 */
export const returnLoanSchema = z.object({
  items: z
    .array(
      z.object({
        assetId: z.number().int().positive(),
        conditionAfter: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat'], {
          errorMap: () => ({ message: 'Kondisi pengembalian tidak valid' }),
        }),
      })
    )
    .min(1, 'Minimal 1 aset harus dikembalikan'),
})

export type CreateLoanInput = z.infer<typeof createLoanSchema>
export type ReturnLoanInput = z.infer<typeof returnLoanSchema>
