import { AuditLog, User } from '@prisma/client';

export interface AuditLogFilters {
  page: number;
  pageSize: number;
  entityType?: string;
  entityId?: number;
  userId?: number;
  action?: string;
  startDate?: Date;
  endDate?: Date;
}

export type AuditLogWithUser = AuditLog & { user?: User | null };

export interface IAuditRepository {
  /**
   * Create audit log entry
   */
  create(data: {
    entityType: string;
    entityId: number;
    userId?: number;
    action: string;
    fieldChanged: Record<string, unknown>;
  }): Promise<AuditLog>;

  /**
   * Find audit logs with pagination and filters
   */
  findAll(params: AuditLogFilters): Promise<{ logs: AuditLogWithUser[]; total: number }>;
}
