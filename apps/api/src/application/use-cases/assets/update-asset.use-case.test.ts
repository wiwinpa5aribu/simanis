import type { Asset } from '@simanis/database'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IAssetRepository } from '../../../domain/repositories/asset.repository'
import type { IAuditRepository } from '../../../domain/repositories/audit.repository'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import type { UpdateAssetInput } from '../../validators/asset.validators'
import { UpdateAssetUseCase } from './update-asset.use-case'

describe('UpdateAssetUseCase', () => {
  let updateAssetUseCase: UpdateAssetUseCase
  let mockAssetRepository: IAssetRepository
  let mockAuditRepository: IAuditRepository

  const mockExistingAsset: Asset = {
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
  }

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

    mockAuditRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findByEntity: vi.fn(),
    }

    updateAssetUseCase = new UpdateAssetUseCase(
      mockAssetRepository,
      mockAuditRepository
    )
  })

  describe('Successful Update', () => {
    it('should update asset and create audit log when fields change', async () => {
      // Arrange
      const updateData: UpdateAssetInput = {
        namaBarang: 'Laptop Dell Updated',
        merk: 'Dell',
        kondisi: 'Rusak Ringan',
      }

      const updatedAsset: Asset = {
        ...mockExistingAsset,
        ...updateData,
        updatedAt: new Date(),
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(
        mockExistingAsset
      )
      vi.mocked(mockAssetRepository.update).mockResolvedValue(updatedAsset)
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'UPDATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      const result = await updateAssetUseCase.execute(1, updateData, 1)

      // Assert
      expect(result).toEqual(updatedAsset)
      expect(mockAssetRepository.findById).toHaveBeenCalledWith(1)
      expect(mockAssetRepository.update).toHaveBeenCalledWith(1, updateData)
      expect(mockAuditRepository.create).toHaveBeenCalledWith({
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'UPDATE',
        fieldChanged: {
          namaBarang: {
            from: 'Laptop Dell',
            to: 'Laptop Dell Updated',
          },
          kondisi: {
            from: 'Baik',
            to: 'Rusak Ringan',
          },
        },
      })
    })

    it('should not create audit log when no fields change', async () => {
      // Arrange
      const updateData: UpdateAssetInput = {
        namaBarang: 'Laptop Dell', // Same as existing
        merk: 'Dell', // Same as existing
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(
        mockExistingAsset
      )
      vi.mocked(mockAssetRepository.update).mockResolvedValue(mockExistingAsset)

      // Act
      await updateAssetUseCase.execute(1, updateData, 1)

      // Assert
      expect(mockAuditRepository.create).not.toHaveBeenCalled()
    })

    it('should track all field changes correctly', async () => {
      // Arrange
      const updateData: UpdateAssetInput = {
        namaBarang: 'New Name',
        merk: 'New Brand',
        spesifikasi: 'New Specs',
        kondisi: 'Rusak Berat',
        fotoUrl: 'https://example.com/photo.jpg',
        categoryId: 2,
        currentRoomId: 3,
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(
        mockExistingAsset
      )
      vi.mocked(mockAssetRepository.update).mockResolvedValue({
        ...mockExistingAsset,
        ...updateData,
      })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'UPDATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await updateAssetUseCase.execute(1, updateData, 1)

      // Assert
      expect(mockAuditRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fieldChanged: {
            namaBarang: { from: 'Laptop Dell', to: 'New Name' },
            merk: { from: 'Dell', to: 'New Brand' },
            spesifikasi: { from: 'Core i5, 8GB RAM', to: 'New Specs' },
            kondisi: { from: 'Baik', to: 'Rusak Berat' },
            fotoUrl: { from: null, to: 'https://example.com/photo.jpg' },
            categoryId: { from: 1, to: 2 },
            currentRoomId: { from: 1, to: 3 },
          },
        })
      )
    })

    it('should handle partial updates', async () => {
      // Arrange
      const updateData: UpdateAssetInput = {
        kondisi: 'Rusak Ringan',
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(
        mockExistingAsset
      )
      vi.mocked(mockAssetRepository.update).mockResolvedValue({
        ...mockExistingAsset,
        kondisi: 'Rusak Ringan',
      })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'UPDATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await updateAssetUseCase.execute(1, updateData, 1)

      // Assert
      expect(mockAuditRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fieldChanged: {
            kondisi: { from: 'Baik', to: 'Rusak Ringan' },
          },
        })
      )
    })
  })

  describe('Asset Not Found', () => {
    it('should throw NotFoundError when asset does not exist', async () => {
      // Arrange
      vi.mocked(mockAssetRepository.findById).mockResolvedValue(null)

      // Act & Assert
      await expect(
        updateAssetUseCase.execute(999, { namaBarang: 'Test' }, 1)
      ).rejects.toThrow(NotFoundError)

      await expect(
        updateAssetUseCase.execute(999, { namaBarang: 'Test' }, 1)
      ).rejects.toThrow('Aset tidak ditemukan')

      expect(mockAssetRepository.update).not.toHaveBeenCalled()
      expect(mockAuditRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null to value changes', async () => {
      // Arrange
      const assetWithNullFields: Asset = {
        ...mockExistingAsset,
        fotoUrl: null,
      }

      const updateData: UpdateAssetInput = {
        fotoUrl: 'https://example.com/photo.jpg',
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(
        assetWithNullFields
      )
      vi.mocked(mockAssetRepository.update).mockResolvedValue({
        ...assetWithNullFields,
        fotoUrl: 'https://example.com/photo.jpg',
      })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'UPDATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await updateAssetUseCase.execute(1, updateData, 1)

      // Assert
      expect(mockAuditRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fieldChanged: {
            fotoUrl: {
              from: null,
              to: 'https://example.com/photo.jpg',
            },
          },
        })
      )
    })

    it('should handle value to null changes', async () => {
      // Arrange
      const updateData: UpdateAssetInput = {
        fotoUrl: null,
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue({
        ...mockExistingAsset,
        fotoUrl: 'https://example.com/old.jpg',
      })
      vi.mocked(mockAssetRepository.update).mockResolvedValue({
        ...mockExistingAsset,
        fotoUrl: null,
      })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'UPDATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await updateAssetUseCase.execute(1, updateData, 1)

      // Assert
      expect(mockAuditRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fieldChanged: {
            fotoUrl: {
              from: 'https://example.com/old.jpg',
              to: null,
            },
          },
        })
      )
    })

    it('should ignore undefined fields in update data', async () => {
      // Arrange
      const updateData: UpdateAssetInput = {
        namaBarang: 'New Name',
        merk: undefined, // Should be ignored
        spesifikasi: undefined, // Should be ignored
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(
        mockExistingAsset
      )
      vi.mocked(mockAssetRepository.update).mockResolvedValue({
        ...mockExistingAsset,
        namaBarang: 'New Name',
      })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'UPDATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await updateAssetUseCase.execute(1, updateData, 1)

      // Assert
      expect(mockAuditRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fieldChanged: {
            namaBarang: { from: 'Laptop Dell', to: 'New Name' },
            // merk and spesifikasi should not be in changes
          },
        })
      )

      const call = vi.mocked(mockAuditRepository.create).mock.calls[0][0]
      expect(call.fieldChanged).not.toHaveProperty('merk')
      expect(call.fieldChanged).not.toHaveProperty('spesifikasi')
    })

    it('should handle different user IDs for updates', async () => {
      // Arrange
      const updateData: UpdateAssetInput = {
        kondisi: 'Rusak Ringan',
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(
        mockExistingAsset
      )
      vi.mocked(mockAssetRepository.update).mockResolvedValue({
        ...mockExistingAsset,
        kondisi: 'Rusak Ringan',
      })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 5,
        action: 'UPDATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await updateAssetUseCase.execute(1, updateData, 5)

      // Assert
      expect(mockAuditRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 5,
        })
      )
    })
  })
})
