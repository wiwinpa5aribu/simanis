import type { Permission, Role } from '@/libs/auth/permissions'
import { ROLE_PERMISSIONS } from '@/libs/auth/permissions'
import { useAuthStore } from '@/libs/store/authStore'

export function usePermission() {
  const user = useAuthStore((state) => state.user)
  // Default to 'guru' if no role or invalid role found
  const role = (user?.role as Role) || 'guru'

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
