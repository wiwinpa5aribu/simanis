/**
 * Depreciation Validation Schemas
 * Zod schemas untuk validasi form penyusutan
 */

import { z } from 'zod'

// ============ Filter Schemas ============

export const depreciationFilterSchema = z.object({
  categoryId: z.number().optional(),
  year: z.number().min(2000).max(2100).optional(),
  month: z.number().min(1).max(12).optional(),
  sortBy: z
    .enum(['kodeAset', 'namaBarang', 'nilaiBuku', 'akumulasiPenyusutan'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export type DepreciationFilterInput = z.input<typeof depreciationFilterSchema>
export type DepreciationFilterValues = z.output<typeof depreciationFilterSchema>

// ============ Calculate Depreciation Schema ============

export const calculateDepreciationSchema = z.object({
  month: z
    .number({ required_error: 'Bulan wajib diisi' })
    .min(1, 'Bulan harus antara 1-12')
    .max(12, 'Bulan harus antara 1-12'),
  year: z
    .number({ required_error: 'Tahun wajib diisi' })
    .min(2000, 'Tahun minimal 2000')
    .max(2100, 'Tahun maksimal 2100'),
})

export type CalculateDepreciationInput = z.input<typeof calculateDepreciationSchema>
export type CalculateDepreciationValues = z.output<typeof calculateDepreciationSchema>

// ============ Simulation Schema ============

export const simulateDepreciationSchema = z
  .object({
    assetId: z.number().optional(),
    categoryId: z.number().optional(),
    periodMonths: z
      .number({ required_error: 'Periode wajib diisi' })
      .min(1, 'Periode minimal 1 bulan')
      .max(60, 'Periode maksimal 60 bulan'),
  })
  .refine((data) => data.assetId || data.categoryId, {
    message: 'Pilih aset atau kategori',
    path: ['assetId'],
  })

export type SimulateDepreciationInput = z.input<typeof simulateDepreciationSchema>
export type SimulateDepreciationValues = z.output<typeof simulateDepreciationSchema>

// ============ Update Useful Life Schema ============

export const updateUsefulLifeSchema = z.object({
  categoryId: z.number({ required_error: 'Kategori wajib dipilih' }),
  defaultMasaManfaat: z
    .number({ required_error: 'Masa manfaat wajib diisi' })
    .min(1, 'Masa manfaat minimal 1 tahun')
    .max(20, 'Masa manfaat maksimal 20 tahun'),
})

export type UpdateUsefulLifeInput = z.input<typeof updateUsefulLifeSchema>
export type UpdateUsefulLifeValues = z.output<typeof updateUsefulLifeSchema>

// ============ Report Schema ============

export const depreciationReportSchema = z.object({
  year: z
    .number({ required_error: 'Tahun wajib diisi' })
    .min(2000, 'Tahun minimal 2000')
    .max(2100, 'Tahun maksimal 2100'),
  month: z
    .number({ required_error: 'Bulan wajib diisi' })
    .min(1, 'Bulan harus antara 1-12')
    .max(12, 'Bulan harus antara 1-12'),
  categoryId: z.number().optional(),
})

export type DepreciationReportInput = z.input<typeof depreciationReportSchema>
export type DepreciationReportValues = z.output<typeof depreciationReportSchema>
