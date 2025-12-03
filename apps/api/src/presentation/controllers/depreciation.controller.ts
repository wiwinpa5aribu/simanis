import { PrismaClient } from '@simanis/database'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  CalculateDepreciationUseCase,
  GenerateDepreciationReportUseCase,
  GetAssetDepreciationHistoryUseCase,
  GetDepreciationListUseCase,
  GetDepreciationSummaryUseCase,
  GetDepreciationTrendUseCase,
  GetDepreciationUseCase,
  SimulateDepreciationUseCase,
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
      categoryId: query.categoryId
        ? Number.parseInt(query.categoryId)
        : undefined,
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
      categoryId: query.categoryId
        ? Number.parseInt(query.categoryId)
        : undefined,
      year: query.year ? Number.parseInt(query.year) : undefined,
      month: query.month ? Number.parseInt(query.month) : undefined,
      sortBy: query.sortBy as
        | 'kodeAset'
        | 'namaBarang'
        | 'nilaiBuku'
        | 'akumulasiPenyusutan',
      sortOrder: query.sortOrder as 'asc' | 'desc',
      page,
      pageSize,
    })

    return reply
      .status(200)
      .send(createSuccessResponse(result.items, result.meta))
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
      categoryId: query.categoryId
        ? Number.parseInt(query.categoryId)
        : undefined,
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

  /**
   * POST /api/depreciation/simulate
   */
  static async simulate(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as {
      assetId?: number
      categoryId?: number
      periodMonths: number
    }

    const useCase = new SimulateDepreciationUseCase(prisma)

    const result = await useCase.execute({
      assetId: body.assetId,
      categoryId: body.categoryId,
      periodMonths: body.periodMonths,
    })

    return reply.status(200).send(createSuccessResponse(result))
  }

  /**
   * GET /api/depreciation/report
   */
  static async generateReport(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      year: string
      month: string
      categoryId?: string
      format?: string
    }

    const useCase = new GenerateDepreciationReportUseCase(prisma)

    const buffer = await useCase.execute({
      year: Number.parseInt(query.year),
      month: Number.parseInt(query.month),
      categoryId: query.categoryId
        ? Number.parseInt(query.categoryId)
        : undefined,
      format: (query.format as 'excel' | 'pdf') || 'excel',
    })

    // Set appropriate headers for file download
    const filename = `Laporan_Penyusutan_${query.year}_${query.month}.xlsx`

    return reply
      .header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(buffer)
  }
}
