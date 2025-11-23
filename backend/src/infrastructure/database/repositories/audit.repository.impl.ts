import { PrismaClient } from '@prisma/client';
import { IAuditRepository } from '../../../domain/repositories/audit.repository';
import { calculateSkip } from '../../../shared/utils/pagination.utils';

export class AuditRepositoryImpl implements IAuditRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: {
        entityType: string;
        entityId: number;
        userId?: number;
        action: string;
        fieldChanged: Record<string, unknown>;
    }) {
        return this.prisma.auditLog.create({
            data,
        });
    }

    async findAll(params: {
        page: number;
        pageSize: number;
        entityType?: string;
        entityId?: number;
        userId?: number;
        action?: string;
    }) {
        const { page, pageSize, entityType, entityId, userId, action } = params;
        const skip = calculateSkip(page, pageSize);

        const where: any = {};

        if (entityType) where.entityType = entityType;
        if (entityId) where.entityId = entityId;
        if (userId) where.userId = userId;
        if (action) where.action = action;

        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { timestamp: 'desc' },
            }),
            this.prisma.auditLog.count({ where }),
        ]);

        return { logs, total };
    }
}
