import { PrismaClient } from '@simanis/database'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import { ValidationError } from '../../../shared/errors/validation-error'

export interface UpdateCategoryUsefulLifeParams {
  categoryId: number
  defaultMasaManfaat: number
}

export interface UpdateCategoryUsefulLifeResult {
  id: number
  name: string
  defaultMasaManfaat: number
}

/**
 * Use case untuk update default masa manfaat kategori
 * Validates: Requirements 4.1, 4.2
 */
export class UpdateCategoryUsefulLifeUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(
    params: UpdateCategoryUsefulLifeParams
  ): Promise<UpdateCategoryUsefulLifeResult> {
    const { categoryId, defaultMasaManfaat } = params

    // Validate masa manfaat (1-20 years)
    if (defaultMasaManfaat < 1 || defaultMasaManfaat > 20) {
      throw new ValidationError('Masa manfaat harus antara 1-20 tahun')
    }

    // Check if category exists
    const category = await this.prisma.assetCategory.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw new NotFoundError(
        `Kategori dengan ID ${categoryId} tidak ditemukan`
      )
    }

    // Update category
    const updated = await this.prisma.assetCategory.update({
      where: { id: categoryId },
      data: { defaultMasaManfaat },
    })

    return {
      id: updated.id,
      name: updated.name,
      defaultMasaManfaat: updated.defaultMasaManfaat,
    }
  }
}
