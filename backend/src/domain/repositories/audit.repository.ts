import { AuditLog } from '@prisma/client';

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
  findAll(params: {
    page: number;
    pageSize: number;
    entityType?: string;
    entityId?: number;
    userId?: number;
    action?: string;
  }): Promise<{ logs: AuditLog[]; total: number }>;
}