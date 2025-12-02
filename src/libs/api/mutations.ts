/**
 * Mutations API - Menangani mutasi/perpindahan aset
 * Fungsi-fungsi untuk mengelola lokasi dan perpindahan aset
 */

import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { assertValidId, isDefined } from '../utils/guards'
import { logger } from '../utils/logger'
import { api } from './client'

export interface Room {
  id: number
  name: string
  description?: string
}

export interface Mutation {
  id: number
  asset_id: number
  from_room_id?: number
  to_room_id: number
  from_room_name?: string
  to_room_name?: string
  date: string
  notes?: string
  created_at: string
}

export interface CreateMutationPayload {
  asset_id: number
  to_room_id: number
  date: string
  notes?: string
}

/**
 * Get Rooms - Mengambil semua daftar ruangan/lokasi
 * @returns Array of rooms
 * @throws Error jika gagal mengambil data
 */
export const getRooms = async (): Promise<Room[]> => {
  try {
    logger.info('Mutations API', 'Mengambil daftar ruangan')

    const response = await api.get<Room[]>('/rooms')

    logger.success(
      'Mutations API',
      `Berhasil mengambil ${response.data.length} ruangan`
    )

    return response.data
  } catch (error: unknown) {
    logger.error('Mutations API', 'Gagal mengambil daftar ruangan', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Asset Mutations - Mengambil riwayat mutasi untuk aset tertentu
 * @param assetId - ID aset
 * @returns Array of mutations
 * @throws Error jika gagal mengambil data
 */
export const getAssetMutations = async (
  assetId: number
): Promise<Mutation[]> => {
  try {
    logger.info(
      'Mutations API',
      `Mengambil riwayat mutasi untuk aset ID: ${assetId}`
    )

    const response = await api.get<Mutation[]>(`/assets/${assetId}/mutations`)

    logger.success(
      'Mutations API',
      `Berhasil mengambil ${response.data.length} mutasi`
    )

    return response.data
  } catch (error: unknown) {
    logger.error(
      'Mutations API',
      `Gagal mengambil mutasi untuk aset ID: ${assetId}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Create Mutation - Membuat mutasi baru (memindahkan aset)
 * @param data - Data mutasi
 * @returns Mutation yang baru dibuat
 * @throws Error jika gagal membuat mutasi
 */
export const createMutation = async (
  data: CreateMutationPayload
): Promise<Mutation> => {
  try {
    // Defensive: Validasi data input
    if (!isDefined(data)) {
      logger.error('createMutation', 'Data is null or undefined')
      throw new Error('Data mutasi harus diisi')
    }

    assertValidId(data.asset_id, 'createMutation', 'Asset ID')
    assertValidId(data.to_room_id, 'createMutation', 'Room ID')

    logger.info('Mutations API', 'Membuat mutasi baru', {
      assetId: data.asset_id,
      toRoomId: data.to_room_id,
      date: data.date,
    })

    const response = await api.post<Mutation>('/mutations', data)

    // Defensive: Validasi response
    if (!isDefined(response.data)) {
      logger.error('Mutations API', 'Empty response after create')
      throw new Error('Gagal membuat mutasi: response kosong')
    }

    logger.success('Mutations API', 'Berhasil membuat mutasi', {
      id: response.data.id,
      toRoom: response.data.to_room_name,
    })

    return response.data
  } catch (error: unknown) {
    logger.error('Mutations API', 'Gagal membuat mutasi', error, {
      assetId: data.asset_id,
    })
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
  }
}
