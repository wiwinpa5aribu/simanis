import { DepreciationEntry, PrismaClient } from '@simanis/database'
import {
  DepreciationSummary,
  DepreciationWithAsset,
  IDepreciationRepository,
} from '../../../domain/repositories/depreciation.repository'

export class DepreciationRepositoryImpl implements IDepreciationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    assetId: number
    tanggalHitung: Date
    nilaiPenyusutan: number
    nilaiBuku: number
    masaManfaatTahunSnapshot: number
  }): Promise<DepreciationEntry> {
    return this.prisma.depreciationEntry.create({
      data,
    })
  }

  async findByAssetId(assetId: number): Promise<DepreciationEntry[]> {
    return this.prisma.depreciationEntry.findMany({
      where: { assetId },
      orderBy: { tanggalHitung: 'desc' },
    })
  }

  async findByPeriod(params: {
    startDate: Date
    endDate: Date
    categoryId?: number
  }): Promise<DepreciationWithAsset[]> {
    const { startDate, endDate, categoryId } = params

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      tanggalHitung: {
        gte: startDate,
        lte: endDate,
      },
    }

    if (categoryId) {
      where.asset = {
        categoryId,
      }
    }

    return this.prisma.depreciationEntry.findMany({
      where,
      include: {
        asset: {
          select: {
            id: true,
            kodeAset: true,
            namaBarang: true,
            harga: true,
            masaManfaatTahun: true,
          },
        },
      },
      orderBy: { tanggalHitung: 'desc' },
    })
  }

  async getLatestByAssetId(
    assetId: number
  ): Promise<DepreciationEntry | null> {
    return this.prisma.depreciationEntry.findFirst({
      where: { assetId },
      orderBy: { tanggalHitung: 'desc' },
    })
  }

  async getSummary(params: {
    categoryId?: number
    year?: number
  }): Promise<DepreciationSummary> {
    const { categoryId, year } = params

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereAsset: any = {
      isDeleted: false,
    }

    if (categoryId) {
      whereAsset.categoryId = categoryId
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereDepreciation: any = {}

    if (year) {
      whereDepreciation.tanggalHitung = {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      }
    }

    // Get all active assets
    const assets = await this.prisma.asset.findMany({
      where: whereAsset,
      select: {
        id: true,
        harga: true,
      },
    })

    const totalNilaiPerolehan = assets.reduce(
      (sum, asset) => sum + Number(asset.harga),
      0
    )

    // Get latest depreciation entry for each asset
    const latestDepreciations = await Promise.all(
      assets.map(async (asset) => {
        const latest = await this.prisma.depreciationEntry.findFirst({
          where: {
            assetId: asset.id,
            ...whereDepreciation,
          },
          orderBy: { tanggalHitung: 'desc' },
        })
        return { asset, entry: latest }
      })
    )

    const totalAkumulasiPenyusutan = latestDepreciations.reduce(
      (sum, item) => {
        if (!item.entry) return sum
        const akumulasi = Number(item.asset.harga) - Number(item.entry.nilaiBuku)
        return sum + akumulasi
      },
      0
    )

    const totalNilaiBuku = totalNilaiPerolehan - totalAkumulasiPenyusutan

    return {
      totalNilaiPerolehan,
      totalAkumulasiPenyusutan,
      totalNilaiBuku,
    }
  }

  async getMonthlyTrend(params: {
    categoryId?: number
  }): Promise<
    Array<{
      month: string
      totalPenyusutan: number
      totalNilaiBuku: number
    }>
  > {
    const { categoryId } = params

    // Get last 12 months
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      tanggalHitung: {
        gte: startDate,
      },
    }

    if (categoryId) {
      where.asset = {
        categoryId,
      }
    }

    const entries = await this.prisma.depreciationEntry.findMany({
      where,
      include: {
        asset: {
          select: {
            categoryId: true,
          },
        },
      },
      orderBy: { tanggalHitung: 'asc' },
    })

    // Group by month
    const monthlyData = new Map<
      string,
      { totalPenyusutan: number; totalNilaiBuku: number }
    >()

    for (const entry of entries) {
      const monthKey = entry.tanggalHitung.toISOString().substring(0, 7) // YYYY-MM
      const existing = monthlyData.get(monthKey) || {
        totalPenyusutan: 0,
        totalNilaiBuku: 0,
      }

      monthlyData.set(monthKey, {
        totalPenyusutan:
          existing.totalPenyusutan + Number(entry.nilaiPenyusutan),
        totalNilaiBuku: existing.totalNilaiBuku + Number(entry.nilaiBuku),
      })
    }

    // Convert to array
    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      ...data,
    }))
  }

  async existsForAssetAndDate(
    assetId: number,
    date: Date
  ): Promise<boolean> {
    const count = await this.prisma.depreciationEntry.count({
      where: {
        assetId,
        tanggalHitung: date,
      },
    })
    return count > 0
  }
}
