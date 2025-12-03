import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetInventoryUseCase } from './get-inventory.use-case'
import type { IInventoryRepository } from '../../../domain/repositories/inventory.repository'

describe('GetInventoryUseCase', () => {
  let getInventoryUseCase: GetInventoryUseCase
  let mockInventoryRepository: IInventoryRepository

  const mockChecks = [
    {
      id: 1,
      assetId: 1,
      checkedBy: 1,
      kondisi: 'Baik',
      photoUrl: null,
      note: null,
      checkedAt: new Date('2024-01-15'),
      asset: {
        id: 1,
        kodeAset: 'SCH/24/ELK/001',
        namaBarang: 'Laptop Dell',
        category: {
          id: 1,
          name: 'Elektronik',
        },
      },
      checker: {
        id: 1,
        name: 'Test User',
        username: 'testuser',
      },
    },
    {
      id: 2,
      assetId: 2,
      checkedBy: 1,
      kondisi: 'Rusak Ringan',
      photoUrl: 'https://example.com/photo.jpg',
      note: 'Ada goresan',
      checkedAt: new Date('2024-01-16'),
      asset: {
        id: 2,
        kodeAset: 'SCH/24/FUR/001',
        namaBarang: 'Meja Kantor',
        category: {
          id: 2,
          name: 'Furniture',
        },
      },
      checker: {
        id: 1,
        name: 'Test User',
        username: 'testuser',
      },
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockInventoryRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByAsset: vi.fn(),
    }

    getInventoryUseCase = new GetInventoryUseCase(mockInventoryRepository)
  })

  describe('Successful Retrieval', () => {
    it('should return paginated inventory checks', async () => {
      // Arrange
      const params = {
        page: 1,
        pageSize: 10,
      }

      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: mockChecks,
        total: 2,
      })

      // Act
      const result = await getInventoryUseCase.execute(params)

      // Assert
      expect(result.checks).toHaveLength(2)
      expect(result.meta).toEqual({
        page: 1,
        pageSize: 10,
        totalItems: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      })
      expect(mockInventoryRepository.findAll).toHaveBeenCalledWith(0, 10, {})
    })

    it('should use default page and pageSize if not provided', async () => {
      // Arrange
      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: mockChecks,
        total: 2,
      })

      // Act
      const result = await getInventoryUseCase.execute({})

      // Assert
      expect(result.meta.page).toBe(1)
      expect(result.meta.pageSize).toBe(10)
      expect(mockInventoryRepository.findAll).toHaveBeenCalledWith(0, 10, {})
    })

    it('should calculate skip correctly for different pages', async () => {
      // Arrange
      const testCases = [
        { page: 1, pageSize: 10, expectedSkip: 0 },
        { page: 2, pageSize: 10, expectedSkip: 10 },
        { page: 3, pageSize: 20, expectedSkip: 40 },
        { page: 5, pageSize: 5, expectedSkip: 20 },
      ]

      for (const testCase of testCases) {
        vi.clearAllMocks()

        vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
          checks: [],
          total: 0,
        })

        // Act
        await getInventoryUseCase.execute({
          page: testCase.page,
          pageSize: testCase.pageSize,
        })

        // Assert
        expect(mockInventoryRepository.findAll).toHaveBeenCalledWith(
          testCase.expectedSkip,
          testCase.pageSize,
          {}
        )
      }
    })

    it('should map checks to DTO format correctly', async () => {
      // Arrange
      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: mockChecks,
        total: 2,
      })

      // Act
      const result = await getInventoryUseCase.execute({})

      // Assert
      expect(result.checks[0]).toEqual({
        id: 1,
        assetId: 1,
        checkerId: 1,
        kondisi: 'Baik',
        photoUrl: null,
        note: null,
        createdAt: mockChecks[0].checkedAt,
        asset: {
          id: 1,
          kode: 'SCH/24/ELK/001',
          nama: 'Laptop Dell',
          category: {
            id: 1,
            name: 'Elektronik',
          },
        },
        checker: {
          id: 1,
          name: 'Test User',
          username: 'testuser',
        },
      })
    })
  })

  describe('Filtering', () => {
    it('should pass filters to repository', async () => {
      // Arrange
      const params = {
        page: 1,
        pageSize: 10,
        filters: {
          assetId: 1,
          kondisi: 'Baik',
        },
      }

      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: [mockChecks[0]],
        total: 1,
      })

      // Act
      await getInventoryUseCase.execute(params)

      // Assert
      expect(mockInventoryRepository.findAll).toHaveBeenCalledWith(0, 10, {
        assetId: 1,
        kondisi: 'Baik',
      })
    })

    it('should handle multiple filters', async () => {
      // Arrange
      const params = {
        page: 1,
        pageSize: 10,
        filters: {
          assetId: 1,
          kondisi: 'Baik',
          checkedBy: 1,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        },
      }

      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: [],
        total: 0,
      })

      // Act
      await getInventoryUseCase.execute(params)

      // Assert
      expect(mockInventoryRepository.findAll).toHaveBeenCalledWith(
        0,
        10,
        expect.objectContaining({
          assetId: 1,
          kondisi: 'Baik',
          checkedBy: 1,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        })
      )
    })
  })

  describe('Empty Results', () => {
    it('should handle empty result set', async () => {
      // Arrange
      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: [],
        total: 0,
      })

      // Act
      const result = await getInventoryUseCase.execute({})

      // Assert
      expect(result.checks).toEqual([])
      expect(result.meta).toEqual({
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      })
    })
  })

  describe('Pagination Edge Cases', () => {
    it('should handle multiple pages correctly', async () => {
      // Arrange
      const params = {
        page: 2,
        pageSize: 10,
      }

      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: mockChecks,
        total: 25,
      })

      // Act
      const result = await getInventoryUseCase.execute(params)

      // Assert
      expect(result.meta).toEqual({
        page: 2,
        pageSize: 10,
        totalItems: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      })
    })

    it('should handle first page correctly', async () => {
      // Arrange
      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: mockChecks,
        total: 20,
      })

      // Act
      const result = await getInventoryUseCase.execute({
        page: 1,
        pageSize: 5,
      })

      // Assert
      expect(result.meta.hasPreviousPage).toBe(false)
      expect(result.meta.hasNextPage).toBe(true)
      expect(result.meta.totalPages).toBe(4)
    })

    it('should handle last page correctly', async () => {
      // Arrange
      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: mockChecks,
        total: 20,
      })

      // Act
      const result = await getInventoryUseCase.execute({
        page: 4,
        pageSize: 5,
      })

      // Assert
      expect(result.meta.hasPreviousPage).toBe(true)
      expect(result.meta.hasNextPage).toBe(false)
    })
  })

  describe('Data Mapping', () => {
    it('should handle checks without asset relation', async () => {
      // Arrange
      const checksWithoutAsset = [
        {
          ...mockChecks[0],
          asset: undefined,
        },
      ]

      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: checksWithoutAsset,
        total: 1,
      })

      // Act
      const result = await getInventoryUseCase.execute({})

      // Assert
      expect(result.checks[0].asset).toBeUndefined()
    })

    it('should handle checks without checker relation', async () => {
      // Arrange
      const checksWithoutChecker = [
        {
          ...mockChecks[0],
          checker: undefined,
        },
      ]

      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: checksWithoutChecker,
        total: 1,
      })

      // Act
      const result = await getInventoryUseCase.execute({})

      // Assert
      expect(result.checks[0].checker).toBeUndefined()
    })

    it('should map checkedBy to checkerId', async () => {
      // Arrange
      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: mockChecks,
        total: 2,
      })

      // Act
      const result = await getInventoryUseCase.execute({})

      // Assert
      expect(result.checks[0].checkerId).toBe(1)
      expect(result.checks[1].checkerId).toBe(1)
    })

    it('should map checkedAt to createdAt', async () => {
      // Arrange
      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: mockChecks,
        total: 2,
      })

      // Act
      const result = await getInventoryUseCase.execute({})

      // Assert
      expect(result.checks[0].createdAt).toEqual(mockChecks[0].checkedAt)
      expect(result.checks[1].createdAt).toEqual(mockChecks[1].checkedAt)
    })

    it('should map kodeAset to kode and namaBarang to nama', async () => {
      // Arrange
      vi.mocked(mockInventoryRepository.findAll).mockResolvedValue({
        checks: mockChecks,
        total: 2,
      })

      // Act
      const result = await getInventoryUseCase.execute({})

      // Assert
      expect(result.checks[0].asset?.kode).toBe('SCH/24/ELK/001')
      expect(result.checks[0].asset?.nama).toBe('Laptop Dell')
    })
  })
})
