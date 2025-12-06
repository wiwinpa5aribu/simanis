/**
 * Result<T, E> Pattern - Defensive Programming Foundation
 *
 * Menggantikan throw/catch dengan explicit error handling.
 * Setiap operasi mengembalikan Result yang HARUS di-handle.
 *
 * @example
 * const result = await createAsset(data);
 * if (result.isErr()) {
 *   logger.error(result.error);
 *   return;
 * }
 * const asset = result.value;
 */

export type ResultError = {
  code: string
  message: string
  context?: Record<string, unknown>
  timestamp: Date
  correlationId?: string
}

export class Result<T, E = ResultError> {
  private constructor(
    private readonly _value: T | null,
    private readonly _error: E | null,
    private readonly _isSuccess: boolean
  ) {}

  static ok<T>(value: T): Result<T, never> {
    return new Result(value, null, true) as Result<T, never>
  }

  static err<E = ResultError>(error: E): Result<never, E> {
    return new Result(null, error, false) as Result<never, E>
  }

  static fromError(
    code: string,
    message: string,
    context?: Record<string, unknown>
  ): Result<never, ResultError> {
    return Result.err({
      code,
      message,
      context,
      timestamp: new Date(),
    })
  }

  isOk(): this is Result<T, never> {
    return this._isSuccess
  }

  isErr(): this is Result<never, E> {
    return !this._isSuccess
  }

  get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from error result')
    }
    return this._value as T
  }

  get error(): E {
    if (this._isSuccess) {
      throw new Error('Cannot get error from success result')
    }
    return this._error as E
  }

  /**
   * Unwrap dengan default value jika error
   */
  unwrapOr(defaultValue: T): T {
    return this._isSuccess ? (this._value as T) : defaultValue
  }

  /**
   * Map value jika success
   */
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._isSuccess) {
      return Result.ok(fn(this._value as T))
    }
    return Result.err(this._error as E)
  }

  /**
   * Map error jika failure
   */
  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    if (!this._isSuccess) {
      return Result.err(fn(this._error as E))
    }
    return Result.ok(this._value as T)
  }

  /**
   * FlatMap untuk chaining Results
   */
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this._isSuccess) {
      return fn(this._value as T)
    }
    return Result.err(this._error as E)
  }

  /**
   * Match pattern - handle both cases explicitly
   */
  match<U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U {
    if (this._isSuccess) {
      return handlers.ok(this._value as T)
    }
    return handlers.err(this._error as E)
  }

  /**
   * Convert to JSON for logging/debugging
   */
  toJSON(): { success: boolean; value?: T; error?: E } {
    if (this._isSuccess) {
      return { success: true, value: this._value as T }
    }
    return { success: false, error: this._error as E }
  }
}

/**
 * Async Result wrapper - untuk async operations
 */
export type AsyncResult<T, E = ResultError> = Promise<Result<T, E>>

/**
 * Helper untuk wrap async functions yang bisa throw
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorCode = 'UNKNOWN_ERROR'
): AsyncResult<T> {
  try {
    const value = await fn()
    return Result.ok(value)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return Result.fromError(errorCode, message, {
      originalError: error,
    })
  }
}

/**
 * Combine multiple Results - all must succeed
 */
export function combineResults<T>(
  results: Result<T, ResultError>[]
): Result<T[], ResultError> {
  const values: T[] = []
  for (const result of results) {
    if (result.isErr()) {
      return Result.err(result.error)
    }
    values.push(result.value)
  }
  return Result.ok(values)
}
