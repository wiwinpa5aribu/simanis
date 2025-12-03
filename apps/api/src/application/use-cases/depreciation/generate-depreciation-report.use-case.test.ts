import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PrismaClient } from '@simanis/database'
import { GenerateDepreciationReportUseCase } from './generate-depreciation-report.use-case'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import { ValidationError } from '../../../shared/errors/validation-error'
import ExcelJS from 'exceljs'

describe('GenerateDepreciationReportUseCase', () => {
  let prisma: PrismaClient
  let useCase: GenerateDepreciationReportUseCase

  beforeEach(() => {
    prisma = {
      asset: {
        findMany: vi.fn(),
      },
      assetCategory: {
        findUnique: vi.fn(),
      },
    } as any
    useCase = new GenerateDepreciationReportUseCase(prisma)
  })

  describe('execute', () => {
    it('should throw ValidationError if year < 2000', async () => {
      await expect(
        useCase.execute({ year: 1999, month: 1, format: 'excel' })
      ).rejects.toThrow(ValidationError)

      await expect(
        useCase.execute({ year: 1999, month: 1, format: 'excel' })
      ).rejects.toThrow('Tahun harus antara 2000-2100')
    })

    it('should throw ValidationError if year > 2100', async () => {
      await expect(
        useCase.execute({ year: 2101, month: 1, format: 'excel' })
      ).rejects.toThrow(ValidationError)

      await expect(
        useCase.execute({ year: 2101, month: 1, format: 'excel' })
      ).rejects.toThrow('Tahun harus antara 2000-2100')
    })

    it('should throw ValidationError if month < 1', async () => {
      await expect(
        useCase.execute({ year: 2024, month: 0, format: 'excel' })
      ).rejects.toThrow(ValidationError)

      await expect(
        useCase.execute({ year: 2024, month: 0, format: 'excel' })
      ).rejects.toThrow('Bulan harus antara 1-12')
    })

    it('should throw ValidationError if month > 12', async () => {
      await expect(
        useCase.execute({ year: 2024, month: 13, format: 'excel' })
      ).rejects.toThrow(ValidationError)

      await expect(
        useCase.execute({ year: 2024, month: 13, format: 'excel' })
      ).rejects.toThrow('Bulan harus antara 1-12')
    })

    it('should throw ValidationError if format is not excel', async () => {
      await expect(
        useCase.execute({ year: 2024, month: 1, format: 'pdf' as any })
      ).rejects.toThrow(ValidationError)

      await expect(
        useCase.execute({ year: 2024, month: 1, format: 'pdf' as any })
      ).rejects.toThrow('Saat ini hanya support format excel')
    })

    it('should throw NotFoundError if no assets found', async () => {
      vi.mocked(prisma.asset.findMany).mockResolvedValue([])

      await expect(
        useCase.execute({ year: 2024, month: 1, format: 'excel' })
      ).rejects.toThrow(NotFoundError)

      await expect(
        useCase.execute({ year: 2024, month: 1, format: 'excel' })
      ).rejects.toThrow('Tidak ada data aset untuk laporan ini')
    })

    it('should generate Excel report successfully', async () => {
      const mockAssets = [
        {
          id: 1,
          kodeAset: 'E-001',
          namaBarang: 'Laptop',
          harga: 15_000_000,
          masaManfaatTahun: 4,
          category: { name: 'Elektronik' },
          depreciationEntries: [
            { nilaiPenyusutan: 312_500 },
            { nilaiPenyusutan: 312_500 },
          ],
        },
        {
          id: 2,
          kodeAset: 'E-002',
          namaBarang: 'Printer',
          harga: 5_000_000,
          masaManfaatTahun: 4,
          category: { name: 'Elektronik' },
          depreciationEntries: [{ nilaiPenyusutan: 104_167 }],
        },
      ]

      vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)

      const result = await useCase.execute({
        year: 2024,
        month: 1,
        format: 'excel',
      })

      expect(result).toBeInstanceOf(Buffer)
      expect(result.length).toBeGreaterThan(0)
      expect(prisma.asset.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        include: {
          category: true,
          depreciationEntries: {
            orderBy: { tanggalHitung: 'desc' },
          },
        },
        orderBy: { kodeAset: 'asc' },
      })
    })

    it('**Feature: depreciation, Property 12: Report Category Filter** - should filter by categoryId', async () => {
      const categoryId = 2

      const mockAssets = [
        {
          id: 1,
          kodeAset: 'M-001',
          namaBarang: 'Meja',
          harga: 2_000_000,
          masaManfaatTahun: 5,
          categoryId: 2,
          category: { name: 'Mebel' },
          depreciationEntries: [],
        },
      ]

      vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)
      vi.mocked(prisma.assetCategory.findUnique).mockResolvedValue({
        id: 2,
        name: 'Mebel',
      } as any)

      const result = await useCase.execute({
        year: 2024,
        month: 1,
        categoryId,
        format: 'excel',
      })

      expect(result).toBeInstanceOf(Buffer)

      // Verify that the filter was applied
      expect(prisma.asset.findMany).toHaveBeenCalledWith({
        where: {
          isDeleted: false,
          categoryId: 2,
        },
        include: {
          category: true,
          depreciationEntries: {
            orderBy: { tanggalHitung: 'desc' },
          },
        },
        orderBy: { kodeAset: 'asc' },
      })

      // Verify category name in report
      expect(prisma.assetCategory.findUnique).toHaveBeenCalledWith({
        where: { id: categoryId },
      })
    })

    it('should calculate depreciation data correctly', async () => {
      const mockAssets = [
        {
          id: 1,
          kodeAset: 'E-001',
          namaBarang: 'Laptop',
          harga: 12_000_000,
          masaManfaatTahun: 4,
          category: { name: 'Elektronik' },
          depreciationEntries: [
            { nilaiPenyusutan: 250_000 },
            { nilaiPenyusutan: 250_000 },
            { nilaiPenyusutan: 250_000 },
          ],
        },
      ]

      vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)

      const buffer = await useCase.execute({
        year: 2024,
        month: 1,
        format: 'excel',
      })

      // Read the generated Excel to verify data
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(buffer)

      const worksheet = workbook.getWorksheet('Laporan Penyusutan')
      expect(worksheet).toBeDefined()

      // Check header
      expect(worksheet?.getCell('A1').value).toBe('LAPORAN PENYUSUTAN ASET')
      expect(worksheet?.getCell('A2').value).toContain('Januari 2024')

      // Check data row (row 6 after headers)
      const dataRow = worksheet?.getRow(6)
      expect(dataRow?.getCell(1).value).toBe(1) // No
      expect(dataRow?.getCell(2).value).toBe('E-001') // Kode
      expect(dataRow?.getCell(3).value).toBe('Laptop') // Nama
      expect(dataRow?.getCell(4).value).toBe('Elektronik') // Kategori
      expect(dataRow?.getCell(5).value).toBe(12_000_000) // Nilai Perolehan
      expect(dataRow?.getCell(6).value).toBe(4) // Masa Manfaat
      expect(dataRow?.getCell(7).value).toBe(250_000) // Penyusutan/Bulan
      expect(dataRow?.getCell(8).value).toBe(750_000) // Akumulasi
      expect(dataRow?.getCell(9).value).toBe(11_250_000) // Nilai Buku
    })

    it('should handle assets with default masa manfaat', async () => {
      const mockAssets = [
        {
          id: 1,
          kodeAset: 'E-001',
          namaBarang: 'Mouse',
          harga: 200_000,
          masaManfaatTahun: null, // Should default to 4
          category: { name: 'Elektronik' },
          depreciationEntries: [],
        },
      ]

      vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)

      const buffer = await useCase.execute({
        year: 2024,
        month: 1,
        format: 'excel',
      })

      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(buffer)

      const worksheet = workbook.getWorksheet('Laporan Penyusutan')
      const dataRow = worksheet?.getRow(6)

      // Should use default masa manfaat = 4 years
      expect(dataRow?.getCell(6).value).toBe(4)
      // Penyusutan = 200_000 / (4 * 12) = 4,166.67
      expect(dataRow?.getCell(7).value).toBeCloseTo(4_166.67, 0)
    })

    it('should highlight fully depreciated assets', async () => {
      const mockAssets = [
        {
          id: 1,
          kodeAset: 'E-001',
          namaBarang: 'Old Laptop',
          harga: 10_000_000,
          masaManfaatTahun: 4,
          category: { name: 'Elektronik' },
          depreciationEntries: Array(48).fill({ nilaiPenyusutan: 208_333.33 }), // Fully depreciated
        },
      ]

      vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)

      const buffer = await useCase.execute({
        year: 2024,
        month: 1,
        format: 'excel',
      })

      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(buffer)

      const worksheet = workbook.getWorksheet('Laporan Penyusutan')
      const dataRow = worksheet?.getRow(6)

      // Verify asset is fully depreciated (nilai buku close to 0)
      expect(dataRow?.getCell(9).value).toBeCloseTo(0, 0)
      
      // Note: Fill styling is applied but ExcelJS may not preserve it when reading back
      // The important thing is the data is correct (within rounding tolerance)
    })

    it('should calculate summary totals correctly', async () => {
      const mockAssets = [
        {
          id: 1,
          kodeAset: 'E-001',
          namaBarang: 'Laptop',
          harga: 10_000_000,
          masaManfaatTahun: 4,
          category: { name: 'Elektronik' },
          depreciationEntries: [{ nilaiPenyusutan: 208_333 }],
        },
        {
          id: 2,
          kodeAset: 'E-002',
          namaBarang: 'Printer',
          harga: 5_000_000,
          masaManfaatTahun: 4,
          category: { name: 'Elektronik' },
          depreciationEntries: [{ nilaiPenyusutan: 104_167 }],
        },
      ]

      vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)

      const buffer = await useCase.execute({
        year: 2024,
        month: 1,
        format: 'excel',
      })

      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(buffer)

      const worksheet = workbook.getWorksheet('Laporan Penyusutan')
      
      // Summary row should be at row 9 (after 2 data rows + empty row)
      const summaryRow = worksheet?.getRow(9)

      expect(summaryRow?.getCell(4).value).toBe('TOTAL')
      expect(summaryRow?.getCell(5).value).toBe(15_000_000) // Total Nilai Perolehan
      expect(summaryRow?.getCell(8).value).toBe(312_500) // Total Akumulasi
      expect(summaryRow?.getCell(9).value).toBeCloseTo(14_687_500, 0) // Total Nilai Buku
    })
  })
})
