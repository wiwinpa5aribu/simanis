/**
 * App Layout Component - Layout utama aplikasi
 * Berisi Sidebar navigasi dan Header dengan area konten utama
 */

import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../libs/store/authStore'
import { LogOut, Box, Layers, ClipboardList, Users } from 'lucide-react'
import { logger } from '../../libs/utils/logger'
import { useEffect } from 'react'
import { OfflineBanner } from './OfflineBanner'

/**
 * AppLayout - Komponen layout utama aplikasi
 * Menampilkan sidebar, header, dan area konten
 */
export function AppLayout() {
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  // Log saat component mount
  useEffect(() => {
    logger.lifecycle('AppLayout', 'mount', { userId: user?.id, userName: user?.name })
    
    return () => {
      logger.lifecycle('AppLayout', 'unmount')
    }
  }, [user])

  /**
   * Handle Logout - Menangani proses logout
   */
  const handleLogout = () => {
    try {
      logger.info('AppLayout', 'User melakukan logout', { userId: user?.id })
      
      logout()
      navigate('/login')
      
      logger.success('AppLayout', 'Logout berhasil')
    } catch (error) {
      logger.error('AppLayout', 'Gagal logout', error as Error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigasi */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Box className="w-8 h-8" />
            SIMANIS
          </h1>
          <p className="text-xs text-gray-500 mt-1">Sistem Manajemen Aset</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/assets" 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Box className="w-5 h-5" />
            <span>Aset</span>
          </Link>
          <Link 
            to="/categories" 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Layers className="w-5 h-5" />
            <span>Kategori</span>
          </Link>
          <Link 
            to="/loans" 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <ClipboardList className="w-5 h-5" />
            <span>Peminjaman</span>
          </Link>

          {/* Admin-only menu */}
          {user?.role === 'admin' && (
            <Link 
              to="/users" 
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Manajemen User</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role || 'Staff'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Offline Banner */}
        <OfflineBanner />
        
        {/* Header Mobile / Topbar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 md:justify-end">
          <div className="md:hidden font-bold text-blue-600">SIMANIS</div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </header>

        {/* Area Konten Halaman */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
