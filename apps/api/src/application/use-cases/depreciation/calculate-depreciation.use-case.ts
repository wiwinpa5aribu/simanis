import { PrismaClient } from '@simanis/database'
import { IDepreciationRepository } from '../../../domain/repositories/depreciation.repository'
import { DepreciationCalculatorService } from '../../../infrastructure/services/depreciation-calculator.service'
import { ConflictError } from '../../../shared/errors/conflict-error'

export interface CalculateDepreciationParams {
  month: number // 1-12
  year: number
}

export interface CalculateDepreciationResult {
  processedCount: number
  skippedCount: number
  totalDepreciation: number
  entries: Array<{
    assetId: number
    kodeAset: string
    nilaiPenyusutan: number
    nilaiBuku: number
  }>
}

/**
 * Use case untuk menghitung penyusutan bulanan untuk semua aset aktif
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 */
export class CalculateDepreciationUseCase {
  private calculator: DepreciationCalculatorService

  constructor(
    private depreciationRepository: IDepreciationRepository,
    private prisma: PrismaClient
  ) {
    this.calculator = new DepreciationCalculatorService()
  }

  async execute(
    params: CalculateDepreciationParams
  ): Promise<CalculateDepreciationResult> {
    const { month, year } = params

    // Validate month and year
    if (month < 1 || month > 12) {
      throw new Error('Bulan harus antara 1-12')
    }

    const currentYear = new Date().getFullYear()
    if (year < 2020 || year > currentYear + 1) {
      throw new Error(`Tahun harus antara 2020-${currentYear + 1}`)
    }

    // Create calculation date (first day of month)
    const tanggalHitung = new Date(year, month - 1, 1)

    // Get all active assets with their depreciation entries
    const assets = await this.prisma.asset.findMany({
      where: {
        isDeleted: false,
        harga: { gt: 0 },
        masaManfaatTahun: { gt: 0 },
      },
      include: {
        depreciationEntries: {
          orderBy: { tanggalHitung: 'desc' },
        },
      },
    })

    let processedCount = 0
    let skippedCount = 0
    let totalDepreciation = 0
    const entries: CalculateDepreciationResult['entries'] = []

    for (const asset of assets) {
      // Check if already calculated for this date
      const alreadyExists =
        await this.depreciationRepository.existsForAssetAndDate(
          asset.id,
          tanggalHitung
        )

      if (alreadyExists) {
        skippedCount++
        continue
      }

      const nilaiPerolehan = Number(asset.harga)
      const masaManfaatTahun = asset.masaManfaatTahun

      // Calculate accumulated depreciation from existing entries
      const akumulasiPenyusutan = asset.depreciationEntries.reduce(
        (sum, entry) => sum + Number(entry.nilaiPenyusutan),
        0
      )

      // Calculate current book value
      const currentBookValue = this.calculator.calculateBookValue(
        nilaiPerolehan,
        akumulasiPenyusutan
      )

      // Skip if already fully depreciated (Property 9: Zero Book Value Skip)
      if (this.calculator.isFullyDepreciated(currentBookValue)) {
        skippedCount++
        continue
      }

      // Calculate monthly depreciation (Property 7: Depreciation Formula Correctness)
      const monthlyDepreciation = this.calculator.calculateMonthlyDepreciation(
        nilaiPerolehan,
        masaManfaatTahun
      )

      // Ensure we don't depreciate more than remaining book value
      const nilaiPenyusutan = Math.min(monthlyDepreciation, currentBookValue)
      const nilaiBuku = currentBookValue - nilaiPenyusutan

      // Create depreciation entry (Property 8: Depreciation Entry Creation)
      await this.depreciationRepository.create({
        assetId: asset.id,
        tanggalHitung,
        nilaiPenyusutan,
        nilaiBuku,
        masaManfaatTahunSnapshot: masaManfaatTahun,
      })

      processedCount++
      totalDepreciation += nilaiPenyusutan
      entries.push({
        assetId: asset.id,
        kodeAset: asset.kodeAset,
        nilaiPenyusutan,
        nilaiBuku,
      })
    }

    return {
      processedCount,
      skippedCount,
      totalDepreciation,
      entries,
    }
  }
}
