import type { Asset } from '@simanis/database'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IAssetRepository } from '../../../domain/repositories/asset.repository'
import type { IAuditRepository } from '../../../domain/repositories/audit.repository'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import { ValidationError } from '../../../shared/errors/validation-error'
import {
  type DeleteAssetInput,
  DeleteAssetUseCase,
  type IAssetDocumentRepository,
} from './delete-asset.use-case'

describe('DeleteAssetUseCase', () => {
  let deleteAssetUseCase: DeleteAssetUseCase
  let mockAssetRepository: IAssetRepository
  let mockAuditRepository: IAuditRepository
  let mockDocumentRepository: IAssetDocumentRepository

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

    mockDocumentRepository = {
      create: vi.fn(),
    }
  })

  describe('Successful Deletion', () => {
    it('should soft delete asset with berita acara', async () => {
      // Arrange
      deleteAssetUseCase = new DeleteAssetUseCase(
        mockAssetRepository,
        mockAuditRepository,
        mockDocumentRepository
      )

      const deleteInput: DeleteAssetInput = {
        beritaAcaraUrl: 'https://example.com/berita-acara.pdf',
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(mockAsset)
      vi.mocked(mockAssetRepository.softDelete).mockResolvedValue(undefined)
      vi.mocked(mockDocumentRepository.create).mockResolvedValue({ id: 1 })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'DELETE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await deleteAssetUseCase.execute(1, deleteInput, 1)

      // Assert
      expect(mockAssetRepository.findById).toHaveBeenCalledWith(1)
      expect(mockDocumentRepository.create).toHaveBeenCalledWith({
        assetId: 1,
        docType: 'BERITA_ACARA_HAPUS',
        fileUrl: 'https://example.com/berita-acara.pdf',
        uploadedBy: 1,
      })
      expect(mockAssetRepository.softDelete).toHaveBeenCalledWith(1, 1)
      expect(mockAuditRepository.create).toHaveBeenCalledWith({
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'DELETE',
        fieldChanged: {
          isDeleted: { from: false, to: true },
          beritaAcaraUrl: 'https://example.com/berita-acara.pdf',
        },
      })
    })

    it('should work without document repository', async () => {
      // Arrange
      deleteAssetUseCase = new DeleteAssetUseCase(
        mockAssetRepository,
        mockAuditRepository
        // No document repository
      )

      const deleteInput: DeleteAssetInput = {
        beritaAcaraUrl: 'https://example.com/berita-acara.pdf',
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(mockAsset)
      vi.mocked(mockAssetRepository.softDelete).mockResolvedValue(undefined)
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'DELETE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await deleteAssetUseCase.execute(1, deleteInput, 1)

      // Assert
      expect(mockAssetRepository.softDelete).toHaveBeenCalledWith(1, 1)
      expect(mockAuditRepository.create).toHaveBeenCalled()
    })

    it('should handle different user IDs', async () => {
      // Arrange
      deleteAssetUseCase = new DeleteAssetUseCase(
        mockAssetRepository,
        mockAuditRepository,
        mockDocumentRepository
      )

      const deleteInput: DeleteAssetInput = {
        beritaAcaraUrl: 'https://example.com/berita-acara.pdf',
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(mockAsset)
      vi.mocked(mockAssetRepository.softDelete).mockResolvedValue(undefined)
      vi.mocked(mockDocumentRepository.create).mockResolvedValue({ id: 1 })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 5,
        action: 'DELETE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await deleteAssetUseCase.execute(1, deleteInput, 5)

      // Assert
      expect(mockAssetRepository.softDelete).toHaveBeenCalledWith(1, 5)
      expect(mockDocumentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          uploadedBy: 5,
        })
      )
      expect(mockAuditRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 5,
        })
      )
    })
  })

  describe('Validation Errors', () => {
    beforeEach(() => {
      deleteAssetUseCase = new DeleteAssetUseCase(
        mockAssetRepository,
        mockAuditRepository,
        mockDocumentRepository
      )
    })

    it('should throw ValidationError when berita acara URL is missing', async () => {
      // Arrange
      const deleteInput: DeleteAssetInput = {
        beritaAcaraUrl: '',
      }

      // Act & Assert
      await expect(
        deleteAssetUseCase.execute(1, deleteInput, 1)
      ).rejects.toThrow(ValidationError)

      await expect(
        deleteAssetUseCase.execute(1, deleteInput, 1)
      ).rejects.toThrow('Berita Acara wajib dilampirkan untuk menghapus aset')

      expect(mockAssetRepository.findById).not.toHaveBeenCalled()
      expect(mockAssetRepository.softDelete).not.toHaveBeenCalled()
    })

    it('should throw ValidationError when berita acara URL is only whitespace', async () => {
      // Arrange
      const deleteInput: DeleteAssetInput = {
        beritaAcaraUrl: '   ',
      }

      // Act & Assert
      await expect(
        deleteAssetUseCase.execute(1, deleteInput, 1)
      ).rejects.toThrow(ValidationError)

      expect(mockAssetRepository.findById).not.toHaveBeenCalled()
    })

    it('should throw ValidationError when asset is already deleted', async () => {
      // Arrange
      const deletedAsset: Asset = {
        ...mockAsset,
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: 1,
      }

      const deleteInput: DeleteAssetInput = {
        beritaAcaraUrl: 'https://example.com/berita-acara.pdf',
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(deletedAsset)

      // Act & Assert
      await expect(
        deleteAssetUseCase.execute(1, deleteInput, 1)
      ).rejects.toThrow(ValidationError)

      await expect(
        deleteAssetUseCase.execute(1, deleteInput, 1)
      ).rejects.toThrow('Aset sudah dihapus sebelumnya')

      expect(mockAssetRepository.softDelete).not.toHaveBeenCalled()
      expect(mockAuditRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('Asset Not Found', () => {
    beforeEach(() => {
      deleteAssetUseCase = new DeleteAssetUseCase(
        mockAssetRepository,
        mockAuditRepository,
        mockDocumentRepository
      )
    })

    it('should throw NotFoundError when asset does not exist', async () => {
      // Arrange
      const deleteInput: DeleteAssetInput = {
        beritaAcaraUrl: 'https://example.com/berita-acara.pdf',
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(null)

      // Act & Assert
      await expect(
        deleteAssetUseCase.execute(999, deleteInput, 1)
      ).rejects.toThrow(NotFoundError)

      await expect(
        deleteAssetUseCase.execute(999, deleteInput, 1)
      ).rejects.toThrow('Aset tidak ditemukan')

      expect(mockAssetRepository.softDelete).not.toHaveBeenCalled()
      expect(mockAuditRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    beforeEach(() => {
      deleteAssetUseCase = new DeleteAssetUseCase(
        mockAssetRepository,
        mockAuditRepository,
        mockDocumentRepository
      )
    })

    it('should handle berita acara URL with special characters', async () => {
      // Arrange
      const deleteInput: DeleteAssetInput = {
        beritaAcaraUrl: 'https://example.com/berita acara 2024 (final).pdf?v=1',
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(mockAsset)
      vi.mocked(mockAssetRepository.softDelete).mockResolvedValue(undefined)
      vi.mocked(mockDocumentRepository.create).mockResolvedValue({ id: 1 })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'DELETE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await deleteAssetUseCase.execute(1, deleteInput, 1)

      // Assert
      expect(mockDocumentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fileUrl: 'https://example.com/berita acara 2024 (final).pdf?v=1',
        })
      )
    })

    it('should handle long berita acara URLs', async () => {
      // Arrange
      const longUrl = 'https://example.com/' + 'a'.repeat(500) + '.pdf'
      const deleteInput: DeleteAssetInput = {
        beritaAcaraUrl: longUrl,
      }

      vi.mocked(mockAssetRepository.findById).mockResolvedValue(mockAsset)
      vi.mocked(mockAssetRepository.softDelete).mockResolvedValue(undefined)
      vi.mocked(mockDocumentRepository.create).mockResolvedValue({ id: 1 })
      vi.mocked(mockAuditRepository.create).mockResolvedValue({
        id: 1,
        entityType: 'asset',
        entityId: 1,
        userId: 1,
        action: 'DELETE',
        fieldChanged: {},
        createdAt: new Date(),
      })

      // Act
      await deleteAssetUseCase.execute(1, deleteInput, 1)

      // Assert
      expect(mockDocumentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fileUrl: longUrl,
        })
      )
    })

    it('should handle deletion order correctly', async () => {
      // Arrange
      const deleteInput: DeleteAssetInput = {
        beritaAcaraUrl: 'https://example.com/berita-acara.pdf',
      }

      const callOrder: string[] = []

      vi.mocked(mockAssetRepository.findById).mockImplementation(async () => {
        callOrder.push('findById')
        return mockAsset
      })

      vi.mocked(mockDocumentRepository.create).mockImplementation(async () => {
        callOrder.push('createDocument')
        return { id: 1 }
      })

      vi.mocked(mockAssetRepository.softDelete).mockImplementation(async () => {
        callOrder.push('softDelete')
      })

      vi.mocked(mockAuditRepository.create).mockImplementation(async () => {
        callOrder.push('createAudit')
        return {
          id: 1,
          entityType: 'asset',
          entityId: 1,
          userId: 1,
          action: 'DELETE',
          fieldChanged: {},
          createdAt: new Date(),
        }
      })

      // Act
      await deleteAssetUseCase.execute(1, deleteInput, 1)

      // Assert - Verify correct order
      expect(callOrder).toEqual([
        'findById',
        'createDocument',
        'softDelete',
        'createAudit',
      ])
    })
  })
})
