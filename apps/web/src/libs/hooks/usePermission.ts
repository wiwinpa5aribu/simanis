import type { Permission, Role } from '@/libs/auth/permissions'
import { ROLE_LABELS, ROLE_PERMISSIONS } from '@/libs/auth/permissions'
import { useAuthStore } from '@/libs/store/authStore'

/**
 * Map role label (from backend) to role key
 * e.g., "Wakasek Sarpras" -> "wakasek"
 */
const LABEL_TO_ROLE: Record<string, Role> = Object.entries(ROLE_LABELS).reduce(
  (acc, [key, label]) => {
    acc[label] = key as Role
    return acc
  },
  {} as Record<string, Role>
)

/**
 * Resolve role from user data
 * Handles both:
 * - user.role (string) - direct role key
 * - user.roles (array) - role labels from backend
 */
function resolveRole(user: { role?: string; roles?: string[] } | null): Role {
  if (!user) return 'guru'

  // Try direct role key first
  if (user.role && user.role in ROLE_PERMISSIONS) {
    return user.role as Role
  }

  // Try mapping from role label
  if (user.role && user.role in LABEL_TO_ROLE) {
    return LABEL_TO_ROLE[user.role]
  }

  // Try roles array (from backend JWT)
  if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
    const firstRole = user.roles[0]
    // Check if it's a role key
    if (firstRole in ROLE_PERMISSIONS) {
      return firstRole as Role
    }
    // Check if it's a role label
    if (firstRole in LABEL_TO_ROLE) {
      return LABEL_TO_ROLE[firstRole]
    }
  }

  return 'guru'
}

export function usePermission() {
  const user = useAuthStore((state) => state.user)
  const role = resolveRole(user as { role?: string; roles?: string[] } | null)

  const hasPermission = (permission: Permission) => {
    const permissions = ROLE_PERMISSIONS[role] || []
    return permissions.includes(permission)
  }

  return {
    role,
    hasPermission,
    can: hasPermission, // Alias for readability: can('manage_assets')
  }
}
