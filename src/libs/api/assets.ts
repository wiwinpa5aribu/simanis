/**
 * Assets API - Menangani operasi CRUD untuk aset
 * Disesuaikan dengan Prisma Schema (camelCase)
 */

import { api } from './client'
import type {
  CreateAssetFormValues,
  UpdateAssetFormValues,
  Asset,
} from '../validation/assetSchemas'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { assertNonEmptyString, isDefined } from '../utils/guards'

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface AssetFilters {
  search?: string
  categoryId?: number
  kondisi?: string
  roomId?: number
  buildingId?: number
  page?: number
  pageSize?: number
}

/**
 * Get Assets - Mengambil daftar aset dengan pagination dan filter
 */
export const getAssets = async (
  filters?: AssetFilters
): Promise<PaginatedResponse<Asset>> => {
  try {
    logger.info(
      'Assets API',
      'Mengambil daftar aset',
      filters as Record<string, unknown>
    )

    const response = await api.get<Asset[]>('/assets', { params: filters })

    // Handle jika response sudah di-unwrap oleh interceptor
    const data = Array.isArray(response.data) ? response.data : []
    const meta = (
      response as unknown as { meta?: PaginatedResponse<Asset>['meta'] }
    ).meta

    logger.success('Assets API', `Berhasil mengambil ${data.length} aset`)

    return {
      data,
      meta: meta || {
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 10,
        total: data.length,
        totalPages: 1,
      },
    }
  } catch (error: unknown) {
    logger.error('Assets API', 'Gagal mengambil daftar aset', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Asset By ID - Mengambil detail aset berdasarkan ID
 */
export const getAssetById = async (id: number | string): Promise<Asset> => {
  try {
    logger.info('Assets API', `Mengambil detail aset dengan ID: ${id}`)

    const response = await api.get<Asset>(`/assets/${id}`)

    if (!isDefined(response.data)) {
      throw new Error('Asset tidak ditemukan')
    }

    logger.success(
      'Assets API',
      `Berhasil mengambil aset: ${response.data.namaBarang}`
    )
    return response.data
  } catch (error: unknown) {
    logger.error('Assets API', `Gagal mengambil aset dengan ID: ${id}`, error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
  }
}

/**
 * Get Asset By Code - Mengambil detail aset berdasarkan kode
 */
export const getAssetByCode = async (code: string): Promise<Asset> => {
  try {
    assertNonEmptyString(code, 'getAssetByCode', 'Kode Aset')
    logger.info('Assets API', `Mengambil aset dengan kode: ${code}`)

    const response = await api.get<Asset>(
      `/assets/by-code/${encodeURIComponent(code)}`
    )

    if (!isDefined(response.data)) {
      throw new Error('Asset tidak ditemukan')
    }

    logger.success(
      'Assets API',
      `Berhasil mengambil aset: ${response.data.namaBarang}`
    )
    return response.data
  } catch (error: unknown) {
    logger.error(
      'Assets API',
      `Gagal mengambil aset dengan kode: ${code}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
  }
}

/**
 * Create Asset - Membuat aset baru
 */
export const createAsset = async (
  data: CreateAssetFormValues
): Promise<Asset> => {
  try {
    if (!isDefined(data)) {
      throw new Error('Data aset harus diisi')
    }
    assertNonEmptyString(data.namaBarang, 'createAsset', 'Nama barang')

    logger.info('Assets API', 'Membuat aset baru', { name: data.namaBarang })

    const response = await api.post<Asset>('/assets', data)

    if (!isDefined(response.data)) {
      throw new Error('Gagal membuat aset: response kosong')
    }

    logger.success(
      'Assets API',
      `Berhasil membuat aset: ${response.data.namaBarang}`,
      {
        id: response.data.id,
        code: response.data.kodeAset,
      }
    )

    return response.data
  } catch (error: unknown) {
    logger.error('Assets API', 'Gagal membuat aset', error, {
      assetName: data.namaBarang,
    })
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
  }
}

/**
 * Update Asset - Mengupdate data aset
 */
export const updateAsset = async (
  id: number,
  data: UpdateAssetFormValues
): Promise<Asset> => {
  try {
    logger.info('Assets API', `Mengupdate aset dengan ID: ${id}`, data)

    const response = await api.put<Asset>(`/assets/${id}`, data)

    logger.success(
      'Assets API',
      `Berhasil mengupdate aset: ${response.data.namaBarang}`
    )
    return response.data
  } catch (error: unknown) {
    logger.error('Assets API', `Gagal mengupdate aset dengan ID: ${id}`, error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
  }
}

/**
 * Delete Asset - Menghapus aset (soft delete)
 */
export const deleteAsset = async (id: number): Promise<void> => {
  try {
    logger.info('Assets API', `Menghapus aset dengan ID: ${id}`)
    await api.delete(`/assets/${id}`)
    logger.success('Assets API', `Berhasil menghapus aset dengan ID: ${id}`)
  } catch (error: unknown) {
    logger.error('Assets API', `Gagal menghapus aset dengan ID: ${id}`, error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Update Asset Photo - Mengupload/mengupdate foto aset
 */
export const updateAssetPhoto = async (
  id: number,
  file: File
): Promise<Asset> => {
  try {
    logger.info('Assets API', `Mengupload foto untuk aset ID: ${id}`, {
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(2)} KB`,
      fileType: file.type,
    })

    const formData = new FormData()
    formData.append('photo', file)

    const response = await api.put<Asset>(`/assets/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    logger.success(
      'Assets API',
      `Berhasil mengupload foto untuk aset: ${response.data.namaBarang}`
    )
    return response.data
  } catch (error: unknown) {
    logger.error(
      'Assets API',
      `Gagal mengupload foto untuk aset ID: ${id}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Asset QR Code - Mengambil QR code aset
 */
export const getAssetQrCode = async (id: number): Promise<string> => {
  try {
    logger.info('Assets API', `Mengambil QR code untuk aset ID: ${id}`)

    const response = await api.get<{ qrCode: string }>(`/assets/${id}/qr-code`)

    logger.success(
      'Assets API',
      `Berhasil mengambil QR code untuk aset ID: ${id}`
    )
    return response.data.qrCode
  } catch (error: unknown) {
    logger.error(
      'Assets API',
      `Gagal mengambil QR code untuk aset ID: ${id}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Asset Mutation - Riwayat perpindahan lokasi aset
 */
export interface AssetMutation {
  id: number
  assetId: number
  fromRoomId: number | null
  toRoomId: number
  mutatedAt: string
  note: string | null
  fromRoom?: { id: number; name: string } | null
  toRoom?: { id: number; name: string }
}

/**
 * Get Asset Mutations - Mengambil riwayat mutasi lokasi aset
 */
export const getAssetMutations = async (
  assetId: number
): Promise<AssetMutation[]> => {
  try {
    logger.info(
      'Assets API',
      `Mengambil riwayat mutasi untuk aset ID: ${assetId}`
    )

    const response = await api.get<AssetMutation[]>(
      `/assets/${assetId}/mutations`
    )

    const data = Array.isArray(response.data) ? response.data : []

    logger.success(
      'Assets API',
      `Berhasil mengambil ${data.length} riwayat mutasi`
    )
    return data
  } catch (error: unknown) {
    logger.error(
      'Assets API',
      `Gagal mengambil riwayat mutasi untuk aset ID: ${assetId}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}
