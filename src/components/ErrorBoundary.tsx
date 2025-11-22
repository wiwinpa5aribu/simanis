/**
 * Error Boundary Component
 * Menangkap error di React component tree dan menampilkan fallback UI
 * Mencegah aplikasi crash total saat terjadi error
 */

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { logger } from '../libs/utils/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  /**
   * Update state ketika error terjadi
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  /**
   * Log error ke console untuk debugging
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error dengan detail lengkap
    logger.error('ErrorBoundary', 'Terjadi error di component tree', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: 'Root',
    })

    // Update state dengan error info
    this.setState({
      errorInfo,
    })
  }

  /**
   * Reset error state
   */
  handleReset = (): void => {
    logger.info('ErrorBoundary', 'Reset error state')
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Jika ada custom fallback, gunakan itu
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Terjadi Kesalahan
            </h2>

            <p className="text-gray-600 text-center mb-4">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau
              hubungi administrator.
            </p>

            {/* Detail error (hanya tampil di development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
                <p className="font-semibold text-red-800 mb-1">Detail Error:</p>
                <p className="text-red-700 font-mono text-xs break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
