/**
 * Depreciation API - Menangani data penyusutan aset
 * Menyediakan fungsi untuk mengambil data penyusutan bulanan
 * Perhitungan dilakukan di backend, frontend hanya menampilkan
 */

import { api } from './client'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { z } from 'zod'

// Interface untuk entry penyusutan
export interface DepreciationEntry {
  id: number
  asset_id: number
  asset_code: string
  asset_name: string
  category_name?: string
  calculation_date: string // Format: YYYY-MM-DD atau YYYY-MM
  depreciation_value: number // Nilai penyusutan bulan ini
  book_value: number // Nilai buku setelah penyusutan
  accumulated_depreciation?: number // Akumulasi penyusutan total (opsional)
  acquisition_value?: number // Harga perolehan (opsional)
}

// Interface untuk parameter query
export interface DepreciationQueryParams {
  asset_id?: number
  category_id?: number
  month?: number // 1-12
  year?: number // YYYY
  page?: number
  pageSize?: number
}

// Interface untuk response dengan pagination
export interface DepreciationListResponse {
  data: DepreciationEntry[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * Get Depreciation List - Mendapatkan daftar penyusutan dengan filter dan pagination
 * @param params - Filter parameters
 * @returns Depreciation list with pagination
 * @throws Error jika gagal mengambil data
 */
export const getDepreciationList = async (
  params: DepreciationQueryParams
): Promise<DepreciationListResponse> => {
  try {
    logger.info('Depreciation API', 'Mengambil daftar penyusutan', {
      month: params.month,
      year: params.year,
      assetId: params.asset_id,
      categoryId: params.category_id,
    })

    const response = await api.get<DepreciationListResponse>('/depreciations', {
      params: {
        asset_id: params.asset_id,
        category_id: params.category_id,
        month: params.month,
        year: params.year,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
      },
    })

    const entrySchema = z.object({
      id: z.number(),
      asset_id: z.number(),
      asset_code: z.string(),
      asset_name: z.string(),
      category_name: z.string().optional(),
      calculation_date: z.string(),
      depreciation_value: z.number(),
      book_value: z.number(),
      accumulated_depreciation: z.number().optional(),
      acquisition_value: z.number().optional(),
    })

    const responseSchema = z.object({
      data: z.array(entrySchema),
      pagination: z.object({
        page: z.number(),
        pageSize: z.number(),
        total: z.number(),
        totalPages: z.number(),
      }),
    })

    const parsed = responseSchema.safeParse(response.data)
    if (!parsed.success) {
      logger.error('Depreciation API', 'Response penyusutan tidak valid', undefined, {
        issues: parsed.error.issues,
      })
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }

    logger.success(
      'Depreciation API',
      `Berhasil mengambil ${parsed.data.data.length} penyusutan`,
      {
        total: parsed.data.pagination.total,
        page: parsed.data.pagination.page,
      }
    )

    return parsed.data
  } catch (error: unknown) {
    logger.error('Depreciation API', 'Gagal mengambil daftar penyusutan', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}
