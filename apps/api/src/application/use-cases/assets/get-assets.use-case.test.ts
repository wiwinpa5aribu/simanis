import type { Asset } from '@simanis/database'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  AssetFilters,
  IAssetRepository,
} from '../../../domain/repositories/asset.repository'
import { GetAssetsUseCase } from './get-assets.use-case'

describe('GetAssetsUseCase', () => {
  let getAssetsUseCase: GetAssetsUseCase
  let mockAssetRepository: IAssetRepository

  const mockAssets: Asset[] = [
    {
      id: 1,
      kodeAset: 'SCH/24/ELK/001',
      namaBarang: 'Laptop Dell',
      merk: 'Dell',
      spesifikasi: 'Core i5, 8GB RAM',
      tahunPembelian: 2024,
      hargaBeli: 10000000,
      kondisi: 'Baik',
      fotoUrl: null,
      qrCode: 'qr-code-1',
      categoryId: 1,
      currentRoomId: 1,
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      kodeAset: 'SCH/24/FUR/001',
      namaBarang: 'Meja Kantor',
      merk: 'Olympic',
      spesifikasi: '120x60cm',
      tahunPembelian: 2024,
      hargaBeli: 1500000,
      kondisi: 'Baik',
      fotoUrl: null,
      qrCode: 'qr-code-2',
      categoryId: 2,
      currentRoomId: 1,
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockAssetRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByKodeAset: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
      restore: vi.fn(),
      getTotalValue: vi.fn(),
      getCountByCategory: vi.fn(),
      getCountByStatus: vi.fn(),
    }

    getAssetsUseCase = new GetAssetsUseCase(mockAssetRepository)
  })

  describe('Successful Retrieval', () => {
    it('should return paginated assets with correct meta', async () => {
      // Arrange
      const params = {
        page: 1,
        pageSize: 10,
      }

      vi.mocked(mockAssetRepository.findAll).mockResolvedValue({
        assets: mockAssets,
        total: 2,
      })

      // Act
      const result = await getAssetsUseCase.execute(params)

      // Assert
      expect(result.assets).toEqual(mockAssets)
      expect(result.total).toBe(2)
      expect(result.meta).toEqual({
        page: 1,
        pageSize: 10,
        totalItems: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      })

      expect(mockAssetRepository.findAll).toHaveBeenCalledWith(params)
    })

    it('should handle multiple pages correctly', async () => {
      // Arrange
      const params = {
        page: 2,
        pageSize: 10,
      }

      vi.mocked(mockAssetRepository.findAll).mockResolvedValue({
        assets: mockAssets,
        total: 25,
      })

      // Act
      const result = await getAssetsUseCase.execute(params)

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
      const params = {
        page: 1,
        pageSize: 5,
      }

      vi.mocked(mockAssetRepository.findAll).mockResolvedValue({
        assets: mockAssets,
        total: 20,
      })

      // Act
      const result = await getAssetsUseCase.execute(params)

      // Assert
      expect(result.meta.hasPreviousPage).toBe(false)
      expect(result.meta.hasNextPage).toBe(true)
      expect(result.meta.totalPages).toBe(4)
    })

    it('should handle last page correctly', async () => {
      // Arrange
      const params = {
        page: 4,
        pageSize: 5,
      }

      vi.mocked(mockAssetRepository.findAll).mockResolvedValue({
        assets: mockAssets,
        total: 20,
      })

      // Act
      const result = await getAssetsUseCase.execute(params)

      // Assert
      expect(result.meta.hasPreviousPage).toBe(true)
      expect(result.meta.hasNextPage).toBe(false)
      expect(result.meta.totalPages).toBe(4)
    })
  })

  describe('Filtering', () => {
    it('should pass filters to repository', async () => {
      // Arrange
      const filters: AssetFilters = {
        categoryId: 1,
        kondisi: 'Baik',
        search: 'laptop',
      }

      const params = {
        page: 1,
        pageSize: 10,
        filters,
      }

      vi.mocked(mockAssetRepository.findAll).mockResolvedValue({
        assets: [mockAssets[0]],
        total: 1,
      })

      // Act
      const result = await getAssetsUseCase.execute(params)

      // Assert
      expect(mockAssetRepository.findAll).toHaveBeenCalledWith(params)
      expect(result.assets).toHaveLength(1)
      expect(result.total).toBe(1)
    })

    it('should handle multiple filters', async () => {
      // Arrange
      const filters: AssetFilters = {
        categoryId: 1,
        kondisi: 'Baik',
        tahunPembelian: 2024,
        roomId: 1,
        buildingId: 1,
      }

      const params = {
        page: 1,
        pageSize: 10,
        filters,
      }

      vi.mocked(mockAssetRepository.findAll).mockResolvedValue({
        assets: mockAssets,
        total: 2,
      })

      // Act
      await getAssetsUseCase.execute(params)

      // Assert
      expect(mockAssetRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            categoryId: 1,
            kondisi: 'Baik',
            tahunPembelian: 2024,
            roomId: 1,
            buildingId: 1,
          }),
        })
      )
    })
  })

  describe('Empty Results', () => {
    it('should handle empty result set', async () => {
      // Arrange
      const params = {
        page: 1,
        pageSize: 10,
      }

      vi.mocked(mockAssetRepository.findAll).mockResolvedValue({
        assets: [],
        total: 0,
      })

      // Act
      const result = await getAssetsUseCase.execute(params)

      // Assert
      expect(result.assets).toEqual([])
      expect(result.total).toBe(0)
      expect(result.meta).toEqual({
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      })
    })

    it('should handle page beyond available results', async () => {
      // Arrange
      const params = {
        page: 10,
        pageSize: 10,
      }

      vi.mocked(mockAssetRepository.findAll).mockResolvedValue({
        assets: [],
        total: 25,
      })

      // Act
      const result = await getAssetsUseCase.execute(params)

      // Assert
      expect(result.assets).toEqual([])
      expect(result.meta.page).toBe(10)
      expect(result.meta.totalPages).toBe(3)
    })
  })

  describe('Edge Cases', () => {
    it('should handle single item result', async () => {
      // Arrange
      const params = {
        page: 1,
        pageSize: 10,
      }

      vi.mocked(mockAssetRepository.findAll).mockResolvedValue({
        assets: [mockAssets[0]],
        total: 1,
      })

      // Act
      const result = await getAssetsUseCase.execute(params)

      // Assert
      expect(result.assets).toHaveLength(1)
      expect(result.meta.totalPages).toBe(1)
    })

    it('should handle exact page size match', async () => {
      // Arrange
      const params = {
        page: 1,
        pageSize: 2,
      }

      vi.mocked(mockAssetRepository.findAll).mockResolvedValue({
        assets: mockAssets,
        total: 2,
      })

      // Act
      const result = await getAssetsUseCase.execute(params)

      // Assert
      expect(result.assets).toHaveLength(2)
      expect(result.meta.totalPages).toBe(1)
      expect(result.meta.hasNextPage).toBe(false)
    })

    it('should handle large page size', async () => {
      // Arrange
      const params = {
        page: 1,
        pageSize: 100,
      }

      vi.mocked(mockAssetRepository.findAll).mockResolvedValue({
        assets: mockAssets,
        total: 2,
      })

      // Act
      const result = await getAssetsUseCase.execute(params)

      // Assert
      expect(result.meta.totalPages).toBe(1)
      expect(result.meta.hasNextPage).toBe(false)
    })
  })
})
