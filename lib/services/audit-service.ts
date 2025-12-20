import { prisma } from "@/lib/db"
import { auditLogSchema, createAuditLogSchema, type TAuditLog, type CreateAuditLogInput } from "@/lib/validations/audit"

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

    /**
     * Creates a new audit log entry in the database.
     * @param {CreateAuditLogInput} data - The audit log data to create.
     * @returns {Promise<TAuditLog>} The created and validated audit log object.
     */
    create: async (data: CreateAuditLogInput): Promise<TAuditLog> => {
        const validated = createAuditLogSchema.parse(data)
        
        const auditLog = await prisma.auditLog.create({
            data: {
                timestamp: new Date().toISOString(),
                user: validated.user,
                action: validated.action,
                module: validated.module,
                details: validated.details,
            }
        })
        
        return auditLogSchema.parse(auditLog)
    },
}



