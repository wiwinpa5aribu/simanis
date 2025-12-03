import { IDepreciationRepository } from '../../../domain/repositories/depreciation.repository'
import { DepreciationCalculatorService } from '../../../infrastructure/services/depreciation-calculator.service'
import { PrismaClient } from '@simanis/database'

export interface GetDepreciationSummaryParams {
  categoryId?: number
  year?: number
}

export interface DepreciationSummaryDto {
  totalNilaiPerolehan: number
  totalAkumulasiPenyusutan: number
  totalNilaiBuku: number
  totalAssets: number
  fullyDepreciatedCount: number
}

/**
 * Use case untuk mendapatkan ringkasan penyusutan
 * Validates: Requirements 1.1, 1.3, 1.4
 */
export class GetDepreciationSummaryUseCase {
  private calculator: DepreciationCalculatorService

  constructor(
    private depreciationRepository: IDepreciationRepository,
    private prisma: PrismaClient
  ) {
    this.calculator = new DepreciationCalculatorService()
  }

  async execute(params: GetDepreciationSummaryParams): Promise<DepreciationSummaryDto> {
    const { categoryId, year } = params

    // Build where clause for assets
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereAsset: any = {
      isDeleted: false,
    }

    if (categoryId) {
      whereAsset.categoryId = categoryId
    }

    // Get all active assets with their depreciation entries
    const assets = await this.prisma.asset.findMany({
      where: whereAsset,
      include: {
        depreciationEntries: {
          orderBy: { tanggalHitung: 'desc' },
          ...(year && {
            where: {
              tanggalHitung: {
                gte: new Date(`${year}-01-01`),
                lte: new Date(`${year}-12-31`),
              },
            },
          }),
        },
      },
    })

    let totalNilaiPerolehan = 0
    let totalAkumulasiPenyusutan = 0
    let fullyDepreciatedCount = 0

    for (const asset of assets) {
      const nilaiPerolehan = Number(asset.harga)
      totalNilaiPerolehan += nilaiPerolehan

      // Calculate accumulated depreciation from all entries
      const akumulasi = asset.depreciationEntries.reduce(
        (sum, entry) => sum + Number(entry.nilaiPenyusutan),
        0
      )
      totalAkumulasiPenyusutan += akumulasi

      // Check if fully depreciated
      const nilaiBuku = this.calculator.calculateBookValue(nilaiPerolehan, akumulasi)
      if (this.calculator.isFullyDepreciated(nilaiBuku)) {
        fullyDepreciatedCount++
      }
    }

    const totalNilaiBuku = Math.max(0, totalNilaiPerolehan - totalAkumulasiPenyusutan)

    return {
      totalNilaiPerolehan,
      totalAkumulasiPenyusutan,
      totalNilaiBuku,
      totalAssets: assets.length,
      fullyDepreciatedCount,
    }
  }
}
