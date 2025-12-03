import { PrismaClient } from '@simanis/database'
import { DepreciationCalculatorService } from '../../../infrastructure/services/depreciation-calculator.service'
import {
  calculatePagination,
  calculateSkip,
} from '../../../shared/utils/pagination.utils'

export interface GetDepreciationListParams {
  categoryId?: number
  year?: number
  month?: number
  sortBy?: 'kodeAset' | 'namaBarang' | 'nilaiBuku' | 'akumulasiPenyusutan'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface DepreciationListItemDto {
  assetId: number
  kodeAset: string
  namaBarang: string
  categoryName: string
  nilaiPerolehan: number
  masaManfaatTahun: number
  penyusutanPerBulan: number
  akumulasiPenyusutan: number
  nilaiBuku: number
  isFullyDepreciated: boolean
}

export interface DepreciationListDto {
  items: DepreciationListItemDto[]
  meta: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Use case untuk mendapatkan daftar penyusutan per aset
 * Validates: Requirements 2.1, 2.3
 */
export class GetDepreciationListUseCase {
  private calculator: DepreciationCalculatorService

  constructor(private prisma: PrismaClient) {
    this.calculator = new DepreciationCalculatorService()
  }

  async execute(
    params: GetDepreciationListParams
  ): Promise<DepreciationListDto> {
    const {
      categoryId,
      year,
      month,
      sortBy = 'kodeAset',
      sortOrder = 'asc',
      page = 1,
      pageSize = 10,
    } = params

    const skip = calculateSkip(page, pageSize)

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereAsset: any = {
      isDeleted: false,
    }

    if (categoryId) {
      whereAsset.categoryId = categoryId
    }

    // Build depreciation entry filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let depreciationWhere: any = {}
    if (year) {
      const startDate = month
        ? new Date(year, month - 1, 1)
        : new Date(year, 0, 1)
      const endDate = month
        ? new Date(year, month, 0) // Last day of month
        : new Date(year, 11, 31)

      depreciationWhere = {
        tanggalHitung: {
          gte: startDate,
          lte: endDate,
        },
      }
    }

    // Get total count first
    const totalItems = await this.prisma.asset.count({
      where: whereAsset,
    })

    // Get assets with depreciation entries
    const assets = await this.prisma.asset.findMany({
      where: whereAsset,
      include: {
        category: {
          select: { name: true },
        },
        depreciationEntries: {
          where:
            Object.keys(depreciationWhere).length > 0
              ? depreciationWhere
              : undefined,
          orderBy: { tanggalHitung: 'desc' },
        },
      },
    })

    // Transform to DTO
    let items: DepreciationListItemDto[] = assets.map((asset) => {
      const nilaiPerolehan = Number(asset.harga)
      const masaManfaatTahun = asset.masaManfaatTahun || 4 // Default 4 years

      // Calculate monthly depreciation
      const penyusutanPerBulan =
        masaManfaatTahun > 0
          ? this.calculator.calculateMonthlyDepreciation(
              nilaiPerolehan,
              masaManfaatTahun
            )
          : 0

      // Calculate accumulated depreciation from entries
      const akumulasiPenyusutan = asset.depreciationEntries.reduce(
        (sum, entry) => sum + Number(entry.nilaiPenyusutan),
        0
      )

      // Calculate book value
      const nilaiBuku = this.calculator.calculateBookValue(
        nilaiPerolehan,
        akumulasiPenyusutan
      )

      return {
        assetId: asset.id,
        kodeAset: asset.kodeAset,
        namaBarang: asset.namaBarang,
        categoryName: asset.category?.name || 'Tidak ada kategori',
        nilaiPerolehan,
        masaManfaatTahun,
        penyusutanPerBulan,
        akumulasiPenyusutan,
        nilaiBuku,
        isFullyDepreciated: this.calculator.isFullyDepreciated(nilaiBuku),
      }
    })

    // Sort items
    items = this.sortItems(items, sortBy, sortOrder)

    // Apply pagination
    const paginatedItems = items.slice(skip, skip + pageSize)

    const meta = calculatePagination(totalItems, page, pageSize)

    return {
      items: paginatedItems,
      meta,
    }
  }

  private sortItems(
    items: DepreciationListItemDto[],
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): DepreciationListItemDto[] {
    return items.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'kodeAset':
          comparison = a.kodeAset.localeCompare(b.kodeAset)
          break
        case 'namaBarang':
          comparison = a.namaBarang.localeCompare(b.namaBarang)
          break
        case 'nilaiBuku':
          comparison = a.nilaiBuku - b.nilaiBuku
          break
        case 'akumulasiPenyusutan':
          comparison = a.akumulasiPenyusutan - b.akumulasiPenyusutan
          break
        default:
          comparison = a.kodeAset.localeCompare(b.kodeAset)
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })
  }
}
