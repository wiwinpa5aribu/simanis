import { PrismaClient } from '@prisma/client';
import { IAuditRepository } from '../../../domain/repositories/audit.repository';
import { calculateSkip } from '../../../shared/utils/pagination.utils';

export class AuditRepositoryImpl implements IAuditRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    entityType: string;
    entityId: number;
    userId?: number;
    action: string;
    fieldChanged: Record<string, unknown>;
  }) {
    return this.prisma.auditLog.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        fieldChanged: data.fieldChanged as object,
        ...(data.userId && { user: { connect: { id: data.userId } } }),
      },
    });
  }

  async findAll(params: {
    page: number;
    pageSize: number;
    entityType?: string;
    entityId?: number;
    userId?: number;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { page, pageSize, entityType, entityId, userId, action, startDate, endDate } = params;
    const skip = calculateSkip(page, pageSize);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (startDate && endDate) {
      where.timestamp = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { timestamp: 'desc' },
        include: { user: true },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }
}
