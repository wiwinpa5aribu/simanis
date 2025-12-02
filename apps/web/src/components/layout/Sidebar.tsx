/**
 * Sidebar Component - Navigasi utama aplikasi SIMANIS
 * Menampilkan menu navigasi dengan ikon dan highlight aktif
 */

import {
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FolderTree,
  HandCoins,
  LayoutDashboard,
  Package,
  Settings,
  Star,
  TrendingDown,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../libs/store/authStore'
import { cn } from '../../libs/utils/cn'

interface NavItemProps {
  to: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function NavItem({ to, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200',
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  )
}

interface NavGroupProps {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function NavGroup({
  icon,
  label,
  children,
  defaultOpen = false,
}: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
      >
        {icon}
        <span className="font-medium flex-1 text-left">{label}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {isOpen && <div className="ml-4 mt-1 space-y-1">{children}</div>}
    </div>
  )
}

export function Sidebar() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'admin'

  const isActive = (path: string) => location.pathname === path
  const isActiveGroup = (paths: string[]) =>
    paths.some((path) => location.pathname.startsWith(path))

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SIMANIS</h1>
            <p className="text-xs text-gray-500">Manajemen Aset Sekolah</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <NavItem
          to="/dashboard"
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="Dashboard"
          isActive={isActive('/dashboard')}
        />

        {/* Aset Group */}
        <NavGroup
          icon={<Package className="w-5 h-5" />}
          label="Aset"
          defaultOpen={isActiveGroup(['/assets'])}
        >
          <NavItem
            to="/assets"
            icon={<Package className="w-4 h-4" />}
            label="Daftar Aset"
            isActive={isActive('/assets')}
          />
          <NavItem
            to="/assets/favorites"
            icon={<Star className="w-4 h-4" />}
            label="Favorit"
            isActive={isActive('/assets/favorites')}
          />
        </NavGroup>

        {/* Peminjaman */}
        <NavItem
          to="/loans"
          icon={<HandCoins className="w-5 h-5" />}
          label="Peminjaman"
          isActive={
            isActive('/loans') || location.pathname.startsWith('/loans/')
          }
        />

        {/* Inventarisasi */}
        <NavItem
          to="/inventory"
          icon={<ClipboardCheck className="w-5 h-5" />}
          label="Inventarisasi"
          isActive={
            isActive('/inventory') ||
            location.pathname.startsWith('/inventory/')
          }
        />

        {/* Penyusutan */}
        <NavItem
          to="/depreciation"
          icon={<TrendingDown className="w-5 h-5" />}
          label="Penyusutan"
          isActive={isActive('/depreciation')}
        />

        {/* Laporan */}
        <NavItem
          to="/reports/kib"
          icon={<FileText className="w-5 h-5" />}
          label="Laporan KIB"
          isActive={isActive('/reports/kib')}
        />

        {/* Master Data Group */}
        <NavGroup
          icon={<FolderTree className="w-5 h-5" />}
          label="Master Data"
          defaultOpen={isActiveGroup(['/categories', '/locations'])}
        >
          <NavItem
            to="/categories"
            icon={<FolderTree className="w-4 h-4" />}
            label="Kategori"
            isActive={isActive('/categories')}
          />
          <NavItem
            to="/locations"
            icon={<Building2 className="w-4 h-4" />}
            label="Lokasi"
            isActive={isActive('/locations')}
          />
        </NavGroup>

        {/* Admin Only */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin
              </p>
            </div>
            <NavItem
              to="/users"
              icon={<Users className="w-5 h-5" />}
              label="Manajemen User"
              isActive={isActive('/users')}
            />
            <NavItem
              to="/audit"
              icon={<Settings className="w-5 h-5" />}
              label="Audit Trail"
              isActive={isActive('/audit')}
            />
          </>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize">
              {user?.role || 'Staff'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
