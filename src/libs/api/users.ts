/**
 * Users API - Menangani operasi manajemen pengguna
 * Fungsi-fungsi untuk mengambil daftar dan detail pengguna
 */

import { api } from './client'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { assertValidId, isDefined } from '../utils/guards'

// Types
export interface User {
  id: number
  name: string
  username: string
  email: string | null
  roles: string[]
  createdAt: string
}

export interface UserQueryParams {
  page?: number
  pageSize?: number
  search?: string
}

export interface PaginatedUsers {
  data: User[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

/**
 * Get Users - Mengambil daftar pengguna dengan pagination dan search
 * @param params - Parameter query (page, pageSize, search)
 * @returns Paginated users
 * @throws Error jika gagal mengambil data
 */
export const getUsers = async (
  params: UserQueryParams = {}
): Promise<PaginatedUsers> => {
  try {
    logger.info('Users API', 'Mengambil daftar pengguna', { ...params })

    const response = await api.get<PaginatedUsers>('/users', { params })

    logger.success(
      'Users API',
      `Berhasil mengambil ${response.data.data.length} pengguna`
    )

    return response.data
  } catch (error: unknown) {
    logger.error('Users API', 'Gagal mengambil daftar pengguna', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get User By ID - Mengambil detail pengguna berdasarkan ID
 * @param id - ID pengguna
 * @returns User detail
 * @throws Error jika pengguna tidak ditemukan
 */
export const getUserById = async (id: number): Promise<User> => {
  try {
    assertValidId(id, 'getUserById', 'User ID')

    logger.info('Users API', `Mengambil detail pengguna dengan ID: ${id}`)

    const response = await api.get<User>(`/users/${id}`)

    if (!isDefined(response.data)) {
      logger.error('Users API', 'Empty response data from server')
      throw new Error('Pengguna tidak ditemukan')
    }

    logger.success(
      'Users API',
      `Berhasil mengambil pengguna: ${response.data.name}`
    )

    return response.data
  } catch (error: unknown) {
    logger.error(
      'Users API',
      `Gagal mengambil pengguna dengan ID: ${id}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
  }
}
