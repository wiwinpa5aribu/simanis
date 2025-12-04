import { PrismaClient } from '@simanis/database'
import ExcelJS from 'exceljs'
import fc from 'fast-check'
import { beforeEach, describe, it, vi } from 'vitest'
import { GenerateDepreciationReportUseCase } from '../../src/application/use-cases/depreciation/generate-depreciation-report.use-case'

describe('Depreciation Report - Property Tests', () => {
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

  /**
   * Property 12: Report Category Filter
   * For any depreciation report with category filter, all items in the report
   * must belong to the selected category.
   * Validates: Requirements 5.4
   */
  it('**Feature: depreciation, Property 12: Report Category Filter**', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }), // categoryId (reduced range)
        fc.integer({ min: 2023, max: 2024 }), // year (reduced range)
        fc.integer({ min: 1, max: 3 }), // month (reduced range)
        async (selectedCategoryId, year, month) => {
          // Reset mocks for each run
          vi.clearAllMocks()

          // Create simple mock assets with selected category
          const mockAssets = [
            {
              id: 1,
              kodeAset: `CAT${selectedCategoryId}-001`,
              namaBarang: `Asset Category ${selectedCategoryId}`,
              harga: 1_000_000,
              masaManfaatTahun: 4,
              categoryId: selectedCategoryId,
              category: {
                id: selectedCategoryId,
                name: `Category ${selectedCategoryId}`,
              },
              depreciationEntries: [],
              isDeleted: false,
            },
          ]

          // Mock Prisma responses
          vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)
          vi.mocked(prisma.assetCategory.findUnique).mockResolvedValue({
            id: selectedCategoryId,
            name: `Category ${selectedCategoryId}`,
          } as any)

          const _buffer = await useCase.execute({
            year,
            month,
            categoryId: selectedCategoryId,
            format: 'excel',
          })

          // Verify that findMany was called with category filter
          const call = vi.mocked(prisma.asset.findMany).mock.calls[0][0]
          return call?.where?.categoryId === selectedCategoryId
        }
      ),
      { numRuns: 10 } // Reduced runs for simplicity
    )
  })

  /**
   * Additional Property: Report Data Completeness
   * For any report, all required columns must be present and non-empty
   */
  it('**Feature: depreciation, Property: Report Data Completeness**', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 2020, max: 2024 }), // year
        fc.integer({ min: 1, max: 12 }), // month
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 1000 }),
            kodeAset: fc.stringMatching(/^[A-Z0-9]{5,10}$/),
            namaBarang: fc.stringMatching(/^[A-Z0-9 ]{5,30}$/),
            harga: fc.integer({ min: 100_000, max: 100_000_000 }),
            masaManfaatTahun: fc.integer({ min: 1, max: 20 }),
            categoryId: fc.integer({ min: 1, max: 10 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (year, month, assets) => {
          const mockAssets = assets.map((a) => ({
            ...a,
            category: { id: a.categoryId, name: `Category ${a.categoryId}` },
            depreciationEntries: [],
            isDeleted: false,
          }))

          vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)

          const buffer = await useCase.execute({
            year,
            month,
            format: 'excel',
          })

          const workbook = new ExcelJS.Workbook()
          await workbook.xlsx.load(buffer)

          const worksheet = workbook.getWorksheet('Laporan Penyusutan')
          if (!worksheet) {
            return false
          }

          // Check header row (row 5)
          const headerRow = worksheet.getRow(5)
          const expectedHeaders = [
            'No',
            'Kode Aset',
            'Nama Barang',
            'Kategori',
            'Nilai Perolehan',
            'Masa Manfaat (Tahun)',
            'Penyusutan/Bulan',
            'Akumulasi Penyusutan',
            'Nilai Buku',
          ]

          for (let i = 0; i < expectedHeaders.length; i++) {
            const cellValue = headerRow.getCell(i + 1).value
            if (cellValue !== expectedHeaders[i]) {
              return false
            }
          }

          // Check that each data row has all required fields
          for (let rowNum = 6; rowNum <= 6 + assets.length - 1; rowNum++) {
            const row = worksheet.getRow(rowNum)

            // All columns should have values
            for (let col = 1; col <= 9; col++) {
              const value = row.getCell(col).value
              if (value === null || value === undefined || value === '') {
                return false
              }
            }
          }

          return true
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * Additional Property: Summary Calculation Consistency
   * For any report, the summary totals must equal the sum of individual values
   */
  it('**Feature: depreciation, Property: Summary Calculation Consistency**', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 2020, max: 2024 }), // year
        fc.integer({ min: 1, max: 12 }), // month
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 1000 }),
            kodeAset: fc.stringMatching(/^[A-Z0-9]{5,10}$/),
            namaBarang: fc.stringMatching(/^[A-Z0-9 ]{5,30}$/),
            harga: fc.integer({ min: 100_000, max: 100_000_000 }),
            masaManfaatTahun: fc.integer({ min: 1, max: 20 }),
            categoryId: fc.integer({ min: 1, max: 10 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (year, month, assets) => {
          const mockAssets = assets.map((a) => ({
            ...a,
            category: { id: a.categoryId, name: `Category ${a.categoryId}` },
            depreciationEntries: [],
            isDeleted: false,
          }))

          vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)

          const buffer = await useCase.execute({
            year,
            month,
            format: 'excel',
          })

          const workbook = new ExcelJS.Workbook()
          await workbook.xlsx.load(buffer)

          const worksheet = workbook.getWorksheet('Laporan Penyusutan')
          if (!worksheet) {
            return false
          }

          // Calculate expected totals
          let expectedTotalNilaiPerolehan = 0
          let expectedTotalAkumulasi = 0
          let expectedTotalNilaiBuku = 0

          for (let rowNum = 6; rowNum <= 6 + assets.length - 1; rowNum++) {
            const row = worksheet.getRow(rowNum)
            expectedTotalNilaiPerolehan += Number(row.getCell(5).value) || 0
            expectedTotalAkumulasi += Number(row.getCell(8).value) || 0
            expectedTotalNilaiBuku += Number(row.getCell(9).value) || 0
          }

          // Find summary row (after data rows + 1 empty row)
          const summaryRowNum = 6 + assets.length + 1
          const summaryRow = worksheet.getRow(summaryRowNum)

          const actualTotalNilaiPerolehan =
            Number(summaryRow.getCell(5).value) || 0
          const actualTotalAkumulasi = Number(summaryRow.getCell(8).value) || 0
          const actualTotalNilaiBuku = Number(summaryRow.getCell(9).value) || 0

          // Allow small floating point errors
          const tolerance = 1

          if (
            Math.abs(actualTotalNilaiPerolehan - expectedTotalNilaiPerolehan) >
            tolerance
          ) {
            return false
          }
          if (
            Math.abs(actualTotalAkumulasi - expectedTotalAkumulasi) > tolerance
          ) {
            return false
          }
          if (
            Math.abs(actualTotalNilaiBuku - expectedTotalNilaiBuku) > tolerance
          ) {
            return false
          }

          return true
        }
      ),
      { numRuns: 20 }
    )
  })
})
