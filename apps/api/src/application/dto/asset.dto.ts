import { Asset, AssetCategory } from '@simanis/database'

export interface AssetDto extends Asset {
  category: AssetCategory | null
}

export interface AssetListDto {
  assets: AssetDto[]
  total: number
}
