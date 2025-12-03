import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateCategoryUseCase } from './create-category.use-case'
import type { IAssetCategoryRepository } from '../../../domain/repositories/category.repository'
import type { CategoryDto } from '../../dto/category.dto'
import type { CreateCategoryInput } from '../../validators/category.validators'
import { ConflictError } from '../../../shared/errors/conflict-error'

vi.mock('../../../shared/logger/winston.logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

describe('CreateCategoryUseCase', () => {
  let createCategoryUseCase: CreateCategoryUseCase
  let mockCategoryRepository: IAssetCategoryRepository

  const mockCategory: CategoryDto = {
    id: 1,
    name: 'Elektronik',
    code: 'ELK',
    description: 'Peralatan elektronik',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockCategoryRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      findByCode: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }

    createCategoryUseCase = new CreateCategoryUseCase(mockCategoryRepository)
  })

  describe('Successful Creation', () => {
    it('should create category when name does not exist', async () => {
      // Arrange
      const input: CreateCategoryInput = {
        name: 'Elektronik',
        code: 'ELK',
        description: 'Peralatan elektronik',
      }

      vi.mocked(mockCategoryRepository.findByName).mockResolvedValue(null)
      vi.mocked(mockCategoryRepository.create).mockResolvedValue(mockCategory)

      // Act
      const result = await createCategoryUseCase.execute(input)

      // Assert
      expect(result).toEqual(mockCategory)
      expect(mockCategoryRepository.findByName).toHaveBeenCalledWith(
        'Elektronik'
      )
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(input)
    })

    it('should handle category without description', async () => {
      // Arrange
      const input: CreateCategoryInput = {
        name: 'Furniture',
        code: 'FUR',
        description: null,
      }

      const categoryWithoutDesc: CategoryDto = {
        ...mockCategory,
        name: 'Furniture',
        code: 'FUR',
        description: null,
      }

      vi.mocked(mockCategoryRepository.findByName).mockResolvedValue(null)
      vi.mocked(mockCategoryRepository.create).mockResolvedValue(
        categoryWithoutDesc
      )

      // Act
      const result = await createCategoryUseCase.execute(input)

      // Assert
      expect(result.description).toBeNull()
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(input)
    })

    it('should handle different category codes', async () => {
      // Arrange
      const testCases = [
        { name: 'Elektronik', code: 'ELK' },
        { name: 'Furniture', code: 'FUR' },
        { name: 'Kendaraan', code: 'KND' },
        { name: 'Bangunan', code: 'BNG' },
      ]

      for (const testCase of testCases) {
        vi.clearAllMocks()

        const input: CreateCategoryInput = {
          ...testCase,
          description: 'Test',
        }

        vi.mocked(mockCategoryRepository.findByName).mockResolvedValue(null)
        vi.mocked(mockCategoryRepository.create).mockResolvedValue({
          ...mockCategory,
          ...testCase,
        })

        // Act
        const result = await createCategoryUseCase.execute(input)

        // Assert
        expect(result.code).toBe(testCase.code)
        expect(result.name).toBe(testCase.name)
      }
    })
  })

  describe('Conflict Handling', () => {
    it('should throw ConflictError when category name already exists', async () => {
      // Arrange
      const input: CreateCategoryInput = {
        name: 'Elektronik',
        code: 'ELK',
        description: 'Test',
      }

      vi.mocked(mockCategoryRepository.findByName).mockResolvedValue(
        mockCategory
      )

      // Act & Assert
      await expect(createCategoryUseCase.execute(input)).rejects.toThrow(
        ConflictError
      )

      await expect(createCategoryUseCase.execute(input)).rejects.toThrow(
        'Kategori dengan nama ini sudah ada'
      )

      expect(mockCategoryRepository.create).not.toHaveBeenCalled()
    })

    it('should be case-sensitive for category names', async () => {
      // Arrange
      const input: CreateCategoryInput = {
        name: 'elektronik', // lowercase
        code: 'ELK',
        description: 'Test',
      }

      vi.mocked(mockCategoryRepository.findByName).mockResolvedValue(null)
      vi.mocked(mockCategoryRepository.create).mockResolvedValue({
        ...mockCategory,
        name: 'elektronik',
      })

      // Act
      const result = await createCategoryUseCase.execute(input)

      // Assert
      expect(result.name).toBe('elektronik')
      expect(mockCategoryRepository.findByName).toHaveBeenCalledWith(
        'elektronik'
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle long category names', async () => {
      // Arrange
      const longName = 'A'.repeat(100)
      const input: CreateCategoryInput = {
        name: longName,
        code: 'LONG',
        description: 'Test',
      }

      vi.mocked(mockCategoryRepository.findByName).mockResolvedValue(null)
      vi.mocked(mockCategoryRepository.create).mockResolvedValue({
        ...mockCategory,
        name: longName,
        code: 'LONG',
      })

      // Act
      const result = await createCategoryUseCase.execute(input)

      // Assert
      expect(result.name).toBe(longName)
    })

    it('should handle long descriptions', async () => {
      // Arrange
      const longDesc = 'Description '.repeat(50)
      const input: CreateCategoryInput = {
        name: 'Test Category',
        code: 'TST',
        description: longDesc,
      }

      vi.mocked(mockCategoryRepository.findByName).mockResolvedValue(null)
      vi.mocked(mockCategoryRepository.create).mockResolvedValue({
        ...mockCategory,
        description: longDesc,
      })

      // Act
      const result = await createCategoryUseCase.execute(input)

      // Assert
      expect(result.description).toBe(longDesc)
    })

    it('should handle special characters in names', async () => {
      // Arrange
      const input: CreateCategoryInput = {
        name: 'Elektronik & Komputer',
        code: 'ELK',
        description: 'Peralatan elektronik & komputer',
      }

      vi.mocked(mockCategoryRepository.findByName).mockResolvedValue(null)
      vi.mocked(mockCategoryRepository.create).mockResolvedValue({
        ...mockCategory,
        name: 'Elektronik & Komputer',
      })

      // Act
      const result = await createCategoryUseCase.execute(input)

      // Assert
      expect(result.name).toBe('Elektronik & Komputer')
    })
  })
})
