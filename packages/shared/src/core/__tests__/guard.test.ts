/**
 * Tests for Guard classes
 */

import { describe, expect, it } from 'vitest'
import { Guard, SIMANISGuard } from '../defensive/guard'

describe('Guard', () => {
  describe('againstNullOrUndefined', () => {
    it('should pass for valid value', () => {
      const result = Guard.againstNullOrUndefined('test', 'name')
      expect(result.isOk()).toBe(true)
    })

    it('should fail for null', () => {
      const result = Guard.againstNullOrUndefined(null, 'name')
      expect(result.isErr()).toBe(true)
      expect(result.error.code).toBe('GUARD_NULL_OR_UNDEFINED')
    })

    it('should fail for undefined', () => {
      const result = Guard.againstNullOrUndefined(undefined, 'name')
      expect(result.isErr()).toBe(true)
    })
  })

  describe('againstEmpty', () => {
    it('should pass for non-empty string', () => {
      const result = Guard.againstEmpty('hello', 'name')
      expect(result.isOk()).toBe(true)
    })

    it('should fail for empty string', () => {
      const result = Guard.againstEmpty('', 'name')
      expect(result.isErr()).toBe(true)
      expect(result.error.code).toBe('GUARD_EMPTY_STRING')
    })

    it('should fail for whitespace only', () => {
      const result = Guard.againstEmpty('   ', 'name')
      expect(result.isErr()).toBe(true)
    })
  })

  describe('inRange', () => {
    it('should pass for value in range', () => {
      const result = Guard.inRange(50, 0, 100, 'value')
      expect(result.isOk()).toBe(true)
    })

    it('should pass for boundary values', () => {
      expect(Guard.inRange(0, 0, 100, 'value').isOk()).toBe(true)
      expect(Guard.inRange(100, 0, 100, 'value').isOk()).toBe(true)
    })

    it('should fail for value out of range', () => {
      const result = Guard.inRange(150, 0, 100, 'value')
      expect(result.isErr()).toBe(true)
      expect(result.error.code).toBe('GUARD_OUT_OF_RANGE')
    })
  })

  describe('isOneOf', () => {
    it('should pass for valid enum value', () => {
      const result = Guard.isOneOf('Baik', ['Baik', 'Rusak'], 'kondisi')
      expect(result.isOk()).toBe(true)
    })

    it('should fail for invalid enum value', () => {
      const result = Guard.isOneOf('Invalid', ['Baik', 'Rusak'], 'kondisi')
      expect(result.isErr()).toBe(true)
      expect(result.error.code).toBe('GUARD_INVALID_ENUM')
    })
  })

  describe('combine', () => {
    it('should pass when all guards pass', () => {
      const result = Guard.combine([
        Guard.againstEmpty('test', 'name'),
        Guard.inRange(50, 0, 100, 'value'),
      ])
      expect(result.isOk()).toBe(true)
    })

    it('should fail on first failing guard', () => {
      const result = Guard.combine([
        Guard.againstEmpty('', 'name'),
        Guard.inRange(50, 0, 100, 'value'),
      ])
      expect(result.isErr()).toBe(true)
      expect(result.error.code).toBe('GUARD_EMPTY_STRING')
    })
  })
})

describe('SIMANISGuard', () => {
  describe('isValidAssetCode', () => {
    it('should pass for valid asset code', () => {
      expect(SIMANISGuard.isValidAssetCode('LAB-IPA-001').isOk()).toBe(true)
      expect(SIMANISGuard.isValidAssetCode('MEJ-KLS-123').isOk()).toBe(true)
      expect(SIMANISGuard.isValidAssetCode('KOMP-LAB-00001').isOk()).toBe(true)
    })

    it('should fail for invalid asset code', () => {
      expect(SIMANISGuard.isValidAssetCode('invalid').isErr()).toBe(true)
      expect(SIMANISGuard.isValidAssetCode('LAB-001').isErr()).toBe(true)
      expect(SIMANISGuard.isValidAssetCode('lab-ipa-001').isErr()).toBe(true)
    })
  })

  describe('isValidAssetValue', () => {
    it('should pass for valid values', () => {
      expect(SIMANISGuard.isValidAssetValue(0).isOk()).toBe(true)
      expect(SIMANISGuard.isValidAssetValue(5000000).isOk()).toBe(true)
      expect(SIMANISGuard.isValidAssetValue(999999999999).isOk()).toBe(true)
    })

    it('should fail for negative values', () => {
      expect(SIMANISGuard.isValidAssetValue(-1).isErr()).toBe(true)
    })
  })

  describe('isValidKondisi', () => {
    it('should pass for valid kondisi', () => {
      expect(SIMANISGuard.isValidKondisi('Baik').isOk()).toBe(true)
      expect(SIMANISGuard.isValidKondisi('Rusak Ringan').isOk()).toBe(true)
      expect(SIMANISGuard.isValidKondisi('Rusak Berat').isOk()).toBe(true)
    })

    it('should fail for invalid kondisi', () => {
      expect(SIMANISGuard.isValidKondisi('Bagus').isErr()).toBe(true)
      expect(SIMANISGuard.isValidKondisi('rusak').isErr()).toBe(true)
    })
  })
})
