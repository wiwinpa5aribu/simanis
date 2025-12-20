import { z } from "zod"
import { AuditLogSchema as GeneratedAuditLogSchema } from "./generated"

// Override generated schema to use flexible ID (not CUID)
export const auditLogSchema = GeneratedAuditLogSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  id: z.string(),
})

export type TAuditLog = z.infer<typeof auditLogSchema>

// Action enum for audit logs (not in Prisma schema, defined here)
export const auditActionSchema = z.enum(["CREATE", "UPDATE", "DELETE", "READ"])

// Input schema for creating new audit log (form validation)
export const createAuditLogSchema = z.object({
  user: z.string().min(1, "User wajib diisi"),
  action: z.enum(["CREATE", "UPDATE", "DELETE"]),
  module: z.string().min(1, "Module wajib diisi"),
  details: z.string().min(1, "Details wajib diisi"),
})

export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>
