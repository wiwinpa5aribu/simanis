import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetCategoriesUseCase } from './get-categories.use-case'
import type { IAssetCategoryRepository } from '../../../domain/repositories/category.repository'
import type { CategoryDto } from '../../dto/category.dto'

describe('GetCategoriesUseCase', () => {
  let getCategoriesUseCase: GetCategoriesUseCase
  let mockCategoryRepository: IAssetCategoryRepository

  const mockCategories: CategoryDto[] = [
    {
      id: 1,
      name: 'Elektronik',
      code: 'ELK',
      description: 'Peralatan elektronik',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      name: 'Furniture',
      code: 'FUR',
      description: 'Mebel dan furniture',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: 3,
      name: 'Kendaraan',
      code: 'KND',
      description: null,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ]

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

    getCategoriesUseCase = new GetCategoriesUseCase(mockCategoryRepository)
  })

  describe('Successful Retrieval', () => {
    it('should return all categories', async () => {
      // Arrange
      vi.mocked(mockCategoryRepository.findAll).mockResolvedValue(
        mockCategories
      )

      // Act
      const result = await getCategoriesUseCase.execute()

      // Assert
      expect(result.categories).toEqual(mockCategories)
      expect(result.categories).toHaveLength(3)
      expect(mockCategoryRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('should return empty array when no categories exist', async () => {
      // Arrange
      vi.mocked(mockCategoryRepository.findAll).mockResolvedValue([])

      // Act
      const result = await getCategoriesUseCase.execute()

      // Assert
      expect(result.categories).toEqual([])
      expect(result.categories).toHaveLength(0)
    })

    it('should return single category', async () => {
      // Arrange
      vi.mocked(mockCategoryRepository.findAll).mockResolvedValue([
        mockCategories[0],
      ])

      // Act
      const result = await getCategoriesUseCase.execute()

      // Assert
      expect(result.categories).toHaveLength(1)
      expect(result.categories[0]).toEqual(mockCategories[0])
    })
  })

  describe('Data Consistency', () => {
    it('should return categories with all required fields', async () => {
      // Arrange
      vi.mocked(mockCategoryRepository.findAll).mockResolvedValue(
        mockCategories
      )

      // Act
      const result = await getCategoriesUseCase.execute()

      // Assert
      for (const category of result.categories) {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('code')
        expect(category).toHaveProperty('createdAt')
        expect(category).toHaveProperty('updatedAt')
      }
    })

    it('should handle categories with null descriptions', async () => {
      // Arrange
      const categoriesWithNullDesc: CategoryDto[] = [
        { ...mockCategories[0], description: null },
        { ...mockCategories[1], description: null },
      ]

      vi.mocked(mockCategoryRepository.findAll).mockResolvedValue(
        categoriesWithNullDesc
      )

      // Act
      const result = await getCategoriesUseCase.execute()

      // Assert
      expect(result.categories[0].description).toBeNull()
      expect(result.categories[1].description).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    it('should handle large number of categories', async () => {
      // Arrange
      const manyCategories: CategoryDto[] = Array.from(
        { length: 100 },
        (_, i) => ({
          id: i + 1,
          name: `Category ${i + 1}`,
          code: `CAT${i + 1}`,
          description: `Description ${i + 1}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      )

      vi.mocked(mockCategoryRepository.findAll).mockResolvedValue(
        manyCategories
      )

      // Act
      const result = await getCategoriesUseCase.execute()

      // Assert
      expect(result.categories).toHaveLength(100)
      expect(result.categories[0].name).toBe('Category 1')
      expect(result.categories[99].name).toBe('Category 100')
    })

    it('should maintain category order from repository', async () => {
      // Arrange
      const orderedCategories: CategoryDto[] = [
        { ...mockCategories[2], id: 3 },
        { ...mockCategories[0], id: 1 },
        { ...mockCategories[1], id: 2 },
      ]

      vi.mocked(mockCategoryRepository.findAll).mockResolvedValue(
        orderedCategories
      )

      // Act
      const result = await getCategoriesUseCase.execute()

      // Assert
      expect(result.categories[0].id).toBe(3)
      expect(result.categories[1].id).toBe(1)
      expect(result.categories[2].id).toBe(2)
    })
  })
})
