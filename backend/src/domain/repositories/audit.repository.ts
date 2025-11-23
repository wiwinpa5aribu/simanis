export interface AuditRepository {
  log(data: { entityType: string; entityId: number; userId?: number | null; action: string; fieldChanged: Record<string, unknown> }): Promise<void>;
}