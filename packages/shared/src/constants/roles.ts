/**
 * User Roles Constants
 * Definisi role pengguna SIMANIS
 */

export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
} as const

export type UserRoleKey = keyof typeof USER_ROLES
export type UserRoleValue = (typeof USER_ROLES)[UserRoleKey]

/**
 * Role labels untuk display di UI
 */
export const ROLE_LABELS: Record<UserRoleValue, string> = {
  admin: 'Administrator',
  staff: 'Staff',
}

/**
 * Role permissions
 */
export const ROLE_PERMISSIONS: Record<UserRoleValue, string[]> = {
  admin: [
    'user:read',
    'user:create',
    'user:update',
    'user:delete',
    'asset:read',
    'asset:create',
    'asset:update',
    'asset:delete',
    'loan:read',
    'loan:create',
    'loan:update',
    'loan:delete',
    'inventory:read',
    'inventory:create',
    'report:read',
    'report:generate',
    'settings:read',
    'settings:update',
  ],
  staff: [
    'asset:read',
    'asset:create',
    'asset:update',
    'loan:read',
    'loan:create',
    'loan:update',
    'inventory:read',
    'inventory:create',
    'report:read',
  ],
}

/**
 * Check if role has permission
 */
export function hasPermission(
  role: UserRoleValue,
  permission: string
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
