/**
 * Defensive Programming Module
 *
 * Export semua utilities untuk defensive programming:
 * - Result<T, E> pattern
 * - Guard classes
 * - Structured Logger
 */

export { Guard, type GuardResult, SIMANISGuard } from './guard'
export {
  createLogger,
  generateCorrelationId,
  type LogContext,
  type LogEntry,
  type Logger,
  type LogLevel,
} from './logger'
export {
  type AsyncResult,
  combineResults,
  Result,
  type ResultError,
  tryCatch,
} from './result'
