import { InventoryCheck, Prisma } from '@prisma/client'

export interface InventoryFilters {
  assetId?: number
  checkerId?: number
  startDate?: Date
  endDate?: Date
  condition?: string
}

export interface IInventoryRepository {
  create(data: Prisma.InventoryCheckCreateInput): Promise<InventoryCheck>
  findAll(
    skip: number,
    take: number,
    filters: InventoryFilters
  ): Promise<{ checks: InventoryCheck[]; total: number }>
  findById(id: number): Promise<InventoryCheck | null>
}
