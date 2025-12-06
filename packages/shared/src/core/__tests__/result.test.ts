/**
 * Tests for Result<T, E> pattern
 */

import { describe, expect, it } from 'vitest'
import { combineResults, Result, tryCatch } from '../defensive/result'

describe('Result', () => {
  describe('ok', () => {
    it('should create success result', () => {
      const result = Result.ok(42)
      expect(result.isOk()).toBe(true)
      expect(result.isErr()).toBe(false)
      expect(result.value).toBe(42)
    })

    it('should work with objects', () => {
      const data = { id: '1', name: 'Test' }
      const result = Result.ok(data)
      expect(result.value).toEqual(data)
    })
  })

  describe('err', () => {
    it('should create error result', () => {
      const result = Result.fromError('TEST_ERROR', 'Something went wrong')
      expect(result.isOk()).toBe(false)
      expect(result.isErr()).toBe(true)
      expect(result.error.code).toBe('TEST_ERROR')
      expect(result.error.message).toBe('Something went wrong')
    })

    it('should include context', () => {
      const result = Result.fromError('TEST_ERROR', 'Error', { userId: '123' })
      expect(result.error.context).toEqual({ userId: '123' })
    })
  })

  describe('unwrapOr', () => {
    it('should return value for success', () => {
      const result = Result.ok(42)
      expect(result.unwrapOr(0)).toBe(42)
    })

    it('should return default for error', () => {
      const result = Result.fromError('ERR', 'Error')
      expect(result.unwrapOr(0)).toBe(0)
    })
  })

  describe('map', () => {
    it('should transform success value', () => {
      const result = Result.ok(10).map((x) => x * 2)
      expect(result.value).toBe(20)
    })

    it('should not transform error', () => {
      const result = Result.fromError('ERR', 'Error').map((x: number) => x * 2)
      expect(result.isErr()).toBe(true)
    })
  })

  describe('match', () => {
    it('should call ok handler for success', () => {
      const result = Result.ok(42)
      const output = result.match({
        ok: (v) => `Value: ${v}`,
        err: (e) => `Error: ${e.code}`,
      })
      expect(output).toBe('Value: 42')
    })

    it('should call err handler for error', () => {
      const result = Result.fromError('TEST', 'Error')
      const output = result.match({
        ok: (v) => `Value: ${v}`,
        err: (e) => `Error: ${e.code}`,
      })
      expect(output).toBe('Error: TEST')
    })
  })
})

describe('tryCatch', () => {
  it('should wrap successful async function', async () => {
    const result = await tryCatch(async () => 42)
    expect(result.isOk()).toBe(true)
    expect(result.value).toBe(42)
  })

  it('should wrap throwing async function', async () => {
    const result = await tryCatch(async () => {
      throw new Error('Async error')
    }, 'ASYNC_ERROR')
    expect(result.isErr()).toBe(true)
    expect(result.error.code).toBe('ASYNC_ERROR')
    expect(result.error.message).toBe('Async error')
  })
})

describe('combineResults', () => {
  it('should combine all success results', () => {
    const results = [Result.ok(1), Result.ok(2), Result.ok(3)]
    const combined = combineResults(results)
    expect(combined.isOk()).toBe(true)
    expect(combined.value).toEqual([1, 2, 3])
  })

  it('should return first error', () => {
    const results = [
      Result.ok(1),
      Result.fromError('ERR', 'Error'),
      Result.ok(3),
    ]
    const combined = combineResults(results)
    expect(combined.isErr()).toBe(true)
    expect(combined.error.code).toBe('ERR')
  })
})
