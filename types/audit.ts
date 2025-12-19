export interface AuditLog {
    id: string
    timestamp: string
    user: string
    action: string
    module: string
    details: string
}
