/**
 * Locations API - Menangani operasi untuk Building, Floor, Room
 * Disesuaikan dengan Prisma Schema (camelCase)
 */

import type { Building, Floor, Room } from '../../../shared/types/entities'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { logger } from '../utils/logger'
import { api } from './client'

/**
 * Get Buildings - Mengambil semua gedung
 */
export const getBuildings = async (): Promise<Building[]> => {
  try {
    logger.info('Locations API', 'Mengambil daftar gedung')
    const response = await api.get<Building[]>('/buildings')
    logger.success(
      'Locations API',
      `Berhasil mengambil ${response.data.length} gedung`
    )
    return response.data
  } catch (error: unknown) {
    logger.error('Locations API', 'Gagal mengambil daftar gedung', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Floors by Building - Mengambil lantai berdasarkan gedung
 */
export const getFloorsByBuilding = async (
  buildingId: number
): Promise<Floor[]> => {
  try {
    logger.info(
      'Locations API',
      `Mengambil lantai untuk gedung ID: ${buildingId}`
    )
    const response = await api.get<Floor[]>(`/buildings/${buildingId}/floors`)
    logger.success(
      'Locations API',
      `Berhasil mengambil ${response.data.length} lantai`
    )
    return response.data
  } catch (error: unknown) {
    logger.error('Locations API', 'Gagal mengambil daftar lantai', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Rooms - Mengambil semua ruangan dengan relasi
 */
export const getRooms = async (): Promise<Room[]> => {
  try {
    logger.info('Locations API', 'Mengambil daftar ruangan')
    const response = await api.get<Room[]>('/rooms')
    logger.success(
      'Locations API',
      `Berhasil mengambil ${response.data.length} ruangan`
    )
    return response.data
  } catch (error: unknown) {
    logger.error('Locations API', 'Gagal mengambil daftar ruangan', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Rooms by Floor - Mengambil ruangan berdasarkan lantai
 */
export const getRoomsByFloor = async (floorId: number): Promise<Room[]> => {
  try {
    logger.info(
      'Locations API',
      `Mengambil ruangan untuk lantai ID: ${floorId}`
    )
    const response = await api.get<Room[]>(`/floors/${floorId}/rooms`)
    logger.success(
      'Locations API',
      `Berhasil mengambil ${response.data.length} ruangan`
    )
    return response.data
  } catch (error: unknown) {
    logger.error('Locations API', 'Gagal mengambil daftar ruangan', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}
