import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../libs/store/authStore'

// Komponen pembungkus untuk melindungi route yang butuh login
// Jika user belum login (tidak ada token), redirect ke halaman login
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
