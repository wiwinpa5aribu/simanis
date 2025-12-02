/**
 * Reports API - Menangani generate dan download laporan
 * Menyediakan fungsi untuk generate dan download laporan KIB
 */

import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { logger } from '../utils/logger'
import { api } from './client'

// Interface untuk filter laporan KIB
export interface KIBReportFilters {
  category_id?: number
  room_id?: number
  year?: string
  condition?: 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Hilang'
  from_date?: string // Format: YYYY-MM-DD
  to_date?: string // Format: YYYY-MM-DD
}

/**
 * Generate and Download KIB Report
 * @param filters - Filter laporan
 * @returns Blob file untuk download
 * @throws Error jika gagal generate
 */
export const generateAndDownloadKIBReport = async (
  filters: KIBReportFilters
): Promise<Blob> => {
  try {
    logger.info('Reports API', 'Generate dan download laporan KIB', { filters })

    const response = await api.get('/reports/kib', {
      params: {
        categoryId: filters.category_id,
        roomId: filters.room_id,
        year: filters.year ? parseInt(filters.year) : undefined,
      },
      responseType: 'blob',
    })

    logger.success('Reports API', 'Berhasil download laporan KIB', {
      size: `${(response.data.size / 1024).toFixed(2)} KB`,
    })

    return response.data
  } catch (error: unknown) {
    logger.error('Reports API', 'Gagal download laporan KIB', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}
