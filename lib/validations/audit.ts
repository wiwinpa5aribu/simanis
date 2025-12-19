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
