import { PrismaClient } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { GetActivitiesUseCase } from '../../application/use-cases/dashboard/get-activities.use-case'
import { GetStatsUseCase } from '../../application/use-cases/dashboard/get-stats.use-case'
import { AuditRepositoryImpl } from '../../infrastructure/database/repositories/audit.repository.impl'
import { createSuccessResponse } from '../../shared/utils/response.utils'

const prisma = new PrismaClient()
const auditRepository = new AuditRepositoryImpl(prisma)

export class DashboardController {
  /**
   * GET /api/dashboard/stats
   */
  static async getStats(request: FastifyRequest, reply: FastifyReply) {
    const getStatsUseCase = new GetStatsUseCase(prisma)
    const stats = await getStatsUseCase.execute()

    return reply.status(200).send(createSuccessResponse(stats))
  }

  /**
   * GET /api/dashboard/activities
   */
  static async getActivities(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as { limit?: string }
    const limit = query.limit ? parseInt(query.limit) : 10

    const getActivitiesUseCase = new GetActivitiesUseCase(auditRepository)
    const activities = await getActivitiesUseCase.execute(limit)

    return reply.status(200).send(createSuccessResponse(activities))
  }
}
