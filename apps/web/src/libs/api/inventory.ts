/**
 * Inventory API - Menangani operasi inventarisasi aset
 * Fungsi-fungsi untuk mengambil dan membuat entri inventarisasi
 */

import { z } from 'zod'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { logger } from '../utils/logger'
import { api } from './client'

export interface InventoryRecord {
  id: number
  asset_id: number
  asset_code: string
  asset_name: string
  photo_url?: string
  note?: string
  created_by: number
  created_by_name: string
  created_at: string
  updated_at: string
}

export interface InventoryListParams {
  from?: string // tanggal mulai (YYYY-MM-DD)
  to?: string // tanggal akhir (YYYY-MM-DD)
  search?: string // search by kode atau nama aset
  page?: number
  pageSize?: number
}

export interface InventoryListResponse {
  data: InventoryRecord[]
  total: number
  page: number
  pageSize: number
}

export interface CreateInventoryData {
  asset_id: number
  photo?: File
  note?: string
}

/**
 * Get Inventory List - Mengambil daftar inventarisasi dengan filter
 * @param params - Filter parameters
 * @returns Inventory list with pagination
 * @throws Error jika gagal mengambil data
 */
export async function getInventoryList(params: InventoryListParams = {}) {
  try {
    logger.info('Inventory API', 'Mengambil daftar inventarisasi', { params })

    const { data } = await api.get<InventoryListResponse>('/inventory', {
      params: {
        from: params.from,
        to: params.to,
        search: params.search,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
      },
    })

    const inventoryRecordSchema = z.object({
      id: z.number(),
      asset_id: z.number(),
      asset_code: z.string(),
      asset_name: z.string(),
      photo_url: z.string().optional(),
      note: z.string().optional(),
      created_by: z.number(),
      created_by_name: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    })

    const inventoryListResponseSchema = z.object({
      data: z.array(inventoryRecordSchema),
      total: z.number(),
      page: z.number(),
      pageSize: z.number(),
    })

    const parsed = inventoryListResponseSchema.safeParse(data)
    if (!parsed.success) {
      logger.error(
        'Inventory API',
        'Response inventarisasi tidak valid',
        undefined,
        {
          issues: parsed.error.issues,
        }
      )
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }

    logger.success(
      'Inventory API',
      `Berhasil mengambil ${parsed.data.data.length} inventarisasi`
    )

    return parsed.data
  } catch (error: unknown) {
    logger.error('Inventory API', 'Gagal mengambil daftar inventarisasi', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Create Inventory - Membuat entri inventarisasi baru
 * Jika ada foto, akan diupload sebagai multipart/form-data
 * @param inventoryData - Data inventarisasi
 * @returns Inventory record yang baru dibuat
 * @throws Error jika gagal membuat inventarisasi
 */
export async function createInventory(inventoryData: CreateInventoryData) {
  try {
    logger.info('Inventory API', 'Membuat entri inventarisasi baru', {
      assetId: inventoryData.asset_id,
      hasPhoto: !!inventoryData.photo,
      hasNote: !!inventoryData.note,
    })

    const formData = new FormData()

    formData.append('asset_id', inventoryData.asset_id.toString())

    if (inventoryData.photo) {
      formData.append('photo', inventoryData.photo)
      logger.info('Inventory API', 'Foto ditambahkan', {
        fileName: inventoryData.photo.name,
        fileSize: `${(inventoryData.photo.size / 1024).toFixed(2)} KB`,
      })
    }

    if (inventoryData.note) {
      formData.append('note', inventoryData.note)
    }

    const { data } = await api.post<InventoryRecord>('/inventory', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const inventoryRecordSchema = z.object({
      id: z.number(),
      asset_id: z.number(),
      asset_code: z.string(),
      asset_name: z.string(),
      photo_url: z.string().optional(),
      note: z.string().optional(),
      created_by: z.number(),
      created_by_name: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    })

    const parsed = inventoryRecordSchema.safeParse(data)
    if (!parsed.success) {
      logger.error('Inventory API', 'Response create tidak valid', undefined, {
        issues: parsed.error.issues,
      })
      throw new Error(ERROR_MESSAGES.VALIDATION_ERROR)
    }

    logger.success('Inventory API', 'Berhasil membuat entri inventarisasi', {
      id: parsed.data.id,
      assetCode: parsed.data.asset_code,
    })

    return parsed.data
  } catch (error: unknown) {
    logger.error('Inventory API', 'Gagal membuat entri inventarisasi', error, {
      assetId: inventoryData.asset_id,
    })
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
  }
}

/**
 * Get Inventory By ID - Mengambil detail inventarisasi berdasarkan ID
 * @param id - ID inventarisasi
 * @returns Inventory record detail
 * @throws Error jika inventarisasi tidak ditemukan
 */
export async function getInventoryById(id: number) {
  try {
    logger.info(
      'Inventory API',
      `Mengambil detail inventarisasi dengan ID: ${id}`
    )

    const { data } = await api.get<InventoryRecord>(`/inventory/${id}`)

    const inventoryRecordSchema = z.object({
      id: z.number(),
      asset_id: z.number(),
      asset_code: z.string(),
      asset_name: z.string(),
      photo_url: z.string().optional(),
      note: z.string().optional(),
      created_by: z.number(),
      created_by_name: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    })

    const parsed = inventoryRecordSchema.safeParse(data)
    if (!parsed.success) {
      logger.error('Inventory API', 'Response detail tidak valid', undefined, {
        issues: parsed.error.issues,
      })
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }

    logger.success(
      'Inventory API',
      `Berhasil mengambil inventarisasi: ${parsed.data.asset_name}`
    )

    return parsed.data
  } catch (error: unknown) {
    logger.error(
      'Inventory API',
      `Gagal mengambil inventarisasi dengan ID: ${id}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
  }
}
