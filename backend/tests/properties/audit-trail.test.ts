import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { UpdateAssetUseCase } from '../../src/application/use-cases/assets/update-asset.use-case';
import { IAssetRepository, AssetWithRelations } from '../../src/domain/repositories/asset.repository';
import { IAuditRepository } from '../../src/domain/repositories/audit.repository';
import { Asset, AuditLog } from '@prisma/client';

/**
 * Property Tests for Audit Trail
 * Property 9: Audit Trail on Update
 * Validates: Requirements 3.2
 */

// Mock asset factory
const createMockAsset = (overrides: Partial<Asset> = {}): AssetWithRelations => ({
  id: 1,
  kodeAset: 'SCH/25/ELK/001',
  namaBarang: 'Laptop Dell',
  merk: 'Dell',
  spesifikasi: 'Core i5, 8GB RAM',
  tahunPerolehan: new Date('2025-01-01'),
  harga: 10000000,
  sumberDana: 'BOS',
  kondisi: 'Baik',
  fotoUrl: null,
  qrCode: 'data:image/png;base64,xxx',
  isDeleted: false,
  deletedAt: null,
  createdBy: 1,
  categoryId: 1,
  masaManfaatTahun: 4,
  currentRoomId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: null,
  mutations: [],
  ...overrides,
});

describe('Audit Trail on Update (Property 9)', () => {
  let mockAssetRepository: IAssetRepository;
  let mockAuditRepository: IAuditRepository;
  let auditCreateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    auditCreateSpy = vi.fn().mockResolvedValue({} as AuditLog);

    mockAssetRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      findByKodeAset: vi.fn(),
      findByQRCode: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
      count: vi.fn(),
      findLastByKodePattern: vi.fn(),
    };

    mockAuditRepository = {
      create: auditCreateSpy,
      findAll: vi.fn(),
    };
  });

  it('should create audit log when any field changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('Rusak Ringan', 'Rusak Berat', 'Hilang'),
        fc.integer({ min: 1, max: 1000 }),
        async (newKondisi, userId) => {
          const existingAsset = createMockAsset({ kondisi: 'Baik' });

          vi.mocked(mockAssetRepository.findById).mockResolvedValue(existingAsset);
          vi.mocked(mockAssetRepository.update).mockResolvedValue({
            ...existingAsset,
            kondisi: newKondisi,
          } as Asset);

          auditCreateSpy.mockClear();

          const useCase = new UpdateAssetUseCase(mockAssetRepository, mockAuditRepository);
          await useCase.execute(existingAsset.id, { kondisi: newKondisi }, userId);

          // Verify audit log was created
          expect(auditCreateSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              entityType: 'asset',
              entityId: existingAsset.id,
              userId,
              action: 'UPDATE',
            })
          );

          // Verify fieldChanged contains the changed field
          const auditCall = auditCreateSpy.mock.calls[0][0];
          expect(auditCall.fieldChanged).toHaveProperty('kondisi');
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should not create audit log when no fields change', async () => {
    const existingAsset = createMockAsset();

    vi.mocked(mockAssetRepository.findById).mockResolvedValue(existingAsset);
    vi.mocked(mockAssetRepository.update).mockResolvedValue(existingAsset as Asset);

    const useCase = new UpdateAssetUseCase(mockAssetRepository, mockAuditRepository);

    // Update with same values
    await useCase.execute(
      existingAsset.id,
      { namaBarang: existingAsset.namaBarang },
      1
    );

    expect(auditCreateSpy).not.toHaveBeenCalled();
  });

  it('should record both old and new values in fieldChanged', async () => {
    const existingAsset = createMockAsset({ kondisi: 'Baik' });
    const newKondisi = 'Rusak Ringan';

    vi.mocked(mockAssetRepository.findById).mockResolvedValue(existingAsset);
    vi.mocked(mockAssetRepository.update).mockResolvedValue({
      ...existingAsset,
      kondisi: newKondisi,
    } as Asset);

    const useCase = new UpdateAssetUseCase(mockAssetRepository, mockAuditRepository);
    await useCase.execute(existingAsset.id, { kondisi: newKondisi }, 1);

    expect(auditCreateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        fieldChanged: expect.objectContaining({
          kondisi: {
            from: 'Baik',
            to: 'Rusak Ringan',
          },
        }),
      })
    );
  });

  it('should track multiple field changes in single audit entry', async () => {
    const existingAsset = createMockAsset({
      namaBarang: 'Old Name',
      merk: 'Old Merk',
      kondisi: 'Baik',
    });

    const updateData = {
      namaBarang: 'New Name',
      merk: 'New Merk',
      kondisi: 'Rusak Ringan' as const,
    };

    vi.mocked(mockAssetRepository.findById).mockResolvedValue(existingAsset);
    vi.mocked(mockAssetRepository.update).mockResolvedValue({
      ...existingAsset,
      ...updateData,
    } as Asset);

    const useCase = new UpdateAssetUseCase(mockAssetRepository, mockAuditRepository);
    await useCase.execute(existingAsset.id, updateData, 1);

    // Should be called once with all changes
    expect(auditCreateSpy).toHaveBeenCalledTimes(1);

    const auditCall = auditCreateSpy.mock.calls[0][0];
    expect(Object.keys(auditCall.fieldChanged)).toHaveLength(3);
    expect(auditCall.fieldChanged).toHaveProperty('namaBarang');
    expect(auditCall.fieldChanged).toHaveProperty('merk');
    expect(auditCall.fieldChanged).toHaveProperty('kondisi');
  });

  it('should associate audit log with correct user', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 1, max: 10000 }), async (userId) => {
        const existingAsset = createMockAsset();

        vi.mocked(mockAssetRepository.findById).mockResolvedValue(existingAsset);
        vi.mocked(mockAssetRepository.update).mockResolvedValue({
          ...existingAsset,
          namaBarang: 'Changed',
        } as Asset);

        auditCreateSpy.mockClear();

        const useCase = new UpdateAssetUseCase(mockAssetRepository, mockAuditRepository);
        await useCase.execute(existingAsset.id, { namaBarang: 'Changed' }, userId);

        expect(auditCreateSpy).toHaveBeenCalledWith(
          expect.objectContaining({ userId })
        );
      }),
      { numRuns: 10 }
    );
  });
});
