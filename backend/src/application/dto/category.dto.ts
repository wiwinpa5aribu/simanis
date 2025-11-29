import { AssetCategory } from '@prisma/client';

export type CategoryDto = AssetCategory;

export interface CategoryListDto {
  categories: CategoryDto[];
}
