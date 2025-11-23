import { IAssetRepository } from '../../../domain/repositories/asset.repository';
import { AssetFilters } from '../../../domain/repositories/asset.repository';
import { AssetListDto } from '../../dto/asset.dto';
import { calculatePagination } from '../../../shared/utils/pagination.utils';

export class GetAssetsUseCase {
    constructor(private assetRepository: IAssetRepository) { }

    async execute(params: {
        page: number;
        pageSize: number;
        filters?: AssetFilters;
    }): Promise<AssetListDto & { meta: any }> {
        const { assets, total } = await this.assetRepository.findAll(params);

        const meta = calculatePagination(total, params.page, params.pageSize);

        return {
            assets,
            total,
            meta,
        };
    }
}
