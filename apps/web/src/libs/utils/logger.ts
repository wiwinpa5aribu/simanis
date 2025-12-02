/**
 * Logger Utility - Sistem logging terpusat untuk debugging
 * Memudahkan tracking error dan monitoring aplikasi
 */

import { DEBUG_CONFIG } from '../../constants'

// Warna untuk console log (memudahkan identifikasi)
const COLORS = {
  INFO: '#3B82F6', // Biru
  SUCCESS: '#10B981', // Hijau
  WARNING: '#F59E0B', // Kuning
  ERROR: '#EF4444', // Merah
  API: '#8B5CF6', // Ungu
} as const

/**
 * Interface untuk log data
 * Menggunakan unknown untuk type safety - data harus di-check sebelum digunakan
 */
interface LogData {
  [key: string]: unknown
}

/**
 * Logger class untuk menangani semua logging
 */
class Logger {
  private enabled: boolean

  constructor() {
    this.enabled = DEBUG_CONFIG.ENABLED
  }

  /**
   * Format timestamp untuk log
   */
  private getTimestamp(): string {
    const now = new Date()
    return now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    })
  }

  /**
   * Log informasi umum
   */
  info(component: string, message: string, data?: LogData): void {
    if (!this.enabled) return

    console.log(
      `%c[${this.getTimestamp()}] [${component}] ℹ️ ${message}`,
      `color: ${COLORS.INFO}; font-weight: bold;`,
      data || ''
    )
  }

  /**
   * Log sukses
   */
  success(component: string, message: string, data?: LogData): void {
    if (!this.enabled) return

    console.log(
      `%c[${this.getTimestamp()}] [${component}] ✅ ${message}`,
      `color: ${COLORS.SUCCESS}; font-weight: bold;`,
      data || ''
    )
  }

  /**
   * Log peringatan
   */
  warning(component: string, message: string, data?: LogData): void {
    if (!this.enabled) return

    console.warn(
      `%c[${this.getTimestamp()}] [${component}] ⚠️ ${message}`,
      `color: ${COLORS.WARNING}; font-weight: bold;`,
      data || ''
    )
  }

  /**
   * Log error dengan detail lengkap
   * Parameter error menggunakan unknown untuk menerima berbagai tipe error
   */
  error(
    component: string,
    message: string,
    error?: unknown,
    additionalData?: LogData
  ): void {
    if (!this.enabled && !DEBUG_CONFIG.LOG_ERRORS) return

    console.group(
      `%c[${this.getTimestamp()}] [${component}] ❌ ${message}`,
      `color: ${COLORS.ERROR}; font-weight: bold;`
    )

    if (error) {
      // Type narrowing: check apakah error adalah Error object
      const errorDetails =
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
              ...additionalData,
            }
          : {
              message: String(error),
              ...additionalData,
            }

      console.error('Error Details:', errorDetails)
    }

    console.groupEnd()
  }

  /**
   * Log API call (request & response)
   */
  api(method: string, url: string, data?: LogData): void {
    if (!this.enabled || !DEBUG_CONFIG.LOG_API_CALLS) return

    console.group(
      `%c[${this.getTimestamp()}] [API] 🌐 ${method.toUpperCase()} ${url}`,
      `color: ${COLORS.API}; font-weight: bold;`
    )

    if (data) {
      console.log('Data:', data)
    }

    console.groupEnd()
  }

  /**
   * Log API response
   * Parameter data menggunakan unknown karena response bisa berbagai bentuk
   */
  apiResponse(
    method: string,
    url: string,
    status: number,
    data?: unknown
  ): void {
    if (!this.enabled || !DEBUG_CONFIG.LOG_API_CALLS) return

    const isSuccess = status >= 200 && status < 300
    const color = isSuccess ? COLORS.SUCCESS : COLORS.ERROR
    const icon = isSuccess ? '✅' : '❌'

    console.group(
      `%c[${this.getTimestamp()}] [API Response] ${icon} ${method.toUpperCase()} ${url} - Status: ${status}`,
      `color: ${color}; font-weight: bold;`
    )

    if (data) {
      console.log('Response Data:', data)
    }

    console.groupEnd()
  }

  /**
   * Log state changes (untuk debugging state management)
   * State menggunakan unknown karena bisa berbagai tipe data
   */
  state(
    component: string,
    action: string,
    oldState?: unknown,
    newState?: unknown
  ): void {
    if (!this.enabled || !DEBUG_CONFIG.LOG_STATE_CHANGES) return

    console.group(
      `%c[${this.getTimestamp()}] [${component}] 🔄 State Change: ${action}`,
      `color: ${COLORS.INFO}; font-weight: bold;`
    )

    if (oldState !== undefined) {
      console.log('Old State:', oldState)
    }

    if (newState !== undefined) {
      console.log('New State:', newState)
    }

    console.groupEnd()
  }

  /**
   * Log component lifecycle
   */
  lifecycle(
    component: string,
    event: 'mount' | 'unmount' | 'update',
    data?: LogData
  ): void {
    if (!this.enabled) return

    const icons = {
      mount: '🎬',
      unmount: '🛑',
      update: '🔄',
    }

    console.log(
      `%c[${this.getTimestamp()}] [${component}] ${icons[event]} Component ${event}`,
      `color: ${COLORS.INFO}; font-weight: bold;`,
      data || ''
    )
  }

  /**
   * Log performance (untuk monitoring kecepatan)
   */
  performance(component: string, operation: string, duration: number): void {
    if (!this.enabled) return

    const color = duration > 1000 ? COLORS.WARNING : COLORS.SUCCESS

    console.log(
      `%c[${this.getTimestamp()}] [${component}] ⚡ ${operation} - ${duration}ms`,
      `color: ${color}; font-weight: bold;`
    )
  }
}

// Export singleton instance
export const logger = new Logger()

// Export helper functions untuk kemudahan penggunaan
export const logInfo = (component: string, message: string, data?: LogData) =>
  logger.info(component, message, data)

export const logSuccess = (
  component: string,
  message: string,
  data?: LogData
) => logger.success(component, message, data)

export const logWarning = (
  component: string,
  message: string,
  data?: LogData
) => logger.warning(component, message, data)

export const logError = (
  component: string,
  message: string,
  error?: unknown,
  data?: LogData
) => logger.error(component, message, error, data)

export const logApi = (method: string, url: string, data?: LogData) =>
  logger.api(method, url, data)

export const logApiResponse = (
  method: string,
  url: string,
  status: number,
  data?: unknown
) => logger.apiResponse(method, url, status, data)
