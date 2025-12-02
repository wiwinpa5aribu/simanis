import { AssetCategory } from '@simanis/database'

export interface IAssetCategoryRepository {
  /**
   * Find all categories
   */
  findAll(): Promise<AssetCategory[]>

  /**
   * Find category by ID
   */
  findById(id: number): Promise<AssetCategory | null>

  /**
   * Find category by name
   */
  findByName(name: string): Promise<AssetCategory | null>

  /**
   * Create category
   */
  create(data: { name: string; description?: string }): Promise<AssetCategory>

  /**
   * Update category
   */
  update(
    id: number,
    data: { name?: string; description?: string }
  ): Promise<AssetCategory>

  /**
   * Delete category
   */
  delete(id: number): Promise<void>
}
