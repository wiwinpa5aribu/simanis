import { z } from "zod"

export const auditLogSchema = z.object({
    id: z.string(),
    timestamp: z.string(),
    user: z.string(),
    action: z.enum(["CREATE", "UPDATE", "DELETE", "READ"]),
    module: z.string(),
    details: z.string(),
})

export type TAuditLog = z.infer<typeof auditLogSchema>

// Input schema for creating new audit log
export const createAuditLogSchema = z.object({
    user: z.string().min(1, "User wajib diisi"),
    action: z.enum(["CREATE", "UPDATE", "DELETE"]),
    module: z.string().min(1, "Module wajib diisi"),
    details: z.string().min(1, "Details wajib diisi"),
})

export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>
