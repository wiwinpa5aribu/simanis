import {
  IInventoryRepository,
  InventoryFilters,
} from '../../../domain/repositories/inventory.repository';
import { InventoryListDto } from '../../dto/inventory.dto';
import { calculatePagination, calculateSkip } from '../../../shared/utils/pagination.utils';

export class GetInventoryUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(params: {
    page?: number;
    pageSize?: number;
    filters?: InventoryFilters;
  }): Promise<InventoryListDto> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const skip = calculateSkip(page, pageSize);
    const filters = params.filters || {};

    const { checks, total } = await this.inventoryRepository.findAll(skip, pageSize, filters);

    const meta = calculatePagination(total, page, pageSize);

    // Map to DTO
    const checksDto = checks.map((check) => ({
      id: check.id,
      assetId: check.assetId,
      checkerId: check.checkerId,
      kondisi: check.kondisi,
      photoUrl: check.photoUrl,
      note: check.note,
      createdAt: check.createdAt,
      asset: check.asset
        ? {
            id: check.asset.id,
            kode: check.asset.kode,
            nama: check.asset.nama,
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
    }));

    return {
      checks: checksDto,
      meta,
    };
  }
}
