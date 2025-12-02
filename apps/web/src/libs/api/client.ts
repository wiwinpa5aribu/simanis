/**
 * API Client - Konfigurasi Axios untuk komunikasi dengan backend
 * File ini menangani semua HTTP request dan response
 * Dilengkapi dengan interceptor untuk logging dan error handling
 */

import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../constants'
import { useAuthStore } from '../store/authStore'
import { env } from '../utils/env'
import { logger } from '../utils/logger'

/**
 * Membuat instance Axios khusus untuk aplikasi SIMANIS
 * Instance ini akan digunakan untuk semua request ke backend
 */
export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * Menambahkan token JWT dan logging setiap request
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      // Tambahkan token JWT ke header Authorization
      const token = useAuthStore.getState().token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        logger.info('API Client', 'Token ditambahkan ke request header')
      }

      // Log detail request untuk debugging
      logger.api(config.method || 'GET', config.url || '', {
        baseURL: config.baseURL,
        params: config.params,
        data: config.data,
      })

      return config
    } catch (error) {
      logger.error('API Client', 'Error di request interceptor', error as Error)
      return Promise.reject(error)
    }
  },
  (error) => {
    logger.error('API Client', 'Request interceptor error', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Menangani response sukses dan error secara global
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response sukses
    logger.apiResponse(
      response.config.method || 'GET',
      response.config.url || '',
      response.status,
      response.data
    )

    // Unwrap backend response format { success: true, data: T, meta?: ... }
    // Jika response memiliki format wrapper, extract data-nya
    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data &&
      'data' in response.data
    ) {
      // Preserve meta for pagination if exists
      const meta = response.data.meta
      response.data = response.data.data
      if (meta) {
        // Attach meta to response for pagination handling
        ;(response as AxiosResponse & { meta?: unknown }).meta = meta
      }
    }

    return response
  },
  (error: AxiosError) => {
    const status = error.response?.status
    const url = error.config?.url || 'unknown'
    const method = error.config?.method || 'GET'

    // Log error dengan detail lengkap
    logger.error(
      'API Client',
      `API Error: ${method.toUpperCase()} ${url}`,
      error,
      {
        status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      }
    )

    // Handle berbagai status code error
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        logger.warning('API Client', 'Unauthorized - Melakukan logout otomatis')
        handleUnauthorized()
        break

      case HTTP_STATUS.FORBIDDEN:
        logger.warning('API Client', ERROR_MESSAGES.FORBIDDEN)
        break

      case HTTP_STATUS.NOT_FOUND:
        logger.warning('API Client', ERROR_MESSAGES.NOT_FOUND)
        break

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        logger.error('API Client', ERROR_MESSAGES.SERVER_ERROR)
        break

      default:
        if (status && status >= 500) {
          logger.error('API Client', ERROR_MESSAGES.SERVER_ERROR)
        } else if (!status) {
          logger.error('API Client', ERROR_MESSAGES.NETWORK_ERROR)
        }
    }

    return Promise.reject(error)
  }
)

/**
 * Handle Unauthorized (401)
 * Logout otomatis dan redirect ke halaman login
 */
function handleUnauthorized(): void {
  try {
    const logout = useAuthStore.getState().logout
    logout()

    logger.info('API Client', 'User telah di-logout')

    // Redirect ke login jika tidak sedang di halaman login
    if (window.location.pathname !== '/login') {
      logger.info('API Client', 'Redirect ke halaman login')
      window.location.href = '/login'
    }
  } catch (error) {
    logger.error('API Client', 'Error saat handle unauthorized', error as Error)
  }
}
