import { IDepreciationRepository } from '../../../domain/repositories/depreciation.repository'
import { PrismaClient } from '@simanis/database'
import { NotFoundError } from '../../../shared/errors/not-found-error'

export interface GetAssetDepreciationHistoryParams {
  assetId: number
}

export interface DepreciationHistoryItemDto {
  id: number
  tanggalHitung: Date
  nilaiPenyusutan: number
  nilaiBuku: number
  masaManfaatSnapshot: number
}

export interface AssetDepreciationHistoryDto {
  asset: {
    id: number
    kodeAset: string
    namaBarang: string
    nilaiPerolehan: number
    masaManfaatTahun: number
    categoryName: string
  }
  history: DepreciationHistoryItemDto[]
}

/**
 * Use case untuk mendapatkan riwayat penyusutan per aset
 * Validates: Requirements 2.2
 */
export class GetAssetDepreciationHistoryUseCase {
  constructor(
    private depreciationRepository: IDepreciationRepository,
    private prisma: PrismaClient
  ) {}

  async execute(
    params: GetAssetDepreciationHistoryParams
  ): Promise<AssetDepreciationHistoryDto> {
    const { assetId } = params

    // Get asset info
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        category: {
          select: { name: true },
        },
      },
    })

    if (!asset) {
      throw new NotFoundError(`Asset dengan ID ${assetId} tidak ditemukan`)
    }

    // Get depreciation history
    const entries = await this.depreciationRepository.findByAssetId(assetId)

    const history: DepreciationHistoryItemDto[] = entries.map((entry) => ({
      id: entry.id,
      tanggalHitung: entry.tanggalHitung,
      nilaiPenyusutan: Number(entry.nilaiPenyusutan),
      nilaiBuku: Number(entry.nilaiBuku),
      masaManfaatSnapshot: entry.masaManfaatTahunSnapshot,
    }))

    return {
      asset: {
        id: asset.id,
        kodeAset: asset.kodeAset,
        namaBarang: asset.namaBarang,
        nilaiPerolehan: Number(asset.harga),
        masaManfaatTahun: asset.masaManfaatTahun,
        categoryName: asset.category?.name || 'Tidak ada kategori',
      },
      history,
    }
  }
}
