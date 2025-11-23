import { IAssetCategoryRepository } from '../../../domain/repositories/category.repository';
import { CategoryListDto } from '../../dto/category.dto';

export class GetCategoriesUseCase {
    constructor(private categoryRepository: IAssetCategoryRepository) { }

    async execute(): Promise<CategoryListDto> {
        const categories = await this.categoryRepository.findAll();
        return { categories };
    }
}
