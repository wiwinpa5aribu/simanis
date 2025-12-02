import { useEffect, useRef } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../libs/store/authStore'
import { showErrorToast } from '../../libs/ui/toast'

/**
 * AdminRoute - Protects routes that require admin role
 * Redirects non-admin users to dashboard with access denied message
 */
export function AdminRoute() {
  const user = useAuthStore((state) => state.user)
  const hasShownToast = useRef(false)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (!isAdmin && !hasShownToast.current) {
      showErrorToast('Akses ditolak. Halaman ini hanya untuk Administrator.')
      hasShownToast.current = true
    }
  }, [isAdmin])

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
