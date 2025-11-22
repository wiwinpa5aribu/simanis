/**
 * Reports API - Menangani generate dan download laporan
 * Menyediakan fungsi untuk generate dan download laporan KIB
 */

import { api } from './client'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { z } from 'zod'

// Interface untuk filter laporan KIB
export interface KIBReportFilters {
  category_id?: number
  room_id?: number
  condition?: 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Hilang'
  from_date?: string // Format: YYYY-MM-DD
  to_date?: string // Format: YYYY-MM-DD
}

// Interface untuk response generate report
export interface GenerateReportResponse {
  report_id: string
  status: 'processing' | 'completed' | 'failed'
  download_url?: string
  message?: string
}

/**
 * Generate KIB Report - Generate laporan KIB
 * Backend akan memproses dan mengembalikan ID report
 * @param filters - Filter laporan
 * @param format - Format laporan (pdf atau excel)
 * @returns Report response dengan ID dan status
 * @throws Error jika gagal generate laporan
 */
export const generateKIBReport = async (
  filters: KIBReportFilters,
  format: 'pdf' | 'excel' = 'pdf'
): Promise<GenerateReportResponse> => {
  try {
    logger.info('Reports API', 'Generate laporan KIB', {
      filters,
      format,
    })

    const response = await api.post<GenerateReportResponse>(
      '/reports/kib/generate',
      {
        ...filters,
        format,
      }
    )

    const responseSchema = z.object({
      report_id: z.string(),
      status: z.enum(['processing', 'completed', 'failed']),
      download_url: z.string().url().optional(),
      message: z.string().optional(),
    })

    const parsed = responseSchema.safeParse(response.data)
    if (!parsed.success) {
      logger.error('Reports API', 'Response generate tidak valid', undefined, {
        issues: parsed.error.issues,
      })
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }

    logger.success('Reports API', 'Berhasil generate laporan KIB', {
      reportId: parsed.data.report_id,
      status: parsed.data.status,
    })

    return parsed.data
  } catch (error: unknown) {
    logger.error('Reports API', 'Gagal generate laporan KIB', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Check Report Status - Cek status report (untuk polling)
 * @param reportId - ID report
 * @returns Report status
 * @throws Error jika gagal cek status
 */
export const checkReportStatus = async (
  reportId: string
): Promise<GenerateReportResponse> => {
  try {
    logger.info('Reports API', `Cek status report: ${reportId}`)

    const response = await api.get<GenerateReportResponse>(
      `/reports/kib/${reportId}/status`
    )

    const responseSchema = z.object({
      report_id: z.string(),
      status: z.enum(['processing', 'completed', 'failed']),
      download_url: z.string().url().optional(),
      message: z.string().optional(),
    })

    const parsed = responseSchema.safeParse(response.data)
    if (!parsed.success) {
      logger.error('Reports API', 'Response status tidak valid', undefined, {
        issues: parsed.error.issues,
      })
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }

    logger.success('Reports API', `Status report: ${parsed.data.status}`, {
      reportId,
      status: parsed.data.status,
    })

    return parsed.data
  } catch (error: unknown) {
    logger.error('Reports API', `Gagal cek status report: ${reportId}`, error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Download KIB Report - Download report langsung (jika backend mendukung direct download)
 * @param reportId - ID report
 * @returns Blob file untuk download
 * @throws Error jika gagal download
 */
export const downloadKIBReport = async (reportId: string): Promise<Blob> => {
  try {
    logger.info('Reports API', `Download report: ${reportId}`)

    const response = await api.get(`/reports/kib/${reportId}/download`, {
      responseType: 'blob',
    })

    logger.success('Reports API', `Berhasil download report: ${reportId}`, {
      size: `${(response.data.size / 1024).toFixed(2)} KB`,
    })

    return response.data
  } catch (error: unknown) {
    logger.error('Reports API', `Gagal download report: ${reportId}`, error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}
