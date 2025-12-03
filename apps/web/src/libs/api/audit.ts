/**
 * Audit API - Menangani audit trail dan log aktivitas
 * Menyediakan fungsi untuk mengambil dan menampilkan log audit
 */

import { z } from 'zod'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { logger } from '../utils/logger'
import { api } from './client'

// Interface untuk audit log entry
export interface AuditLog {
  id: number
  entity_type: string // Contoh: "asset", "loan", "category"
  entity_id: number
  user_id?: number
  user_name?: string
  action: string // Contoh: "create", "update", "delete"
  timestamp: string // ISO timestamp
  field_changed?: Record<string, unknown> // JSON object berisi field yang berubah
  old_values?: Record<string, unknown> // Nilai lama
  new_values?: Record<string, unknown> // Nilai baru
}

// Interface untuk parameter query
export interface AuditLogQueryParams {
  entity_type?: string
  entity_id?: number
  user_id?: number
  action?: string
  from_date?: string // Format: YYYY-MM-DD
  to_date?: string // Format: YYYY-MM-DD
  page?: number
  pageSize?: number
}

// Interface untuk response dengan pagination
export interface AuditLogListResponse {
  data: AuditLog[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * Get Audit Logs - Mendapatkan daftar audit logs dengan filter dan pagination
 * @param params - Filter parameters
 * @returns Audit logs with pagination
 * @throws Error jika gagal mengambil data
 */
export const getAuditLogs = async (
  params: AuditLogQueryParams
): Promise<AuditLogListResponse> => {
  try {
    logger.info('Audit API', 'Mengambil daftar audit logs', {
      entityType: params.entity_type,
      entityId: params.entity_id,
      userId: params.user_id,
      action: params.action,
      fromDate: params.from_date,
      toDate: params.to_date,
    })

    const response = await api.get<AuditLogListResponse>('/audit-logs', {
      params: {
        entity_type: params.entity_type,
        entity_id: params.entity_id,
        user_id: params.user_id,
        action: params.action,
        from_date: params.from_date,
        to_date: params.to_date,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
      },
    })

    // Validasi response dengan Zod untuk konsistensi dengan API lain
    const auditLogSchema = z.object({
      id: z.number(),
      entity_type: z.string(),
      entity_id: z.number(),
      user_id: z.number().optional(),
      user_name: z.string().optional(),
      action: z.string(),
      timestamp: z.string(),
      field_changed: z.record(z.string(), z.any()).optional(),
      old_values: z.record(z.string(), z.any()).optional(),
      new_values: z.record(z.string(), z.any()).optional(),
    })

    const responseSchema = z.object({
      data: z.array(auditLogSchema),
      pagination: z.object({
        page: z.number(),
        pageSize: z.number(),
        total: z.number(),
        totalPages: z.number(),
      }),
    })

    const parsed = responseSchema.safeParse(response.data)
    if (!parsed.success) {
      logger.error('Audit API', 'Response audit logs tidak valid', undefined, {
        issues: parsed.error.issues,
      })
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }

    logger.success(
      'Audit API',
      `Berhasil mengambil ${parsed.data.data.length} audit logs`,
      {
        total: parsed.data.pagination.total,
        page: parsed.data.pagination.page,
      }
    )

    return parsed.data
  } catch (error: unknown) {
    logger.error('Audit API', 'Gagal mengambil daftar audit logs', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Audit Log By ID - Mendapatkan detail audit log by ID
 * @param id - ID audit log
 * @returns Audit log detail
 * @throws Error jika audit log tidak ditemukan
 */
export const getAuditLogById = async (id: number): Promise<AuditLog> => {
  try {
    logger.info('Audit API', `Mengambil detail audit log dengan ID: ${id}`)

    const response = await api.get<AuditLog>(`/audit-logs/${id}`)

    // Validasi response dengan Zod
    const auditLogSchema = z.object({
      id: z.number(),
      entity_type: z.string(),
      entity_id: z.number(),
      user_id: z.number().optional(),
      user_name: z.string().optional(),
      action: z.string(),
      timestamp: z.string(),
      field_changed: z.record(z.string(), z.any()).optional(),
      old_values: z.record(z.string(), z.any()).optional(),
      new_values: z.record(z.string(), z.any()).optional(),
    })

    const parsed = auditLogSchema.safeParse(response.data)
    if (!parsed.success) {
      logger.error(
        'Audit API',
        'Response audit log detail tidak valid',
        undefined,
        {
          issues: parsed.error.issues,
        }
      )
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }

    logger.success('Audit API', `Berhasil mengambil audit log`, {
      id: parsed.data.id,
      entityType: parsed.data.entity_type,
      action: parsed.data.action,
    })

    return parsed.data
  } catch (error: unknown) {
    logger.error(
      'Audit API',
      `Gagal mengambil audit log dengan ID: ${id}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
  }
}
