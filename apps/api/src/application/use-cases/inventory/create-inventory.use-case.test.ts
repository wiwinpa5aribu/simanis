import type { Asset, InventoryCheck } from '@simanis/database'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IAssetRepository } from '../../../domain/repositories/asset.repository'
import type { IAuditRepository } from '../../../domain/repositories/audit.repository'
import type { IInventoryRepository } from '../../../domain/repositories/inventory.repository'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import type { CreateInventoryInput } from '../../validators/inventory.validators'
import { CreateInventoryUseCase } from './create-inventory.use-case'

describe('CreateInventoryUseCase', () => {
  let createInventoryUseCase: CreateInventoryUseCase
  let mockInventoryRepository: IInventoryRepository
  let mockAssetRepository: IAssetRepository
  let mockAuditRepository: IAuditRepository

  const mockAsset: Asset = {
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

  const mockInventoryCheck: InventoryCheck = {
    id: 1,
    assetId: 1,
    checkedBy: 1,
    kondisi: 'Baik',
    photoUrl: null,
    note: null,
    qrCodeScanned: 'qr-code-1',
    checkedAt: new Date('2024-01-15'),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockInventoryRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByAsset: vi.fn(),
    }

    mockAssetRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByKodeAset: vi.fn(),
      findByQRCode: vi.fn(),
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

    createInventoryUseCase = new CreateInventoryUseCase(
      mockInventoryRepository,
      mockAssetRepository,
      mockAuditRepository
    )
  })

  describe('Successful Inventory Creation', () => {
    it('should create inventory check without updating asset condition', async () => {
      // Arrange
      const input: CreateInventoryInput = {
        qrCodeScanned: 'qr-code-1',
        kondisi: 'Baik',
        photoUrl: null,
        note: null,
      }

      vi.mocked(mockAssetRepository.findByQRCode).mockResolvedValue(mockAsset)
      vi.mocked(mockInventoryRepository.create).mockResolvedValue(
        mockInventoryCheck
      )
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'InventoryCheck',
        entityId: 1,
        userId: 1,
        action: 'CREATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      const result = await createInventoryUseCase.execute(input, 1)

      // Assert
      expect(result).toEqual(mockInventoryCheck)
      expect(mockAssetRepository.findByQRCode).toHaveBeenCalledWith('qr-code-1')
      expect(mockInventoryRepository.create).toHaveBeenCalledWith({
        asset: { connect: { id: 1 } },
        checker: { connect: { id: 1 } },
        kondisi: 'Baik',
        photoUrl: null,
        note: null,
        qrCodeScanned: 'qr-code-1',
      })
      expect(mockAssetRepository.update).not.toHaveBeenCalled()
      expect(mockAuditRepository.create).toHaveBeenCalledTimes(1)
    })

    it('should create inventory check and update asset condition when changed', async () => {
      // Arrange
      const input: CreateInventoryInput = {
        qrCodeScanned: 'qr-code-1',
        kondisi: 'Rusak Ringan',
        photoUrl: 'https://example.com/photo.jpg',
        note: 'Ada goresan',
      }

      vi.mocked(mockAssetRepository.findByQRCode).mockResolvedValue(mockAsset)
      vi.mocked(mockInventoryRepository.create).mockResolvedValue({
        ...mockInventoryCheck,
        kondisi: 'Rusak Ringan',
        photoUrl: 'https://example.com/photo.jpg',
        note: 'Ada goresan',
      })
      vi.mocked(mockAssetRepository.update).mockResolvedValue({
        ...mockAsset,
        kondisi: 'Rusak Ringan',
      })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'Asset',
        entityId: 1,
        userId: 1,
        action: 'UPDATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      const result = await createInventoryUseCase.execute(input, 1)

      // Assert
      expect(result.kondisi).toBe('Rusak Ringan')
      expect(mockAssetRepository.update).toHaveBeenCalledWith(1, {
        kondisi: 'Rusak Ringan',
      })
      expect(mockAuditRepository.create).toHaveBeenCalledTimes(2)
      expect(mockAuditRepository.create).toHaveBeenCalledWith({
        entityType: 'Asset',
        entityId: 1,
        action: 'UPDATE',
        userId: 1,
        fieldChanged: {
          field: 'kondisi',
          oldValue: 'Baik',
          newValue: 'Rusak Ringan',
          reason: 'Inventory Check',
        },
      })
    })

    it('should handle different checker IDs', async () => {
      // Arrange
      const input: CreateInventoryInput = {
        qrCodeScanned: 'qr-code-1',
        kondisi: 'Baik',
        photoUrl: null,
        note: null,
      }

      vi.mocked(mockAssetRepository.findByQRCode).mockResolvedValue(mockAsset)
      vi.mocked(mockInventoryRepository.create).mockResolvedValue({
        ...mockInventoryCheck,
        checkedBy: 5,
      })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'InventoryCheck',
        entityId: 1,
        userId: 5,
        action: 'CREATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await createInventoryUseCase.execute(input, 5)

      // Assert
      expect(mockInventoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          checker: { connect: { id: 5 } },
        })
      )
      expect(mockAuditRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 5,
        })
      )
    })
  })

  describe('Asset Not Found', () => {
    it('should throw NotFoundError when QR code does not exist', async () => {
      // Arrange
      const input: CreateInventoryInput = {
        qrCodeScanned: 'invalid-qr',
        kondisi: 'Baik',
        photoUrl: null,
        note: null,
      }

      vi.mocked(mockAssetRepository.findByQRCode).mockResolvedValue(null)

      // Act & Assert
      await expect(createInventoryUseCase.execute(input, 1)).rejects.toThrow(
        NotFoundError
      )

      await expect(createInventoryUseCase.execute(input, 1)).rejects.toThrow(
        'Asset dengan QR Code invalid-qr tidak ditemukan'
      )

      expect(mockInventoryRepository.create).not.toHaveBeenCalled()
      expect(mockAuditRepository.create).not.toHaveBeenCalled()
    })

    it('should include QR code in error message', async () => {
      // Arrange
      const qrCode = 'test-qr-12345'
      const input: CreateInventoryInput = {
        qrCodeScanned: qrCode,
        kondisi: 'Baik',
        photoUrl: null,
        note: null,
      }

      vi.mocked(mockAssetRepository.findByQRCode).mockResolvedValue(null)

      // Act & Assert
      await expect(createInventoryUseCase.execute(input, 1)).rejects.toThrow(
        `Asset dengan QR Code ${qrCode} tidak ditemukan`
      )
    })
  })

  describe('Condition Changes', () => {
    it('should detect condition change from Baik to Rusak Ringan', async () => {
      // Arrange
      const input: CreateInventoryInput = {
        qrCodeScanned: 'qr-code-1',
        kondisi: 'Rusak Ringan',
        photoUrl: null,
        note: 'Kondisi menurun',
      }

      vi.mocked(mockAssetRepository.findByQRCode).mockResolvedValue(mockAsset)
      vi.mocked(mockInventoryRepository.create).mockResolvedValue(
        mockInventoryCheck
      )
      vi.mocked(mockAssetRepository.update).mockResolvedValue(mockAsset)
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'Asset',
        entityId: 1,
        userId: 1,
        action: 'UPDATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await createInventoryUseCase.execute(input, 1)

      // Assert
      expect(mockAssetRepository.update).toHaveBeenCalledWith(1, {
        kondisi: 'Rusak Ringan',
      })
    })

    it('should detect condition change from Rusak Ringan to Rusak Berat', async () => {
      // Arrange
      const assetRusakRingan: Asset = {
        ...mockAsset,
        kondisi: 'Rusak Ringan',
      }

      const input: CreateInventoryInput = {
        qrCodeScanned: 'qr-code-1',
        kondisi: 'Rusak Berat',
        photoUrl: null,
        note: 'Kondisi memburuk',
      }

      vi.mocked(mockAssetRepository.findByQRCode).mockResolvedValue(
        assetRusakRingan
      )
      vi.mocked(mockInventoryRepository.create).mockResolvedValue(
        mockInventoryCheck
      )
      vi.mocked(mockAssetRepository.update).mockResolvedValue(assetRusakRingan)
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'Asset',
        entityId: 1,
        userId: 1,
        action: 'UPDATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await createInventoryUseCase.execute(input, 1)

      // Assert
      expect(mockAssetRepository.update).toHaveBeenCalledWith(1, {
        kondisi: 'Rusak Berat',
      })
      expect(mockAuditRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fieldChanged: expect.objectContaining({
            oldValue: 'Rusak Ringan',
            newValue: 'Rusak Berat',
          }),
        })
      )
    })

    it('should detect condition improvement from Rusak Ringan to Baik', async () => {
      // Arrange
      const assetRusakRingan: Asset = {
        ...mockAsset,
        kondisi: 'Rusak Ringan',
      }

      const input: CreateInventoryInput = {
        qrCodeScanned: 'qr-code-1',
        kondisi: 'Baik',
        photoUrl: null,
        note: 'Sudah diperbaiki',
      }

      vi.mocked(mockAssetRepository.findByQRCode).mockResolvedValue(
        assetRusakRingan
      )
      vi.mocked(mockInventoryRepository.create).mockResolvedValue(
        mockInventoryCheck
      )
      vi.mocked(mockAssetRepository.update).mockResolvedValue(assetRusakRingan)
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'Asset',
        entityId: 1,
        userId: 1,
        action: 'UPDATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await createInventoryUseCase.execute(input, 1)

      // Assert
      expect(mockAssetRepository.update).toHaveBeenCalledWith(1, {
        kondisi: 'Baik',
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle inventory check with photo', async () => {
      // Arrange
      const input: CreateInventoryInput = {
        qrCodeScanned: 'qr-code-1',
        kondisi: 'Baik',
        photoUrl: 'https://example.com/photo.jpg',
        note: null,
      }

      vi.mocked(mockAssetRepository.findByQRCode).mockResolvedValue(mockAsset)
      vi.mocked(mockInventoryRepository.create).mockResolvedValue({
        ...mockInventoryCheck,
        photoUrl: 'https://example.com/photo.jpg',
      })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'InventoryCheck',
        entityId: 1,
        userId: 1,
        action: 'CREATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      const result = await createInventoryUseCase.execute(input, 1)

      // Assert
      expect(result.photoUrl).toBe('https://example.com/photo.jpg')
    })

    it('should handle inventory check with detailed notes', async () => {
      // Arrange
      const longNote = 'Kondisi fisik baik, tidak ada kerusakan. '.repeat(10)
      const input: CreateInventoryInput = {
        qrCodeScanned: 'qr-code-1',
        kondisi: 'Baik',
        photoUrl: null,
        note: longNote,
      }

      vi.mocked(mockAssetRepository.findByQRCode).mockResolvedValue(mockAsset)
      vi.mocked(mockInventoryRepository.create).mockResolvedValue({
        ...mockInventoryCheck,
        note: longNote,
      })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'InventoryCheck',
        entityId: 1,
        userId: 1,
        action: 'CREATE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      const result = await createInventoryUseCase.execute(input, 1)

      // Assert
      expect(result.note).toBe(longNote)
    })

    it('should handle different QR code formats', async () => {
      // Arrange
      const qrCodes = [
        'qr-code-1',
        'QR-CODE-2',
        'qr_code_3',
        'QRCODE4',
        '12345',
      ]

      for (const qrCode of qrCodes) {
        vi.clearAllMocks()

        const input: CreateInventoryInput = {
          qrCodeScanned: qrCode,
          kondisi: 'Baik',
          photoUrl: null,
          note: null,
        }

        vi.mocked(mockAssetRepository.findByQRCode).mockResolvedValue({
          ...mockAsset,
          qrCode,
        })
        vi.mocked(mockInventoryRepository.create).mockResolvedValue({
          ...mockInventoryCheck,
          qrCodeScanned: qrCode,
        })
        vi.mocked(mockAuditRepository.create).mockResolvedValue({
          id: 1,
          entityType: 'InventoryCheck',
          entityId: 1,
          userId: 1,
          action: 'CREATE',
          fieldChanged: {},
          createdAt: new Date(),
        })

        // Act
        await createInventoryUseCase.execute(input, 1)

        // Assert
        expect(mockAssetRepository.findByQRCode).toHaveBeenCalledWith(qrCode)
      }
    })
  })
})
