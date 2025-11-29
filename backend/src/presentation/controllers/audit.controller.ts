import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { GetAuditLogsUseCase } from '../../application/use-cases/audit/get-audit-logs.use-case';
import { AuditRepositoryImpl } from '../../infrastructure/database/repositories/audit.repository.impl';
import { createSuccessResponse } from '../../shared/utils/response.utils';
import { sanitizePaginationParams } from '../../shared/utils/pagination.utils';

const prisma = new PrismaClient();
const auditRepository = new AuditRepositoryImpl(prisma);

export class AuditController {
  /**
   * GET /api/audit
   */
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      page?: string;
      pageSize?: string;
      entityType?: string;
      entityId?: string;
      userId?: string;
      action?: string;
      startDate?: string;
      endDate?: string;
    };

    // Parse pagination
    const { page, pageSize } = sanitizePaginationParams(
      query.page ? parseInt(query.page) : undefined,
      query.pageSize ? parseInt(query.pageSize) : undefined,
    );

    // Parse filters
    const filters = {
      entityType: query.entityType,
      entityId: query.entityId ? parseInt(query.entityId) : undefined,
      userId: query.userId ? parseInt(query.userId) : undefined,
      action: query.action,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    };

    // Execute use case
    const getAuditLogsUseCase = new GetAuditLogsUseCase(auditRepository);
    const result = await getAuditLogsUseCase.execute({ page, pageSize, filters });

    return reply.status(200).send(createSuccessResponse(result.logs, result.meta));
  }
}
