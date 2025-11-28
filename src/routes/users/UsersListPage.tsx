import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Users } from 'lucide-react'
import { getUsers, type User } from '../../libs/api/users'
import { LoadingSpinner, ErrorAlert } from '../../components/ui/Feedback'
import { Input } from '../../components/ui/input'
import { DataTable, type Column } from '../../components/table/DataTable'
import { FilterBar } from '../../components/filters/FilterBar'
import { UserDetailDrawer } from './components/UserDetailDrawer'
import { useDebouncedValue } from '../../libs/hooks/useDebouncedValue'

export function UsersListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useDebouncedValue(searchTerm, 300)

  // Fetch users with pagination and search
  const {
    data: usersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users', page, debouncedSearch],
    queryFn: () => getUsers({ page, pageSize: 10, search: debouncedSearch }),
  })

  const handleRowClick = (user: User) => {
    setSelectedUser(user)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedUser(null)
  }

  // Column definitions
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Nama',
      cell: (user) => (
        <button
          onClick={() => handleRowClick(user)}
          className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
        >
          {user.name}
        </button>
      ),
    },
    {
      key: 'username',
      header: 'Username',
      cell: (user) => <span className="text-gray-700">{user.username}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      cell: (user) => (
        <span className="text-gray-500">{user.email || '-'}</span>
      ),
    },
    {
      key: 'roles',
      header: 'Role',
      cell: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => (
            <span
              key={role}
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                role === 'Admin'
                  ? 'bg-purple-100 text-purple-800'
                  : role === 'Operator'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Tanggal Dibuat',
      cell: (user) =>
        new Date(user.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
    },
  ]

  if (isLoading) {
    return <LoadingSpinner text="Memuat data pengguna..." />
  }

  if (isError) {
    return (
      <ErrorAlert message="Gagal memuat data pengguna. Silakan coba lagi nanti." />
    )
  }

  const users = usersData?.data || []
  const meta = usersData?.meta || { total: 0, page: 1, pageSize: 10, totalPages: 1 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
            <p className="text-gray-500">Kelola pengguna dan hak akses sistem</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onReset={() => setSearchTerm('')} isLoading={isLoading}>
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Cari nama atau username..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1) // Reset to first page on search
            }}
          />
        </div>
      </FilterBar>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        pagination={{
          page: meta.page,
          pageSize: meta.pageSize,
          total: meta.total,
          totalPages: meta.totalPages,
        }}
        onPageChange={setPage}
        emptyMessage="Tidak ada pengguna yang ditemukan."
      />

      {/* User Detail Drawer */}
      <UserDetailDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  )
}
