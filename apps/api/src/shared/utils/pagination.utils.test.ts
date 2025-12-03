import { describe, it, expect } from 'vitest'
import {
  calculatePagination,
  calculateSkip,
  sanitizePaginationParams,
} from './pagination.utils'

describe('Pagination Utils', () => {
  describe('calculatePagination', () => {
    it('should calculate pagination for first page', () => {
      // Act
      const result = calculatePagination(50, 1, 10)

      // Assert
      expect(result).toEqual({
        page: 1,
        pageSize: 10,
        totalItems: 50,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: false,
      })
    })

    it('should calculate pagination for middle page', () => {
      // Act
      const result = calculatePagination(50, 3, 10)

      // Assert
      expect(result).toEqual({
        page: 3,
        pageSize: 10,
        totalItems: 50,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: true,
      })
    })

    it('should calculate pagination for last page', () => {
      // Act
      const result = calculatePagination(50, 5, 10)

      // Assert
      expect(result).toEqual({
        page: 5,
        pageSize: 10,
        totalItems: 50,
        totalPages: 5,
        hasNextPage: false,
        hasPreviousPage: true,
      })
    })

    it('should handle single page', () => {
      // Act
      const result = calculatePagination(5, 1, 10)

      // Assert
      expect(result).toEqual({
        page: 1,
        pageSize: 10,
        totalItems: 5,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      })
    })

    it('should handle empty results', () => {
      // Act
      const result = calculatePagination(0, 1, 10)

      // Assert
      expect(result).toEqual({
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      })
    })

    it('should handle partial last page', () => {
      // Act
      const result = calculatePagination(25, 3, 10)

      // Assert
      expect(result).toEqual({
        page: 3,
        pageSize: 10,
        totalItems: 25,
        totalPages: 3,
        hasNextPage: false,
        hasPreviousPage: true,
      })
    })

    it('should calculate different page sizes correctly', () => {
      const testCases = [
        { total: 100, page: 1, size: 5, expectedPages: 20 },
        { total: 100, page: 1, size: 20, expectedPages: 5 },
        { total: 100, page: 1, size: 25, expectedPages: 4 },
        { total: 100, page: 1, size: 50, expectedPages: 2 },
      ]

      for (const testCase of testCases) {
        const result = calculatePagination(
          testCase.total,
          testCase.page,
          testCase.size
        )
        expect(result.totalPages).toBe(testCase.expectedPages)
      }
    })
  })

  describe('calculateSkip', () => {
    it('should calculate skip for first page', () => {
      expect(calculateSkip(1, 10)).toBe(0)
    })

    it('should calculate skip for second page', () => {
      expect(calculateSkip(2, 10)).toBe(10)
    })

    it('should calculate skip for different page sizes', () => {
      expect(calculateSkip(3, 5)).toBe(10)
      expect(calculateSkip(3, 20)).toBe(40)
      expect(calculateSkip(5, 15)).toBe(60)
    })

    it('should handle edge cases', () => {
      expect(calculateSkip(1, 1)).toBe(0)
      expect(calculateSkip(10, 1)).toBe(9)
      expect(calculateSkip(1, 100)).toBe(0)
      expect(calculateSkip(100, 10)).toBe(990)
    })
  })

  describe('sanitizePaginationParams', () => {
    it('should use default values when no params provided', () => {
      // Act
      const result = sanitizePaginationParams()

      // Assert
      expect(result).toEqual({
        page: 1,
        pageSize: 20,
      })
    })

    it('should use provided valid values', () => {
      // Act
      const result = sanitizePaginationParams(2, 15)

      // Assert
      expect(result).toEqual({
        page: 2,
        pageSize: 15,
      })
    })

    it('should sanitize negative page to 1', () => {
      // Act
      const result = sanitizePaginationParams(-5, 10)

      // Assert
      expect(result.page).toBe(1)
    })

    it('should sanitize zero page to 1', () => {
      // Act
      const result = sanitizePaginationParams(0, 10)

      // Assert
      expect(result.page).toBe(1)
    })

    it('should sanitize negative pageSize to 1', () => {
      // Act
      const result = sanitizePaginationParams(1, -10)

      // Assert
      expect(result.pageSize).toBe(1)
    })

    it('should sanitize zero pageSize to 1', () => {
      // Act
      const result = sanitizePaginationParams(1, 0)

      // Assert
      // Math.max(1, 0 || 20) = Math.max(1, 20) = 20
      expect(result.pageSize).toBe(20)
    })

    it('should cap pageSize at 100', () => {
      // Act
      const result = sanitizePaginationParams(1, 200)

      // Assert
      expect(result.pageSize).toBe(100)
    })

    it('should handle undefined page with valid pageSize', () => {
      // Act
      const result = sanitizePaginationParams(undefined, 30)

      // Assert
      expect(result).toEqual({
        page: 1,
        pageSize: 30,
      })
    })

    it('should handle valid page with undefined pageSize', () => {
      // Act
      const result = sanitizePaginationParams(5, undefined)

      // Assert
      expect(result).toEqual({
        page: 5,
        pageSize: 20,
      })
    })

    it('should handle edge case values', () => {
      const testCases = [
        { page: 1, pageSize: 1, expected: { page: 1, pageSize: 1 } },
        { page: 100, pageSize: 100, expected: { page: 100, pageSize: 100 } },
        { page: 50, pageSize: 50, expected: { page: 50, pageSize: 50 } },
        { page: -100, pageSize: 500, expected: { page: 1, pageSize: 100 } },
      ]

      for (const testCase of testCases) {
        const result = sanitizePaginationParams(
          testCase.page,
          testCase.pageSize
        )
        expect(result).toEqual(testCase.expected)
      }
    })
  })
})
