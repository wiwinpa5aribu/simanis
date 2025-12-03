import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PrismaClient } from '@simanis/database'
import { SimulateDepreciationUseCase } from './simulate-depreciation.use-case'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import { ValidationError } from '../../../shared/errors/validation-error'

describe('SimulateDepreciationUseCase', () => {
  let prisma: PrismaClient
  let useCase: SimulateDepreciationUseCase

  beforeEach(() => {
    prisma = {
      asset: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
      },
      assetCategory: {
        findUnique: vi.fn(),
      },
    } as any
    useCase = new SimulateDepreciationUseCase(prisma)
  })

  describe('execute', () => {
    it('should throw ValidationError if period < 1', async () => {
      await expect(
        useCase.execute({ assetId: 1, periodMonths: 0 })
      ).rejects.toThrow(ValidationError)

      await expect(
        useCase.execute({ assetId: 1, periodMonths: -5 })
      ).rejects.toThrow('Periode simulasi harus antara 1-60 bulan')
    })

    it('should throw ValidationError if period > 60', async () => {
      await expect(
        useCase.execute({ assetId: 1, periodMonths: 61 })
      ).rejects.toThrow(ValidationError)

      await expect(
        useCase.execute({ assetId: 1, periodMonths: 100 })
      ).rejects.toThrow('Periode simulasi harus antara 1-60 bulan')
    })

    it('should throw ValidationError if neither assetId nor categoryId provided', async () => {
      await expect(
        useCase.execute({ periodMonths: 12 })
      ).rejects.toThrow(ValidationError)

      await expect(
        useCase.execute({ periodMonths: 12 })
      ).rejects.toThrow('Harus memilih aset atau kategori')
    })

    describe('simulateForAsset', () => {
      it('should throw NotFoundError if asset does not exist', async () => {
        vi.mocked(prisma.asset.findUnique).mockResolvedValue(null)

        await expect(
          useCase.execute({ assetId: 999, periodMonths: 12 })
        ).rejects.toThrow(NotFoundError)

        await expect(
          useCase.execute({ assetId: 999, periodMonths: 12 })
        ).rejects.toThrow('Asset dengan ID 999 tidak ditemukan')
      })

      it('should simulate depreciation for a single asset', async () => {
        const asset = {
          id: 1,
          kodeAset: 'E-001',
          namaBarang: 'Laptop',
          harga: 15_000_000,
          masaManfaatTahun: 4,
          depreciationEntries: [],
        }

        vi.mocked(prisma.asset.findUnique).mockResolvedValue(asset as any)

        const result = await useCase.execute({ assetId: 1, periodMonths: 12 })

        expect(result.asset).toEqual({
          id: 1,
          kodeAset: 'E-001',
          namaBarang: 'Laptop',
          nilaiPerolehan: 15_000_000,
          masaManfaatTahun: 4,
          currentBookValue: 15_000_000,
        })
        expect(result.projections).toHaveLength(12)
        expect(result.projections[0].penyusutan).toBeCloseTo(312_500, 0)
      })

      it('should simulate with existing depreciation entries', async () => {
        const asset = {
          id: 1,
          kodeAset: 'E-001',
          namaBarang: 'Laptop',
          harga: 15_000_000,
          masaManfaatTahun: 4,
          depreciationEntries: [
            { nilaiPenyusutan: 312_500 },
            { nilaiPenyusutan: 312_500 },
          ],
        }

        vi.mocked(prisma.asset.findUnique).mockResolvedValue(asset as any)

        const result = await useCase.execute({ assetId: 1, periodMonths: 12 })

        expect(result.asset?.currentBookValue).toBeCloseTo(14_375_000, 0)
        expect(result.totalDepreciationInPeriod).toBeCloseTo(3_750_000, 0)
      })

      it('**Feature: depreciation, Property 13: Simulation Projection Correctness** - should calculate projections correctly', async () => {
        const nilaiPerolehan = 12_000_000
        const masaManfaatTahun = 4
        const monthlyDepreciation = nilaiPerolehan / (masaManfaatTahun * 12) // 250,000

        const asset = {
          id: 1,
          kodeAset: 'E-001',
          namaBarang: 'Printer',
          harga: nilaiPerolehan,
          masaManfaatTahun,
          depreciationEntries: [],
        }

        vi.mocked(prisma.asset.findUnique).mockResolvedValue(asset as any)

        const result = await useCase.execute({ assetId: 1, periodMonths: 6 })

        // Verify Property 13: each month's nilaiBuku = previous - penyusutan
        let expectedBookValue = nilaiPerolehan

        for (let i = 0; i < result.projections.length; i++) {
          const projection = result.projections[i]

          expect(projection.penyusutan).toBeCloseTo(monthlyDepreciation, 0)
          expectedBookValue -= monthlyDepreciation
          expect(projection.nilaiBuku).toBeCloseTo(Math.max(0, expectedBookValue), 0)
        }
      })

      it('**Feature: depreciation, Property 14: Simulation End Date Estimation** - should estimate end date when fully depreciated in period', async () => {
        const asset = {
          id: 1,
          kodeAset: 'E-001',
          namaBarang: 'Mouse',
          harga: 600_000, // Will be fully depreciated in 4 months
          masaManfaatTahun: 4,
          depreciationEntries: [],
        }

        vi.mocked(prisma.asset.findUnique).mockResolvedValue(asset as any)

        const result = await useCase.execute({ assetId: 1, periodMonths: 48 })

        // Should be fully depreciated in 48 months
        expect(result.estimatedEndDate).toBeTruthy()
        expect(result.projections[47].nilaiBuku).toBe(0)
      })

      it('should stop depreciation when book value reaches 0', async () => {
        const asset = {
          id: 1,
          kodeAset: 'E-001',
          namaBarang: 'Keyboard',
          harga: 1_200_000,
          masaManfaatTahun: 4,
          depreciationEntries: [],
        }

        vi.mocked(prisma.asset.findUnique).mockResolvedValue(asset as any)

        const result = await useCase.execute({ assetId: 1, periodMonths: 50 })

        // After 48 months, should be fully depreciated
        const lastProjections = result.projections.slice(48)
        lastProjections.forEach((p) => {
          expect(p.nilaiBuku).toBe(0)
          expect(p.penyusutan).toBe(0)
        })
      })
    })

    describe('simulateForCategory', () => {
      it('should throw NotFoundError if category does not exist', async () => {
        vi.mocked(prisma.assetCategory.findUnique).mockResolvedValue(null)

        await expect(
          useCase.execute({ categoryId: 999, periodMonths: 12 })
        ).rejects.toThrow(NotFoundError)

        await expect(
          useCase.execute({ categoryId: 999, periodMonths: 12 })
        ).rejects.toThrow('Kategori dengan ID 999 tidak ditemukan')
      })

      it('should throw NotFoundError if no assets in category', async () => {
        vi.mocked(prisma.assetCategory.findUnique).mockResolvedValue({
          id: 1,
          name: 'Elektronik',
          defaultMasaManfaat: 4,
        } as any)
        vi.mocked(prisma.asset.findMany).mockResolvedValue([])

        await expect(
          useCase.execute({ categoryId: 1, periodMonths: 12 })
        ).rejects.toThrow(NotFoundError)

        await expect(
          useCase.execute({ categoryId: 1, periodMonths: 12 })
        ).rejects.toThrow('Tidak ada aset dalam kategori ini')
      })

      it('should simulate average depreciation for category', async () => {
        const category = {
          id: 1,
          name: 'Elektronik',
          defaultMasaManfaat: 4,
        }

        const assets = [
          {
            id: 1,
            harga: 10_000_000,
            masaManfaatTahun: 4,
            depreciationEntries: [],
          },
          {
            id: 2,
            harga: 20_000_000,
            masaManfaatTahun: 4,
            depreciationEntries: [],
          },
        ]

        vi.mocked(prisma.assetCategory.findUnique).mockResolvedValue(category as any)
        vi.mocked(prisma.asset.findMany).mockResolvedValue(assets as any)

        const result = await useCase.execute({ categoryId: 1, periodMonths: 12 })

        // Average nilai perolehan = 15,000,000
        // Monthly depreciation = 15,000,000 / 48 = 312,500
        expect(result.projections).toHaveLength(12)
        expect(result.projections[0].penyusutan).toBeCloseTo(312_500, 0)
        expect(result.asset).toBeUndefined() // No specific asset for category simulation
      })
    })
  })
})
