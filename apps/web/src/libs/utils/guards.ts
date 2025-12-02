/**
 * Guard Functions - Utility untuk validasi dan type narrowing
 * Digunakan untuk defensive programming pattern
 */

import { logger } from './logger'

/**
 * Type guard untuk memeriksa apakah value defined (bukan null atau undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Memeriksa apakah array tidak kosong
 */
export function isNonEmpty<T>(array: T[]): boolean {
  return Array.isArray(array) && array.length > 0
}

/**
 * Memeriksa apakah value adalah ID yang valid (positive number)
 */
export function isValidId(id: unknown): id is number {
  return typeof id === 'number' && id > 0 && Number.isInteger(id)
}

/**
 * Memeriksa apakah string tidak kosong (tidak null, undefined, atau empty string)
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Memeriksa apakah object tidak kosong (memiliki properties)
 */
export function isNonEmptyObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0
}

/**
 * Guard dengan logging - akan log jika validasi gagal
 */
export function assertDefined<T>(
  value: T | null | undefined,
  context: string,
  varName: string
): asserts value is T {
  if (!isDefined(value)) {
    logger.error(context, `${varName} is null or undefined`)
    throw new Error(`${varName} is required but was ${value}`)
  }
}

/**
 * Guard untuk validasi ID dengan logging
 */
export function assertValidId(
  id: unknown,
  context: string,
  varName = 'ID'
): asserts id is number {
  if (!isValidId(id)) {
    logger.error(context, `Invalid ${varName}`, { value: id })
    throw new Error(`${varName} must be a positive integer, got: ${id}`)
  }
}

/**
 * Guard untuk validasi string dengan logging
 */
export function assertNonEmptyString(
  value: unknown,
  context: string,
  varName: string
): asserts value is string {
  if (!isNonEmptyString(value)) {
    logger.error(context, `${varName} must be a non-empty string`, { value })
    throw new Error(`${varName} must be a non-empty string`)
  }
}

/**
 * Safe array access - return default jika index out of bounds
 */
export function safeArrayAccess<T>(
  array: T[],
  index: number,
  defaultValue: T
): T {
  if (!Array.isArray(array)) {
    logger.error('safeArrayAccess', 'Not an array', { array })
    return defaultValue
  }

  if (index < 0 || index >= array.length) {
    return defaultValue
  }

  return array[index]
}

/**
 * Safe object property access dengan default value
 */
export function safeGet<T extends Record<string, unknown>, K extends keyof T>(
  obj: T | null | undefined,
  key: K,
  defaultValue: T[K]
): T[K] {
  if (!isDefined(obj)) {
    return defaultValue
  }

  return obj[key] ?? defaultValue
}
