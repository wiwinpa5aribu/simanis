import { prisma } from "@/lib/db"
import { auditLogSchema, type TAuditLog } from "@/lib/validations/audit"

/**
 * Service for managing system Audit Logs.
 */
export const auditService = {
    /**
     * Retrieves all audit logs from database and validates them.
     */
    getAll: async (): Promise<TAuditLog[]> => {
        const auditLogs = await prisma.auditLog.findMany()
        return auditLogs.map((log: any) => {
            const result = auditLogSchema.safeParse(log)
            if (!result.success) {
                console.error("Validation error for audit log:", log.id, result.error.format())
                throw new Error(`Data audit log tidak valid: ${log.id}`)
            }
            return result.data
        })
    },
}



