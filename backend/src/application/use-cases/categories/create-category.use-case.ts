import { IAssetCategoryRepository } from '../../../domain/repositories/category.repository';
import { CreateCategoryInput } from '../../validators/category.validators';
import { ConflictError } from '../../../shared/errors/conflict-error';
import { CategoryDto } from '../../dto/category.dto';
import { logger } from '../../../shared/logger/winston.logger';

export class CreateCategoryUseCase {
    constructor(private categoryRepository: IAssetCategoryRepository) { }

    async execute(data: CreateCategoryInput): Promise<CategoryDto> {
        // Check if category already exists
        const existing = await this.categoryRepository.findByName(data.name);
        if (existing) {
            throw new ConflictError('Kategori dengan nama ini sudah ada');
        }

        const category = await this.categoryRepository.create(data);

        logger.info('Category created', { categoryId: category.id, name: category.name });

        return category;
    }
}
