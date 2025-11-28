import { IAuditRepository, AuditLogFilters, AuditLogWithUser } from '../../../domain/repositories/audit.repository';
import { calculatePagination } from '../../../shared/utils/pagination.utils';

export interface AuditLogListDto {
    logs: {
        id: number;
        entityType: string;
        entityId: number;
        action: string;
        timestamp: Date;
        details: Record<string, unknown>;
        user: {
            id: number;
            name: string;
            username: string;
        } | null;
    }[];
    meta: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export class GetAuditLogsUseCase {
    constructor(private auditRepository: IAuditRepository) { }

    async execute(params: {
        page?: number;
        pageSize?: number;
        filters?: Omit<AuditLogFilters, 'page' | 'pageSize'>;
    }): Promise<AuditLogListDto> {
        const page = params.page || 1;
        const pageSize = params.pageSize || 10;

        const { logs, total } = await this.auditRepository.findAll({
            page,
            pageSize,
            ...params.filters,
        });

        const meta = calculatePagination(total, page, pageSize);

        const logsDto = logs.map((log: AuditLogWithUser) => ({
            id: log.id,
            entityType: log.entityType,
            entityId: log.entityId,
            action: log.action,
            timestamp: log.timestamp,
            details: log.fieldChanged,
            user: log.user
                ? {
                    id: log.user.id,
                    name: log.user.name,
                    username: log.user.username,
                }
                : null,
        }));

        return {
            logs: logsDto,
            meta,
        };
    }
}
