import { Asset, AssetCategory, AssetMutation } from '@simanis/database'

export type AssetWithRelations = Asset & {
  category: AssetCategory | null
  mutations: AssetMutation[]
}

export interface AssetFilters {
  categoryId?: number
  kondisi?: string
  search?: string
  isDeleted?: boolean
}

export interface IAssetRepository {
  /**
   * Find all assets with pagination and filters
   */
  findAll(params: {
    page: number
    pageSize: number
    filters?: AssetFilters
  }): Promise<{ assets: AssetWithRelations[]; total: number }>

  /**
   * Find asset by ID
   */
  findById(id: number): Promise<AssetWithRelations | null>

  /**
   * Find asset by kode aset
   */
  findByKodeAset(kodeAset: string): Promise<Asset | null>

  /**
   * Find asset by QR code
   */
  findByQRCode(qrCode: string): Promise<Asset | null>

  /**
   * Create asset
   */
  create(data: {
    kodeAset: string
    namaBarang: string
    merk?: string
    spesifikasi?: string
    tahunPerolehan?: Date
    harga: number
    sumberDana: string
    kondisi: string
    fotoUrl?: string
    qrCode: string
    createdBy?: number
    categoryId?: number
    masaManfaatTahun?: number
    currentRoomId?: number
  }): Promise<Asset>

  /**
   * Update asset
   */
  update(
    id: number,
    data: {
      namaBarang?: string
      merk?: string
      spesifikasi?: string
      kondisi?: string
      fotoUrl?: string
      categoryId?: number
      currentRoomId?: number
    }
  ): Promise<Asset>

  /**
   * Soft delete asset
   */
  softDelete(id: number, deletedBy: number): Promise<void>

  /**
   * Count assets by filters
   */
  count(filters?: AssetFilters): Promise<number>

  /**
   * Find last asset by kode pattern (for auto-generate)
   */
  findLastByKodePattern(pattern: string): Promise<Asset | null>
}
