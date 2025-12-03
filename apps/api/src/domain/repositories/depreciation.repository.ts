import { Decimal } from '@prisma/client/runtime/library'
import { DepreciationEntry } from '@simanis/database'

export interface DepreciationSummary {
  totalNilaiPerolehan: number
  totalAkumulasiPenyusutan: number
  totalNilaiBuku: number
}

export interface DepreciationWithAsset extends DepreciationEntry {
  asset: {
    id: number
    kodeAset: string
    namaBarang: string
    harga: Decimal
    masaManfaatTahun: number
  }
}

export interface IDepreciationRepository {
  /**
   * Create a new depreciation entry
   */
  create(data: {
    assetId: number
    tanggalHitung: Date
    nilaiPenyusutan: number
    nilaiBuku: number
    masaManfaatTahunSnapshot: number
  }): Promise<DepreciationEntry>

  /**
   * Find depreciation entries by asset ID
   */
  findByAssetId(assetId: number): Promise<DepreciationEntry[]>

  /**
   * Find depreciation entries by period (date range)
   */
  findByPeriod(params: {
    startDate: Date
    endDate: Date
    categoryId?: number
  }): Promise<DepreciationWithAsset[]>

  /**
   * Get latest depreciation entry for an asset
   */
  getLatestByAssetId(assetId: number): Promise<DepreciationEntry | null>

  /**
   * Get depreciation summary (aggregation)
   */
  getSummary(params: {
    categoryId?: number
    year?: number
  }): Promise<DepreciationSummary>

  /**
   * Get monthly trend for last 12 months
   */
  getMonthlyTrend(params: { categoryId?: number }): Promise<
    Array<{
      month: string
      totalPenyusutan: number
      totalNilaiBuku: number
    }>
  >

  /**
   * Check if depreciation entry exists for asset and date
   */
  existsForAssetAndDate(assetId: number, date: Date): Promise<boolean>
}
