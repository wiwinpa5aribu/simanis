/**
 * Error Boundary - Self-Debugging React Component
 *
 * Catches React errors dan provides context untuk debugging.
 * Integrates dengan Sentry untuk error tracking.
 *
 * @example
 * <ErrorBoundary fallback={<ErrorFallback />} context={{ page: 'assets' }}>
 *   <AssetList />
 * </ErrorBoundary>
 */

import { Component, type ErrorInfo, type ReactNode } from 'react'

export interface ErrorContext {
  componentName?: string
  page?: string
  userId?: string
  action?: string
  [key: string]: unknown
}

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  context?: ErrorContext
  onError?: (error: Error, errorInfo: ErrorInfo, context: ErrorContext) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const context: ErrorContext = {
      ...this.props.context,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    }

    // Log error dengan context
    console.error('[ErrorBoundary] Caught error:', {
      message: error.message,
      stack: error.stack,
      context,
    })

    // Call custom error handler
    this.props.onError?.(error, errorInfo, context)

    // Send to Sentry (if available)
    if (
      typeof window !== 'undefined' &&
      (
        window as unknown as {
          Sentry?: { captureException: (e: Error, ctx: unknown) => void }
        }
      ).Sentry
    ) {
      ;(
        window as unknown as {
          Sentry: { captureException: (e: Error, ctx: unknown) => void }
        }
      ).Sentry.captureException(error, {
        extra: context,
        tags: {
          component: context.componentName,
          page: context.page,
        },
      })
    }

    this.setState({ errorInfo })
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Custom fallback
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.resetError)
      }

      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback
      return (
        <DefaultErrorFallback
          error={this.state.error}
          onReset={this.resetError}
          context={this.props.context}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Default Error Fallback UI
 */
interface DefaultErrorFallbackProps {
  error: Error
  onReset: () => void
  context?: ErrorContext
}

function DefaultErrorFallback({
  error,
  onReset,
  context,
}: DefaultErrorFallbackProps) {
  const isDev = import.meta.env.DEV

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-red-800">
            Terjadi Kesalahan
          </h2>
        </div>

        <p className="mb-4 text-sm text-red-700">
          Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu.
        </p>

        {isDev && (
          <details className="mb-4">
            <summary className="cursor-pointer text-sm font-medium text-red-600">
              Detail Error (Development Only)
            </summary>
            <div className="mt-2 rounded bg-red-100 p-3">
              <p className="mb-2 font-mono text-xs text-red-800">
                {error.message}
              </p>
              {error.stack && (
                <pre className="max-h-40 overflow-auto text-xs text-red-700">
                  {error.stack}
                </pre>
              )}
              {context && (
                <div className="mt-2 border-t border-red-200 pt-2">
                  <p className="text-xs font-medium text-red-600">Context:</p>
                  <pre className="text-xs text-red-700">
                    {JSON.stringify(context, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Coba Lagi
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * HOC untuk wrap component dengan ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  context?: ErrorContext
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary context={{ componentName: displayName, ...context }}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`

  return ComponentWithErrorBoundary
}
