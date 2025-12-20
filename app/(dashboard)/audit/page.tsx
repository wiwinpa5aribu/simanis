import { auditService } from "@/lib/services/audit-service"
import { userService } from "@/lib/services/user-service"
import { AuditContent } from "./components/audit-content"

export default async function AuditPage() {
  const auditLogs = await auditService.getAll()
  const users = await userService.getAll()

  return <AuditContent initialLogs={auditLogs} users={users} />
}
