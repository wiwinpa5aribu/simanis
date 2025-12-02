import { AssetCategory } from '@simanis/database'

export type CategoryDto = AssetCategory

export interface CategoryListDto {
  categories: CategoryDto[]
}
