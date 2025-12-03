import { PrismaClient } from '@simanis/database'
import ExcelJS from 'exceljs'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import { ValidationError } from '../../../shared/errors/validation-error'
import { DepreciationCalculatorService } from '../../../infrastructure/services/depreciation-calculator.service'

export interface GenerateDepreciationReportParams {
  year: number
  month: number
  categoryId?: number
  format: 'excel' | 'pdf'
}

/**
 * Use case untuk generate laporan penyusutan
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4
 */
export class GenerateDepreciationReportUseCase {
  private calculator: DepreciationCalculatorService

  constructor(private prisma: PrismaClient) {
    this.calculator = new DepreciationCalculatorService()
  }

  async execute(params: GenerateDepreciationReportParams): Promise<Buffer> {
    const { year, month, categoryId, format } = params

    // Validate parameters
    if (year < 2000 || year > 2100) {
      throw new ValidationError('Tahun harus antara 2000-2100')
    }

    if (month < 1 || month > 12) {
      throw new ValidationError('Bulan harus antara 1-12')
    }

    if (format !== 'excel') {
      throw new ValidationError('Saat ini hanya support format excel')
    }

    // Build filter query
    const where: any = {
      isDeleted: false,
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    // Get all assets with depreciation entries
    const assets = await this.prisma.asset.findMany({
      where,
      include: {
        category: true,
        depreciationEntries: {
          orderBy: { tanggalHitung: 'desc' },
        },
      },
      orderBy: {
        kodeAset: 'asc',
      },
    })

    if (assets.length === 0) {
      throw new NotFoundError('Tidak ada data aset untuk laporan ini')
    }

    // Calculate depreciation data for each asset
    const reportData = assets.map((asset) => {
      const nilaiPerolehan = Number(asset.harga)
      const masaManfaatTahun = asset.masaManfaatTahun || 4

      // Calculate accumulated depreciation
      const akumulasiPenyusutan = asset.depreciationEntries.reduce(
        (sum, entry) => sum + Number(entry.nilaiPenyusutan),
        0
      )

      // Calculate book value
      const nilaiBuku = this.calculator.calculateBookValue(
        nilaiPerolehan,
        akumulasiPenyusutan
      )

      // Calculate monthly depreciation
      const penyusutanPerBulan = this.calculator.calculateMonthlyDepreciation(
        nilaiPerolehan,
        masaManfaatTahun
      )

      return {
        kodeAset: asset.kodeAset,
        namaBarang: asset.namaBarang,
        kategori: asset.category?.name || '-',
        nilaiPerolehan,
        masaManfaatTahun,
        penyusutanPerBulan,
        akumulasiPenyusutan,
        nilaiBuku,
        isFullyDepreciated: this.calculator.isFullyDepreciated(nilaiBuku),
      }
    })

    // Generate Excel report
    return this.generateExcelReport(reportData, year, month, categoryId)
  }

  private async generateExcelReport(
    data: Array<{
      kodeAset: string
      namaBarang: string
      kategori: string
      nilaiPerolehan: number
      masaManfaatTahun: number
      penyusutanPerBulan: number
      akumulasiPenyusutan: number
      nilaiBuku: number
      isFullyDepreciated: boolean
    }>,
    year: number,
    month: number,
    categoryId?: number
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Laporan Penyusutan')

    // Get category name if filtered
    let categoryName = 'Semua Kategori'
    if (categoryId) {
      const category = await this.prisma.assetCategory.findUnique({
        where: { id: categoryId },
      })
      if (category) {
        categoryName = category.name
      }
    }

    // Add header section
    worksheet.mergeCells('A1:I1')
    worksheet.getCell('A1').value = 'LAPORAN PENYUSUTAN ASET'
    worksheet.getCell('A1').font = { bold: true, size: 16 }
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }

    worksheet.mergeCells('A2:I2')
    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]
    worksheet.getCell('A2').value = `Periode: ${monthNames[month - 1]} ${year}`
    worksheet.getCell('A2').alignment = { horizontal: 'center' }

    worksheet.mergeCells('A3:I3')
    worksheet.getCell('A3').value = `Kategori: ${categoryName}`
    worksheet.getCell('A3').alignment = { horizontal: 'center' }

    // Add empty row
    worksheet.addRow([])

    // Define columns (row 5)
    const headerRow = worksheet.addRow([
      'No',
      'Kode Aset',
      'Nama Barang',
      'Kategori',
      'Nilai Perolehan',
      'Masa Manfaat (Tahun)',
      'Penyusutan/Bulan',
      'Akumulasi Penyusutan',
      'Nilai Buku',
    ])

    // Style header
    headerRow.font = { bold: true }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' },
    }

    // Set column widths
    worksheet.columns = [
      { key: 'no', width: 5 },
      { key: 'kodeAset', width: 15 },
      { key: 'namaBarang', width: 30 },
      { key: 'kategori', width: 20 },
      { key: 'nilaiPerolehan', width: 18 },
      { key: 'masaManfaat', width: 20 },
      { key: 'penyusutanPerBulan', width: 18 },
      { key: 'akumulasiPenyusutan', width: 20 },
      { key: 'nilaiBuku', width: 18 },
    ]

    // Add data rows
    data.forEach((item, index) => {
      const row = worksheet.addRow([
        index + 1,
        item.kodeAset,
        item.namaBarang,
        item.kategori,
        item.nilaiPerolehan,
        item.masaManfaatTahun,
        item.penyusutanPerBulan,
        item.akumulasiPenyusutan,
        item.nilaiBuku,
      ])

      // Format currency columns
      row.getCell(5).numFmt = '#,##0'
      row.getCell(7).numFmt = '#,##0'
      row.getCell(8).numFmt = '#,##0'
      row.getCell(9).numFmt = '#,##0'

      // Highlight fully depreciated assets
      if (item.isFullyDepreciated) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFCCCC' },
        }
      }
    })

    // Add summary row
    const totalNilaiPerolehan = data.reduce((sum, item) => sum + item.nilaiPerolehan, 0)
    const totalAkumulasi = data.reduce((sum, item) => sum + item.akumulasiPenyusutan, 0)
    const totalNilaiBuku = data.reduce((sum, item) => sum + item.nilaiBuku, 0)

    worksheet.addRow([])
    const summaryRow = worksheet.addRow([
      '',
      '',
      '',
      'TOTAL',
      totalNilaiPerolehan,
      '',
      '',
      totalAkumulasi,
      totalNilaiBuku,
    ])

    summaryRow.font = { bold: true }
    summaryRow.getCell(5).numFmt = '#,##0'
    summaryRow.getCell(8).numFmt = '#,##0'
    summaryRow.getCell(9).numFmt = '#,##0'
    summaryRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFEB9C' },
    }

    // Add borders to all data cells
    const lastRow = worksheet.lastRow?.number || 0
    for (let i = 5; i <= lastRow; i++) {
      const row = worksheet.getRow(i)
      for (let j = 1; j <= 9; j++) {
        row.getCell(j).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
      }
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()
    return Buffer.from(buffer)
  }
}
