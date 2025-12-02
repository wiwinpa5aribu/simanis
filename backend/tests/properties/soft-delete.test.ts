import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  DeleteAssetUseCase,
  IAssetDocumentRepository,
} from '../../src/application/use-cases/assets/delete-asset.use-case';
import {
  IAssetRepository,
  AssetWithRelations,
} from '../../src/domain/repositories/asset.repository';
import { IAuditRepository } from '../../src/domain/repositories/audit.repository';
import { Asset, AuditLog } from '@prisma/client';
import { ValidationError } from '../../src/shared/errors/validation-error';

/**
 * Property Tests for Soft Delete with Berita Acara
 * Property 12: Soft Delete with Berita Acara
 * Validates: Requirements 5.2, 5.4
 */

// Mock asset factory
const createMockAsset = (overrides: Partial<Asset> = {}): AssetWithRelations => ({
  id: 1,
  kodeAset: 'SCH/25/ELK/001',
  namaBarang: 'Laptop Dell',
  merk: 'Dell',
  spesifikasi: 'Core i5, 8GB RAM',
  tahunPerolehan: new Date('2025-01-01'),
  harga: 10000000 as unknown as import('@prisma/client/runtime/library').Decimal,
  sumberDana: 'BOS',
  kondisi: 'Baik',
  fotoUrl: null,
  qrCode: 'data:image/png;base64,xxx',
  tanggalPencatatan: new Date(),
  isDeleted: false,
  deletedAt: null,
  createdBy: 1,
  categoryId: 1,
  masaManfaatTahun: 4,
  currentRoomId: 1,
  category: null,
  mutations: [],
  ...overrides,
});

