import { X, User, Mail, Calendar, Shield } from 'lucide-react'
import type { User as UserType } from '../../../libs/api/users'

interface UserDetailDrawerProps {
  user: UserType | null
  isOpen: boolean
  onClose: () => void
}

export function UserDetailDrawer({
  user,
  isOpen,
  onClose,
}: UserDetailDrawerProps) {
  if (!isOpen || !user) return null

  const getRoleBadgeStyle = (role: string) => {
    const styles: Record<string, string> = {
      Admin: 'bg-purple-100 text-purple-800 border-purple-200',
      Operator: 'bg-blue-100 text-blue-800 border-blue-200',
      Viewer: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    return styles[role] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close drawer"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Detail Pengguna
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-73px)]">
          {/* User Avatar & Name */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {user.name}
            </h3>
            <p className="text-gray-500">@{user.username}</p>
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            {/* Username */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium text-gray-900">{user.username}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email || '-'}</p>
              </div>
            </div>

            {/* Roles */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-2">Role</p>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className={`px-3 py-1 text-sm font-medium rounded-full border ${getRoleBadgeStyle(role)}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Tanggal Dibuat</p>
                <p className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
