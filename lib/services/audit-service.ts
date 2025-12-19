import { auditLogs } from "@/lib/data"
import { auditLogSchema, type TAuditLog } from "@/lib/validations/audit"

export const auditService = {
    getAll: (): TAuditLog[] => {
        return auditLogs.map((log) => {
            const result = auditLogSchema.safeParse(log)
            if (!result.success) {
                console.error("Validation error for audit log:", log.id, result.error.format())
                throw new Error(`Data audit log tidak valid: ${log.id}`)
            }
            return result.data
        })
    },
}
