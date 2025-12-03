/**
 * Error Handling Utilities
 * Helper functions untuk menangani error dengan type-safe
 */

/**
 * Mengekstrak pesan error dari unknown error type
 * Fungsi ini melakukan type narrowing untuk mendapatkan pesan error yang aman
 */
export function getErrorMessage(error: unknown): string {
  // Jika error adalah Error object standar
  if (error instanceof Error) {
    return error.message
  }

  // Jika error adalah object dengan property message
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message
  }

  // Jika error adalah string
  if (typeof error === 'string') {
    return error
  }

  // Fallback untuk tipe error yang tidak diketahui
  return 'Terjadi kesalahan yang tidak diketahui'
}

/**
 * Check apakah error adalah Error object
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * Format error untuk logging atau display
 */
export function formatError(error: unknown): {
  message: string
  name?: string
  stack?: string
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    }
  }

  return {
    message: getErrorMessage(error),
  }
}
