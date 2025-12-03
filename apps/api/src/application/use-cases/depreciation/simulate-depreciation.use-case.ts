import { PrismaClient } from '@simanis/database'
import { DepreciationCalculatorService } from '../../../infrastructure/services/depreciation-calculator.service'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import { ValidationError } from '../../../shared/errors/validation-error'

export interface SimulateDepreciationParams {
  assetId?: number
  categoryId?: number
  periodMonths: number
}

export interface SimulationProjection {
  month: number
  monthLabel: string // "2025-01"
  nilaiBuku: number
  penyusutan: number
  akumulasiPenyusutan: number
}

export interface SimulateDepreciationResult {
  asset?: {
    id: number
    kodeAset: string
    namaBarang: string
    nilaiPerolehan: number
    masaManfaatTahun: number
    currentBookValue: number
  }
  projections: SimulationProjection[]
  estimatedEndDate: string | null
  totalDepreciationInPeriod: number
}

/**
 * Use case untuk simulasi proyeksi penyusutan
 * Validates: Requirements 6.1, 6.2, 6.3
 */
export class SimulateDepreciationUseCase {
  private calculator: DepreciationCalculatorService

  constructor(private prisma: PrismaClient) {
    this.calculator = new DepreciationCalculatorService()
  }

  async execute(
    params: SimulateDepreciationParams
  ): Promise<SimulateDepreciationResult> {
    const { assetId, categoryId, periodMonths } = params

    // Validate period (1-60 months)
    if (periodMonths < 1 || periodMonths > 60) {
      throw new ValidationError('Periode simulasi harus antara 1-60 bulan')
    }

    // Must provide either assetId or categoryId
    if (!assetId && !categoryId) {
      throw new ValidationError('Harus memilih aset atau kategori')
    }

    // If assetId provided, simulate for single asset
    if (assetId) {
      return this.simulateForAsset(assetId, periodMonths)
    }

    // If categoryId provided, simulate for category average
    return this.simulateForCategory(categoryId!, periodMonths)
  }

  private async simulateForAsset(
    assetId: number,
    periodMonths: number
  ): Promise<SimulateDepreciationResult> {
    // Get asset with depreciation entries
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        depreciationEntries: {
          orderBy: { tanggalHitung: 'desc' },
        },
      },
    })

    if (!asset) {
      throw new NotFoundError(`Asset dengan ID ${assetId} tidak ditemukan`)
    }

    const nilaiPerolehan = Number(asset.harga)
    const masaManfaatTahun = asset.masaManfaatTahun || 4

    // Calculate current accumulated depreciation
    const currentAkumulasi = asset.depreciationEntries.reduce(
      (sum, entry) => sum + Number(entry.nilaiPenyusutan),
      0
    )

    // Calculate current book value
    const currentBookValue = this.calculator.calculateBookValue(
      nilaiPerolehan,
      currentAkumulasi
    )

    // Calculate monthly depreciation
    const monthlyDepreciation = this.calculator.calculateMonthlyDepreciation(
      nilaiPerolehan,
      masaManfaatTahun
    )

    // Generate projections
    const { projections, estimatedEndDate, totalDepreciationInPeriod } =
      this.generateProjections(
        currentBookValue,
        currentAkumulasi,
        monthlyDepreciation,
        periodMonths
      )

    return {
      asset: {
        id: asset.id,
        kodeAset: asset.kodeAset,
        namaBarang: asset.namaBarang,
        nilaiPerolehan,
        masaManfaatTahun,
        currentBookValue,
      },
      projections,
      estimatedEndDate,
      totalDepreciationInPeriod,
    }
  }

  private async simulateForCategory(
    categoryId: number,
    periodMonths: number
  ): Promise<SimulateDepreciationResult> {
    // Get category
    const category = await this.prisma.assetCategory.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw new NotFoundError(
        `Kategori dengan ID ${categoryId} tidak ditemukan`
      )
    }

    // Get average values from assets in this category
    const assets = await this.prisma.asset.findMany({
      where: {
        categoryId,
        isDeleted: false,
      },
      include: {
        depreciationEntries: true,
      },
    })

    if (assets.length === 0) {
      throw new NotFoundError('Tidak ada aset dalam kategori ini')
    }

    // Calculate averages
    const totalNilaiPerolehan = assets.reduce(
      (sum, a) => sum + Number(a.harga),
      0
    )
    const avgNilaiPerolehan = totalNilaiPerolehan / assets.length
    const avgMasaManfaat = category.defaultMasaManfaat

    // Calculate average current book value
    let totalCurrentBookValue = 0
    let totalAkumulasi = 0

    for (const asset of assets) {
      const akumulasi = asset.depreciationEntries.reduce(
        (sum, e) => sum + Number(e.nilaiPenyusutan),
        0
      )
      totalAkumulasi += akumulasi
      totalCurrentBookValue += this.calculator.calculateBookValue(
        Number(asset.harga),
        akumulasi
      )
    }

    const avgCurrentBookValue = totalCurrentBookValue / assets.length
    const avgAkumulasi = totalAkumulasi / assets.length

    // Calculate monthly depreciation for average
    const monthlyDepreciation = this.calculator.calculateMonthlyDepreciation(
      avgNilaiPerolehan,
      avgMasaManfaat
    )

    // Generate projections
    const { projections, estimatedEndDate, totalDepreciationInPeriod } =
      this.generateProjections(
        avgCurrentBookValue,
        avgAkumulasi,
        monthlyDepreciation,
        periodMonths
      )

    return {
      projections,
      estimatedEndDate,
      totalDepreciationInPeriod,
    }
  }

  private generateProjections(
    currentBookValue: number,
    currentAkumulasi: number,
    monthlyDepreciation: number,
    periodMonths: number
  ): {
    projections: SimulationProjection[]
    estimatedEndDate: string | null
    totalDepreciationInPeriod: number
  } {
    const projections: SimulationProjection[] = []
    let bookValue = currentBookValue
    let akumulasi = currentAkumulasi
    let estimatedEndDate: string | null = null
    let totalDepreciationInPeriod = 0

    const now = new Date()

    for (let month = 1; month <= periodMonths; month++) {
      // Calculate depreciation for this month
      const penyusutan = Math.min(monthlyDepreciation, bookValue)
      bookValue = Math.max(0, bookValue - penyusutan)
      akumulasi += penyusutan
      totalDepreciationInPeriod += penyusutan

      // Generate month label
      const projectionDate = new Date(
        now.getFullYear(),
        now.getMonth() + month,
        1
      )
      const monthLabel = projectionDate.toISOString().substring(0, 7)

      projections.push({
        month,
        monthLabel,
        nilaiBuku: bookValue,
        penyusutan,
        akumulasiPenyusutan: akumulasi,
      })

      // Check if fully depreciated
      if (bookValue <= 0 && !estimatedEndDate) {
        estimatedEndDate = monthLabel
      }
    }

    // If not fully depreciated in period, estimate end date
    if (!estimatedEndDate && bookValue > 0) {
      const remainingMonths = this.calculator.calculateRemainingLife(
        currentBookValue + currentAkumulasi, // nilaiPerolehan
        currentAkumulasi + totalDepreciationInPeriod,
        Math.ceil(
          (currentBookValue + currentAkumulasi) / (monthlyDepreciation * 12)
        )
      )

      if (remainingMonths > 0) {
        const endDate = new Date(
          now.getFullYear(),
          now.getMonth() + periodMonths + remainingMonths,
          1
        )
        estimatedEndDate = endDate.toISOString().substring(0, 7)
      }
    }

    return { projections, estimatedEndDate, totalDepreciationInPeriod }
  }
}
