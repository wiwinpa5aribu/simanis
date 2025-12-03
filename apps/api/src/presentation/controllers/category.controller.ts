import { PrismaClient } from '@simanis/database'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateCategoryUseCase } from '../../application/use-cases/categories/create-category.use-case'
import { GetCategoriesUseCase } from '../../application/use-cases/categories/get-categories.use-case'
import { UpdateCategoryUsefulLifeUseCase } from '../../application/use-cases/depreciation/update-category-useful-life.use-case'
import { createCategorySchema } from '../../application/validators/category.validators'
import { AssetCategoryRepositoryImpl } from '../../infrastructure/database/repositories/category.repository.impl'
import { ValidationError } from '../../shared/errors/validation-error'
import { createSuccessResponse } from '../../shared/utils/response.utils'

const prisma = new PrismaClient()
const categoryRepository = new AssetCategoryRepositoryImpl(prisma)

export class CategoryController {
  /**
   * GET /api/categories
   */
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository)
    const result = await getCategoriesUseCase.execute()

    return reply.status(200).send(createSuccessResponse(result.categories))
  }

  /**
   * POST /api/categories
   */
  static async create(request: FastifyRequest, reply: FastifyReply) {
    // Validate input
    const result = createCategorySchema.safeParse(request.body)
    if (!result.success) {
      throw new ValidationError('Input tidak valid', result.error.errors)
    }

    // Execute use case
    const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository)
    const category = await createCategoryUseCase.execute(result.data)

    return reply.status(201).send(createSuccessResponse(category))
  }

  /**
   * PUT /api/categories/:id/useful-life
   */
  static async updateUsefulLife(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string }
    const body = request.body as { defaultMasaManfaat: number }

    const useCase = new UpdateCategoryUsefulLifeUseCase(prisma)

    const result = await useCase.execute({
      categoryId: Number.parseInt(params.id),
      defaultMasaManfaat: body.defaultMasaManfaat,
    })

    return reply.status(200).send(createSuccessResponse(result))
  }
}
