/**
 * Auth API - Menangani autentikasi pengguna
 * Fungsi-fungsi untuk login, logout, dan verifikasi token
 */

import { api } from './client'
import type { LoginFormValues } from '../validation/authSchemas'
import type { User } from '../store/authStore'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'

/**
 * Interface untuk response login dari backend
 */
interface LoginResponse {
  user: User
  token: string
}

/**
 * Login - Autentikasi pengguna
 * @param credentials - Username dan password
 * @returns User data dan JWT token
 * @throws Error jika login gagal
 */
export const login = async (
  credentials: LoginFormValues
): Promise<LoginResponse> => {
  try {
    logger.info('Auth API', 'Memulai proses login', {
      username: credentials.username,
    })

    const response = await api.post<LoginResponse>('/auth/login', credentials)

    logger.success('Auth API', 'Login berhasil', {
      userId: response.data.user.id,
      username: response.data.user.name,
    })

    return response.data
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error)

    logger.error('Auth API', 'Login gagal', error, {
      username: credentials.username,
      errorMessage,
    })

    // Throw error dengan pesan yang lebih deskriptif
    throw new Error(errorMessage || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Logout - Menghapus sesi pengguna
 * Jika backend memiliki endpoint logout, uncomment baris di bawah
 * @throws Error jika logout gagal
 */
export const logout = async (): Promise<void> => {
  try {
    logger.info('Auth API', 'Memulai proses logout')

    // Uncomment jika backend memiliki endpoint logout
    // await api.post('/auth/logout')

    logger.success('Auth API', 'Logout berhasil')
  } catch (error: unknown) {
    logger.error('Auth API', 'Logout gagal', error)

    // Tidak throw error karena logout tetap harus berhasil di client side
    // meskipun gagal di server
  }
}

/**
 * Verify Token - Memverifikasi apakah token masih valid
 * @returns User data jika token valid
 * @throws Error jika token tidak valid
 */
export const verifyToken = async (): Promise<User> => {
  try {
    logger.info('Auth API', 'Memverifikasi token')

    const response = await api.get<{ user: User }>('/auth/verify')

    logger.success('Auth API', 'Token valid', {
      userId: response.data.user.id,
    })

    return response.data.user
  } catch (error: unknown) {
    logger.error('Auth API', 'Token tidak valid', error)
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
  }
}
