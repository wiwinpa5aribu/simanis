import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../libs/store/authStore'

// Komponen pembungkus untuk melindungi route yang butuh login
// Jika user belum login (tidak ada token), redirect ke halaman login
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const checkTokenExpiry = useAuthStore((state) => state.checkTokenExpiry)

  // Check token expiry synchronously
  const isTokenValid = isAuthenticated ? checkTokenExpiry() : false

  if (!isAuthenticated || !isTokenValid) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
