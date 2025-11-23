import { IAuditRepository } from '../../../domain/repositories/audit.repository';

export class GetActivitiesUseCase {
    constructor(private auditRepository: IAuditRepository) { }

    async execute(limit: number = 10) {
        const { logs } = await this.auditRepository.findAll({
            page: 1,
            pageSize: limit,
        });

        return logs.map((log: any) => ({
            id: log.id,
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            timestamp: log.timestamp,
            user: log.user
                ? {
                    id: log.user.id,
                    name: log.user.name,
                }
                : null,
            details: log.fieldChanged,
        }));
    }
}
