/**
 * Structured Logger - Self-Debugging Foundation
 *
 * Logger dengan context tracking untuk debugging yang mudah.
 * Setiap log entry memiliki correlation ID untuk tracing.
 *
 * @example
 * const logger = createLogger('AssetUseCase');
 * logger.info('Creating asset', { kodeAset: 'LAB-IPA-001' });
 * logger.error('Failed to create', { error, context });
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  correlationId?: string
  userId?: string
  module?: string
  action?: string
  duration?: number
  [key: string]: unknown
}

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  module: string
  context: LogContext
}

export interface Logger {
  debug(message: string, context?: LogContext): void
  info(message: string, context?: LogContext): void
  warn(message: string, context?: LogContext): void
  error(message: string, context?: LogContext): void
  child(context: LogContext): Logger
  startTimer(): () => number
}

/**
 * Generate unique correlation ID
 */
export function generateCorrelationId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}`
}

/**
 * Create structured logger for a module
 */
export function createLogger(
  moduleName: string,
  baseContext?: LogContext
): Logger {
  const context: LogContext = {
    module: moduleName,
    ...baseContext,
  }

  const log = (level: LogLevel, message: string, extraContext?: LogContext) => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      module: moduleName,
      context: { ...context, ...extraContext },
    }

    // In production, this would send to Sentry/logging service
    // For now, structured console output
    const output = {
      t: entry.timestamp.toISOString(),
      l: level.toUpperCase(),
      m: moduleName,
      msg: message,
      ...entry.context,
    }

    switch (level) {
      case 'debug':
        console.debug(JSON.stringify(output))
        break
      case 'info':
        console.info(JSON.stringify(output))
        break
      case 'warn':
        console.warn(JSON.stringify(output))
        break
      case 'error':
        console.error(JSON.stringify(output))
        break
    }

    return entry
  }

  return {
    debug: (message, ctx) => log('debug', message, ctx),
    info: (message, ctx) => log('info', message, ctx),
    warn: (message, ctx) => log('warn', message, ctx),
    error: (message, ctx) => log('error', message, ctx),

    child: (childContext) =>
      createLogger(moduleName, { ...context, ...childContext }),

    startTimer: () => {
      const start = performance.now()
      return () => Math.round(performance.now() - start)
    },
  }
}
