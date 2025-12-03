import {
  IInventoryRepository,
  InventoryFilters,
} from '../../../domain/repositories/inventory.repository'
import {
  calculatePagination,
  calculateSkip,
} from '../../../shared/utils/pagination.utils'
import { InventoryListDto } from '../../dto/inventory.dto'

export class GetInventoryUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(params: {
    page?: number
    pageSize?: number
    filters?: InventoryFilters
  }): Promise<InventoryListDto> {
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const skip = calculateSkip(page, pageSize)
    const filters = params.filters || {}

    const { checks, total } = await this.inventoryRepository.findAll(
      skip,
      pageSize,
      filters
    )

    const meta = calculatePagination(total, page, pageSize)

    // Map to DTO - use type assertion for included relations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checksDto = checks.map((check: any) => ({
      id: check.id,
      assetId: check.assetId,
      checkerId: check.checkedBy,
      kondisi: check.kondisi,
      photoUrl: check.photoUrl,
      note: check.note,
      createdAt: check.checkedAt,
      asset: check.asset
        ? {
            id: check.asset.id,
            kode: check.asset.kodeAset,
            nama: check.asset.namaBarang,
            category: check.asset.category,
          }
        : undefined,
      checker: check.checker
        ? {
            id: check.checker.id,
            name: check.checker.name,
            username: check.checker.username,
          }
        : undefined,
    }))

    return {
      checks: checksDto,
      meta,
    }
  }
}