describe('Soft Delete with Berita Acara (Property 12)', () => {
  let mockAssetRepository: IAssetRepository;
  let mockAuditRepository: IAuditRepository;
  let mockDocumentRepository: IAssetDocumentRepository;
  let auditCreateSpy: ReturnType<typeof vi.fn>;
  let softDeleteSpy: ReturnType<typeof vi.fn>;
  let documentCreateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    auditCreateSpy = vi.fn().mockResolvedValue({} as AuditLog);
    softDeleteSpy = vi.fn().mockResolvedValue(undefined);
    documentCreateSpy = vi.fn().mockResolvedValue({ id: 1 });

    mockAssetRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      findByKodeAset: vi.fn(),
      findByQRCode: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: softDeleteSpy,
      count: vi.fn(),
      findLastByKodePattern: vi.fn(),
    };

    mockAuditRepository = {
      create: auditCreateSpy,
      findAll: vi.fn(),
    };

    mockDocumentRepository = {
      create: documentCreateSpy,
    };
  });

  describe('Berita Acara Requirement', () => {
    it('should require berita acara URL for deletion', async () => {
      const existingAsset = createMockAsset();
      vi.mocked(mockAssetRepository.findById).mockResolvedValue(existingAsset);

      const useCase = new DeleteAssetUseCase(
        mockAssetRepository,
        mockAuditRepository,
        mockDocumentRepository
      );

      // Empty berita acara should throw
      await expect(
        useCase.execute(existingAsset.id, { beritaAcaraUrl: '' }, 1)
      ).rejects.toThrow(ValidationError);

      // Whitespace only should throw
      await expect(
        useCase.execute(existingAsset.id, { beritaAcaraUrl: '   ' }, 1)
      ).rejects.toThrow(ValidationError);
    });

    it('should accept any non-empty berita acara URL', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
          fc.integer({ min: 1, max: 1000 }),
          async (beritaAcaraUrl, userId) => {
            const existingAsset = createMockAsset();
            vi.mocked(mockAssetRepository.findById).mockResolvedValue(existingAsset);

            softDeleteSpy.mockClear();
            auditCreateSpy.mockClear();
            documentCreateSpy.mockClear();

            const useCase = new DeleteAssetUseCase(
              mockAssetRepository,
              mockAuditRepository,
              mockDocumentRepository
            );

            await useCase.execute(existingAsset.id, { beritaAcaraUrl }, userId);

            expect(softDeleteSpy).toHaveBeenCalledWith(existingAsset.id, userId);
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Soft Delete Behavior', () => {
    it('should call softDelete instead of hard delete', async () => {
      const existingAsset = createMockAsset();
      vi.mocked(mockAssetRepository.findById).mockResolvedValue(existingAsset);

      const useCase = new DeleteAssetUseCase(
        mockAssetRepository,
        mockAuditRepository,
        mockDocumentRepository
      );

      await useCase.execute(
        existingAsset.id,
        { beritaAcaraUrl: '/uploads/ba.pdf' },
        1
      );

      expect(softDeleteSpy).toHaveBeenCalledTimes(1);
      expect(softDeleteSpy).toHaveBeenCalledWith(existingAsset.id, 1);
    });

    it('should not delete already deleted assets', async () => {
      const deletedAsset = createMockAsset({
        isDeleted: true,
        deletedAt: new Date(),
      });
      vi.mocked(mockAssetRepository.findById).mockResolvedValue(deletedAsset);

      const useCase = new DeleteAssetUseCase(
        mockAssetRepository,
        mockAuditRepository,
        mockDocumentRepository
      );

      await expect(
        useCase.execute(deletedAsset.id, { beritaAcaraUrl: '/uploads/ba.pdf' }, 1)
      ).rejects.toThrow(ValidationError);

      expect(softDeleteSpy).not.toHaveBeenCalled();
    });
  });

  describe('Document Storage', () => {
    it('should save berita acara document with correct type', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          fc.integer({ min: 1, max: 1000 }),
          async (beritaAcaraUrl, userId) => {
            const existingAsset = createMockAsset();
            vi.mocked(mockAssetRepository.findById).mockResolvedValue(existingAsset);

            documentCreateSpy.mockClear();

            const useCase = new DeleteAssetUseCase(
              mockAssetRepository,
              mockAuditRepository,
              mockDocumentRepository
            );

            await useCase.execute(existingAsset.id, { beritaAcaraUrl }, userId);

            expect(documentCreateSpy).toHaveBeenCalledWith({
              assetId: existingAsset.id,
              docType: 'BERITA_ACARA_HAPUS',
              fileUrl: beritaAcaraUrl,
              uploadedBy: userId,
            });
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Audit Trail', () => {
    it('should create audit log for deletion', async () => {
      const existingAsset = createMockAsset();
      vi.mocked(mockAssetRepository.findById).mockResolvedValue(existingAsset);

      const useCase = new DeleteAssetUseCase(
        mockAssetRepository,
        mockAuditRepository,
        mockDocumentRepository
      );

      const beritaAcaraUrl = '/uploads/ba-hapus.pdf';
      await useCase.execute(existingAsset.id, { beritaAcaraUrl }, 1);

      expect(auditCreateSpy).toHaveBeenCalledWith({
        entityType: 'asset',
        entityId: existingAsset.id,
        userId: 1,
        action: 'DELETE',
        fieldChanged: {
          isDeleted: { from: false, to: true },
          beritaAcaraUrl,
        },
      });
    });

    it('should associate audit log with correct user', async () => {
      await fc.assert(
        fc.asyncProperty(fc.integer({ min: 1, max: 10000 }), async (userId) => {
          const existingAsset = createMockAsset();
          vi.mocked(mockAssetRepository.findById).mockResolvedValue(existingAsset);

          auditCreateSpy.mockClear();

          const useCase = new DeleteAssetUseCase(
            mockAssetRepository,
            mockAuditRepository,
            mockDocumentRepository
          );

          await useCase.execute(
            existingAsset.id,
            { beritaAcaraUrl: '/uploads/ba.pdf' },
            userId
          );

          expect(auditCreateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ userId })
          );
        }),
        { numRuns: 10 }
      );
    });
  });
});
