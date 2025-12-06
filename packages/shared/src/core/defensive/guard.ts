/**
 * Guard - Input Validation dengan Self-Documenting Errors
 *
 * Defensive programming pattern untuk validasi input.
 * Setiap guard mengembalikan Result dengan error yang jelas.
 *
 * @example
 * const nameResult = Guard.againstEmpty(name, 'name');
 * if (nameResult.isErr()) return nameResult;
 *
 * const rangeResult = Guard.inRange(value, 0, 1000000, 'value');
 * if (rangeResult.isErr()) return rangeResult;
 */

import { Result, type ResultError } from './result'

export type GuardResult = Result<true, ResultError>

export class Guard {
  /**
   * Check if value is not null or undefined
   */
  static againstNullOrUndefined(
    value: unknown,
    argumentName: string
  ): GuardResult {
    if (value === null || value === undefined) {
      return Result.fromError(
        'GUARD_NULL_OR_UNDEFINED',
        `${argumentName} is null or undefined`,
        { argumentName, receivedValue: value }
      )
    }
    return Result.ok(true)
  }

  /**
   * Check if string is not empty
   */
  static againstEmpty(
    value: string | null | undefined,
    argumentName: string
  ): GuardResult {
    const nullCheck = Guard.againstNullOrUndefined(value, argumentName)
    if (nullCheck.isErr()) return nullCheck

    if (value!.trim().length === 0) {
      return Result.fromError(
        'GUARD_EMPTY_STRING',
        `${argumentName} is empty`,
        { argumentName, receivedValue: value }
      )
    }
    return Result.ok(true)
  }

  /**
   * Check if number is within range
   */
  static inRange(
    value: number,
    min: number,
    max: number,
    argumentName: string
  ): GuardResult {
    if (value < min || value > max) {
      return Result.fromError(
        'GUARD_OUT_OF_RANGE',
        `${argumentName} must be between ${min} and ${max}, got ${value}`,
        { argumentName, receivedValue: value, min, max }
      )
    }
    return Result.ok(true)
  }

  /**
   * Check if value is positive number
   */
  static isPositive(value: number, argumentName: string): GuardResult {
    if (value <= 0) {
      return Result.fromError(
        'GUARD_NOT_POSITIVE',
        `${argumentName} must be positive, got ${value}`,
        { argumentName, receivedValue: value }
      )
    }
    return Result.ok(true)
  }

  /**
   * Check if value is non-negative
   */
  static isNonNegative(value: number, argumentName: string): GuardResult {
    if (value < 0) {
      return Result.fromError(
        'GUARD_NEGATIVE',
        `${argumentName} must be non-negative, got ${value}`,
        { argumentName, receivedValue: value }
      )
    }
    return Result.ok(true)
  }

  /**
   * Check if string matches pattern
   */
  static matchesPattern(
    value: string,
    pattern: RegExp,
    argumentName: string,
    patternDescription?: string
  ): GuardResult {
    if (!pattern.test(value)) {
      return Result.fromError(
        'GUARD_PATTERN_MISMATCH',
        `${argumentName} does not match ${patternDescription || 'required pattern'}`,
        { argumentName, receivedValue: value, pattern: pattern.toString() }
      )
    }
    return Result.ok(true)
  }

  /**
   * Check if array is not empty
   */
  static againstEmptyArray<T>(value: T[], argumentName: string): GuardResult {
    if (value.length === 0) {
      return Result.fromError('GUARD_EMPTY_ARRAY', `${argumentName} is empty`, {
        argumentName,
        receivedValue: value,
      })
    }
    return Result.ok(true)
  }

  /**
   * Check if value is one of allowed values
   */
  static isOneOf<T>(
    value: T,
    allowedValues: readonly T[],
    argumentName: string
  ): GuardResult {
    if (!allowedValues.includes(value)) {
      return Result.fromError(
        'GUARD_INVALID_ENUM',
        `${argumentName} must be one of [${allowedValues.join(', ')}], got ${value}`,
        { argumentName, receivedValue: value, allowedValues }
      )
    }
    return Result.ok(true)
  }

  /**
   * Check array length
   */
  static arrayLength(
    value: unknown[],
    min: number,
    max: number,
    argumentName: string
  ): GuardResult {
    if (value.length < min || value.length > max) {
      return Result.fromError(
        'GUARD_ARRAY_LENGTH',
        `${argumentName} length must be between ${min} and ${max}, got ${value.length}`,
        { argumentName, receivedLength: value.length, min, max }
      )
    }
    return Result.ok(true)
  }

  /**
   * Check string length
   */
  static stringLength(
    value: string,
    min: number,
    max: number,
    argumentName: string
  ): GuardResult {
    if (value.length < min || value.length > max) {
      return Result.fromError(
        'GUARD_STRING_LENGTH',
        `${argumentName} length must be between ${min} and ${max}, got ${value.length}`,
        { argumentName, receivedLength: value.length, min, max }
      )
    }
    return Result.ok(true)
  }

  /**
   * Combine multiple guards - all must pass
   */
  static combine(guards: GuardResult[]): GuardResult {
    for (const guard of guards) {
      if (guard.isErr()) {
        return guard
      }
    }
    return Result.ok(true)
  }
}

/**
 * SIMANIS-specific guards for domain validation
 */
export class SIMANISGuard {
  // Asset code pattern: XXX-YYY-NNN (e.g., LAB-IPA-001)
  private static ASSET_CODE_PATTERN = /^[A-Z]{2,5}-[A-Z]{2,5}-\d{3,5}$/

  /**
   * Validate asset code format
   */
  static isValidAssetCode(code: string): GuardResult {
    return Guard.matchesPattern(
      code,
      SIMANISGuard.ASSET_CODE_PATTERN,
      'kodeAset',
      'format XXX-YYY-NNN (contoh: LAB-IPA-001)'
    )
  }

  /**
   * Validate asset value (harga perolehan)
   */
  static isValidAssetValue(value: number): GuardResult {
    return Guard.combine([
      Guard.isNonNegative(value, 'nilaiPerolehan'),
      Guard.inRange(value, 0, 999_999_999_999, 'nilaiPerolehan'), // Max 999 miliar
    ])
  }

  /**
   * Validate useful life (masa manfaat)
   */
  static isValidUsefulLife(years: number): GuardResult {
    return Guard.inRange(years, 1, 50, 'masaManfaat') // 1-50 tahun
  }

  /**
   * Validate kondisi aset
   */
  static isValidKondisi(kondisi: string): GuardResult {
    const validKondisi = ['Baik', 'Rusak Ringan', 'Rusak Berat'] as const
    return Guard.isOneOf(kondisi, validKondisi, 'kondisi')
  }
}
