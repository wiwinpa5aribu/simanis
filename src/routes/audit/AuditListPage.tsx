import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Eye, FileSearch } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FilterBar } from '@/components/filters/FilterBar'
import type { Column } from '@/components/table/DataTable'
import { DataTable } from '@/components/table/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  type AuditLog,
  type AuditLogQueryParams,
  getAuditLogs,
} from '@/libs/api/audit'
import { useFilterStore } from '@/libs/store/filterStore'
import { AuditDetailDrawer } from './components/AuditDetailDrawer'

export default function AuditListPage() {
  // Filter state persistence
  const routeKey = 'audit-list'
  const { setFilter, getFilter } = useFilterStore()
  const savedFilters = getFilter(routeKey) || {}

  // State untuk filter
  const [filters, setFilters] = useState<AuditLogQueryParams>({
    entity_type:
      (savedFilters.entity_type as AuditLogQueryParams['entity_type']) ||
      undefined,
    entity_id: (savedFilters.entity_id as number) || undefined,
    user_id: (savedFilters.user_id as number) || undefined,
    action: (savedFilters.action as AuditLogQueryParams['action']) || undefined,
    from_date: (savedFilters.from_date as string) || undefined,
    to_date: (savedFilters.to_date as string) || undefined,
    page: 1,
    pageSize: 20,
  })

  // State untuk drawer detail
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(
    null
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Update store saat filter berubah
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter(routeKey, {
        entity_type: filters.entity_type,
        entity_id: filters.entity_id,
        user_id: filters.user_id,
        action: filters.action,
        from_date: filters.from_date,
        to_date: filters.to_date,
      })
    }, 500) // Debounce save
    return () => clearTimeout(timeoutId)
  }, [filters, setFilter])

  // Query untuk fetch daftar audit logs
  const { data: auditData, isLoading } = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => getAuditLogs(filters),
  })

  const handleFilterChange = (
    key: keyof AuditLogQueryParams,
    value: unknown
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
      page: 1, // Reset ke halaman pertama saat filter berubah
    }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      entity_type: undefined,
      entity_id: undefined,
      user_id: undefined,
      action: undefined,
      from_date: undefined,
      to_date: undefined,
      page: 1,
      pageSize: 20,
    })
  }

  const handleViewDetail = (auditLog: AuditLog) => {
    setSelectedAuditLog(auditLog)
    setIsDrawerOpen(true)
  }

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'bg-green-100 text-green-800'
      case 'update':
        return 'bg-blue-100 text-blue-800'
      case 'delete':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Definisi kolom
  const columns: Column<AuditLog>[] = [
    {
      key: 'id',
      header: 'ID',
      cell: (item) => <span className="font-mono text-sm">#{item.id}</span>,
    },
    {
      key: 'entity_type',
      header: 'Entitas',
      cell: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.entity_type}</p>
          <p className="text-xs text-gray-500">ID: {item.entity_id}</p>
        </div>
      ),
    },
    {
      key: 'user_id',
      header: 'User',
      cell: (item) => item.user_name || `User #${item.user_id}` || '-',
    },
    {
      key: 'action',
      header: 'Aksi',
      cell: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(
            item.action
          )}`}
        >
          {item.action}
        </span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Waktu',
      cell: (item) =>
        formatDistanceToNow(new Date(item.timestamp), {
          addSuffix: true,
          locale: localeId,
        }),
    },
    {
      key: 'detail',
      header: 'Detail',
      className: 'text-right',
      cell: (item) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetail(item)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Lihat
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileSearch className="h-8 w-8 text-blue-600" />
          Audit Trail
        </h1>
        <p className="text-gray-500 mt-1">
          Riwayat perubahan dan aktivitas sistem
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar onReset={handleResetFilters} isLoading={isLoading}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {/* Filter Tipe Entitas */}
          <div className="space-y-2">
            <Label htmlFor="entity-type-filter">Tipe Entitas</Label>
            <select
              id="entity-type-filter"
              className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={filters.entity_type || ''}
              onChange={(e) =>
                handleFilterChange('entity_type', e.target.value)
              }
            >
              <option value="">Semua Entitas</option>
              <option value="asset">Aset</option>
              <option value="category">Kategori</option>
              <option value="loan">Peminjaman</option>
              <option value="inventory">Inventarisasi</option>
              <option value="mutation">Mutasi</option>
            </select>
          </div>

          {/* Filter ID Entitas */}
          <div className="space-y-2">
            <Label htmlFor="entity-id-filter">ID Entitas (Opsional)</Label>
            <Input
              id="entity-id-filter"
              type="number"
              placeholder="Contoh: 123"
              value={filters.entity_id || ''}
              onChange={(e) =>
                handleFilterChange(
                  'entity_id',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />
          </div>

          {/* Filter Aksi */}
          <div className="space-y-2">
            <Label htmlFor="action-filter">Aksi</Label>
            <select
              id="action-filter"
              className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={filters.action || ''}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <option value="">Semua Aksi</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>
          </div>

          {/* Filter Dari Tanggal */}
          <div className="space-y-2">
            <Label htmlFor="from-date-filter">Dari Tanggal</Label>
            <Input
              id="from-date-filter"
              type="date"
              value={filters.from_date || ''}
              onChange={(e) => handleFilterChange('from_date', e.target.value)}
            />
          </div>

          {/* Filter Sampai Tanggal */}
          <div className="space-y-2">
            <Label htmlFor="to-date-filter">Sampai Tanggal</Label>
            <Input
              id="to-date-filter"
              type="date"
              value={filters.to_date || ''}
              onChange={(e) => handleFilterChange('to_date', e.target.value)}
            />
          </div>
        </div>
      </FilterBar>

      {/* Table */}
      <DataTable
        columns={columns}
        data={auditData?.data || []}
        isLoading={isLoading}
        pagination={{
          page: auditData?.pagination.page || 1,
          pageSize: auditData?.pagination.pageSize || 20,
          total: auditData?.pagination.total || 0,
          totalPages: auditData?.pagination.totalPages || 1,
        }}
        onPageChange={handlePageChange}
        emptyMessage="Tidak ada audit log ditemukan."
      />

      {/* Audit Detail Drawer */}
      <AuditDetailDrawer
        auditLog={selectedAuditLog}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedAuditLog(null)
        }}
      />
    </div>
  )
}
