import { Asset, AssetCategory } from '@prisma/client'

export interface AssetDto extends Asset {
  category: AssetCategory | null
}

export interface AssetListDto {
  assets: AssetDto[]
  total: number
}
