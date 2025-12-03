import { PrismaClient } from '@simanis/database'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  CalculateDepreciationUseCase,
  GetAssetDepreciationHistoryUseCase,
  GetDepreciationListUseCase,
  GetDepreciationSummaryUseCase,
  GetDepreciationTrendUseCase,
  GetDepreciationUseCase,
} from '../../application/use-cases/depreciation'
import { DepreciationRepositoryImpl } from '../../infrastructure/database/repositories/depreciation.repository.impl'
import { sanitizePaginationParams } from '../../shared/utils/pagination.utils'
import { createSuccessResponse } from '../../shared/utils/response.utils'

const prisma = new PrismaClient()
const depreciationRepository = new DepreciationRepositoryImpl(prisma)

export class DepreciationController {
  /**
   * GET /api/depreciation
   */
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      page?: string
      pageSize?: string
      assetId?: string
      year?: string
    }

    const { page, pageSize } = sanitizePaginationParams(
      query.page ? Number.parseInt(query.page) : undefined,
      query.pageSize ? Number.parseInt(query.pageSize) : undefined
    )

    const filters = {
      assetId: query.assetId ? Number.parseInt(query.assetId) : undefined,
      year: query.year ? Number.parseInt(query.year) : undefined,
    }

    const getDepreciationUseCase = new GetDepreciationUseCase(prisma)
    const result = await getDepreciationUseCase.execute({
      page,
      pageSize,
      filters,
    })

    return reply
      .status(200)
      .send(createSuccessResponse(result.entries, result.meta))
  }

  /**
   * GET /api/depreciation/summary
   */
  static async getSummary(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      categoryId?: string
      year?: string
    }

    const useCase = new GetDepreciationSummaryUseCase(
      depreciationRepository,
      prisma
    )

    const result = await useCase.execute({
      categoryId: query.categoryId ? Number.parseInt(query.categoryId) : undefined,
      year: query.year ? Number.parseInt(query.year) : undefined,
    })

    return reply.status(200).send(createSuccessResponse(result))
  }

  /**
   * GET /api/depreciation/list
   */
  static async getList(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      categoryId?: string
      year?: string
      month?: string
      sortBy?: string
      sortOrder?: string
      page?: string
      pageSize?: string
    }

    const { page, pageSize } = sanitizePaginationParams(
      query.page ? Number.parseInt(query.page) : undefined,
      query.pageSize ? Number.parseInt(query.pageSize) : undefined
    )

    const useCase = new GetDepreciationListUseCase(prisma)

    const result = await useCase.execute({
      categoryId: query.categoryId ? Number.parseInt(query.categoryId) : undefined,
      year: query.year ? Number.parseInt(query.year) : undefined,
      month: query.month ? Number.parseInt(query.month) : undefined,
      sortBy: query.sortBy as 'kodeAset' | 'namaBarang' | 'nilaiBuku' | 'akumulasiPenyusutan',
      sortOrder: query.sortOrder as 'asc' | 'desc',
      page,
      pageSize,
    })

    return reply.status(200).send(createSuccessResponse(result.items, result.meta))
  }

  /**
   * GET /api/depreciation/trend
   */
  static async getTrend(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      categoryId?: string
      months?: string
    }

    const useCase = new GetDepreciationTrendUseCase(depreciationRepository)

    const result = await useCase.execute({
      categoryId: query.categoryId ? Number.parseInt(query.categoryId) : undefined,
      months: query.months ? Number.parseInt(query.months) : 12,
    })

    return reply.status(200).send(createSuccessResponse(result))
  }

  /**
   * GET /api/depreciation/asset/:id/history
   */
  static async getAssetHistory(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string }

    const useCase = new GetAssetDepreciationHistoryUseCase(
      depreciationRepository,
      prisma
    )

    const result = await useCase.execute({
      assetId: Number.parseInt(params.id),
    })

    return reply.status(200).send(createSuccessResponse(result))
  }

  /**
   * POST /api/depreciation/calculate
   */
  static async calculate(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as {
      month: number
      year: number
    }

    const useCase = new CalculateDepreciationUseCase(
      depreciationRepository,
      prisma
    )

    const result = await useCase.execute({
      month: body.month,
      year: body.year,
    })

    return reply.status(200).send(createSuccessResponse(result))
  }
}
