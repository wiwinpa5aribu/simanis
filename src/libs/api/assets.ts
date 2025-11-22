/**
 * Assets API - Menangani operasi CRUD untuk aset
 * Fungsi-fungsi untuk mengambil, membuat, mengupdate, dan menghapus aset
 */

import { api } from './client'
import type { AssetFormValues, Asset } from '../validation/assetSchemas'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { assertNonEmptyString, isDefined } from '../utils/guards'

/**
 * Get Assets - Mengambil daftar semua aset
 * @returns Array of assets
 * @throws Error jika gagal mengambil data
 */
export const getAssets = async (): Promise<Asset[]> => {
  try {
    logger.info('Assets API', 'Mengambil daftar aset')

    const response = await api.get<Asset[]>('/assets')

    logger.success(
      'Assets API',
      `Berhasil mengambil ${response.data.length} aset`
    )

    return response.data
  } catch (error: unknown) {
    logger.error('Assets API', 'Gagal mengambil daftar aset', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Asset By ID - Mengambil detail aset berdasarkan ID
 * @param id - ID aset
 * @returns Asset detail
 * @throws Error jika aset tidak ditemukan
 */
export const getAssetById = async (id: string): Promise<Asset> => {
  try {
    // Defensive: Validasi ID tidak kosong
    assertNonEmptyString(id, 'getAssetById', 'Asset ID')

    logger.info('Assets API', `Mengambil detail aset dengan ID: ${id}`)

    const response = await api.get<Asset>(`/assets/${id}`)

    // Defensive: Validasi response data
    if (!isDefined(response.data)) {
      logger.error('Assets API', 'Empty response data from server')
      throw new Error('Asset tidak ditemukan')
    }

    logger.success(
      'Assets API',
      `Berhasil mengambil aset: ${response.data.nama_barang}`
    )

    return response.data
  } catch (error: unknown) {
    logger.error('Assets API', `Gagal mengambil aset dengan ID: ${id}`, error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
  }
}

/**
 * Get Asset By Code - Mengambil detail aset berdasarkan kode
 * @param code - Kode aset
 * @returns Asset detail
 * @throws Error jika aset tidak ditemukan
 */
export const getAssetByCode = async (code: string): Promise<Asset> => {
  try {
    // Defensive: Validasi code tidak kosong
    assertNonEmptyString(code, 'getAssetByCode', 'Kode Aset')

    logger.info('Assets API', `Mengambil aset dengan kode: ${code}`)

    const response = await api.get<Asset>(`/assets/by-code/${code}`)

    // Defensive: Validasi response data
    if (!isDefined(response.data)) {
      logger.error('Assets API', 'Empty response from server')
      throw new Error('Asset tidak ditemukan')
    }

    logger.success(
      'Assets API',
      `Berhasil mengambil aset: ${response.data.nama_barang}`
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
 * @param data - Data aset baru
 * @returns Asset yang baru dibuat
 * @throws Error jika gagal membuat aset
 */
export const createAsset = async (data: AssetFormValues): Promise<Asset> => {
  try {
    // Defensive: Validasi data input
    if (!isDefined(data)) {
      logger.error('createAsset', 'Data is null or undefined')
      throw new Error('Data aset harus diisi')
    }

    assertNonEmptyString(data.nama_barang, 'createAsset', 'Nama barang')

    logger.info('Assets API', 'Membuat aset baru', { name: data.nama_barang })

    const response = await api.post<Asset>('/assets', data)

    // Defensive: Validasi response
    if (!isDefined(response.data)) {
      logger.error('Assets API', 'Empty response after create')
      throw new Error('Gagal membuat aset: response kosong')
    }

    logger.success(
      'Assets API',
      `Berhasil membuat aset: ${response.data.nama_barang}`,
      {
        id: response.data.id,
        code: response.data.kode_aset,
      }
    )

    return response.data
  } catch (error: unknown) {
    logger.error('Assets API', 'Gagal membuat aset', error, {
      assetName: data.nama_barang,
    })
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
  }
}

/**
 * Update Asset - Mengupdate data aset
 * @param id - ID aset yang akan diupdate
 * @param data - Data aset yang baru
 * @returns Asset yang sudah diupdate
 * @throws Error jika gagal mengupdate
 */
export const updateAsset = async (
  id: number,
  data: AssetFormValues
): Promise<Asset> => {
  try {
    logger.info('Assets API', `Mengupdate aset dengan ID: ${id}`, {
      name: data.nama_barang,
    })

    const response = await api.put<Asset>(`/assets/${id}`, data)

    logger.success(
      'Assets API',
      `Berhasil mengupdate aset: ${response.data.nama_barang}`
    )

    return response.data
  } catch (error: unknown) {
    logger.error('Assets API', `Gagal mengupdate aset dengan ID: ${id}`, error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
  }
}

/**
 * Delete Asset - Menghapus aset
 * @param id - ID aset yang akan dihapus
 * @throws Error jika gagal menghapus
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
 * @param id - ID aset
 * @param file - File foto yang akan diupload
 * @returns Asset dengan foto yang sudah diupdate
 * @throws Error jika gagal mengupload
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
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    logger.success(
      'Assets API',
      `Berhasil mengupload foto untuk aset: ${response.data.nama_barang}`
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
