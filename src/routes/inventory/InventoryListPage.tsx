import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { QrCode, Search, Calendar } from 'lucide-react'

import {
  getInventoryList,
  type InventoryListParams,
  type InventoryRecord,
} from '@/libs/api/inventory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/table/DataTable'
import type { Column } from '@/components/table/DataTable'
import { FilterBar } from '@/components/filters/FilterBar'
import { useFilterStore } from '@/libs/store/filterStore'
import { logger } from '@/libs/utils/logger'

export default function InventoryListPage() {
  const navigate = useNavigate()

  // Filter state persistence
  const routeKey = 'inventory-list'
  const { setFilter, getFilter } = useFilterStore()
  const savedFilters = getFilter(routeKey) || {}

  // Lifecycle logging
  useEffect(() => {
    logger.lifecycle('InventoryListPage', 'mount', {
      savedFilters,
      hasFilters: Object.keys(savedFilters).length > 0,
    })
    return () => {
      logger.lifecycle('InventoryListPage', 'unmount')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [filters, setFilters] = useState<InventoryListParams>({
    page: 1,
    pageSize: 20,
    search: (savedFilters.search as string) || '',
    from: (savedFilters.from as string) || '',
    to: (savedFilters.to as string) || '',
  })

  // Update store saat filter berubah
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter(routeKey, {
        search: filters.search,
        from: filters.from,
        to: filters.to,
      })
    }, 500) // Debounce save
    return () => clearTimeout(timeoutId)
  }, [filters.search, filters.from, filters.to, setFilter])

  // Query untuk fetch daftar inventarisasi
  const { data, isLoading } = useQuery({
    queryKey: ['inventory', filters],
    queryFn: () => getInventoryList(filters),
  })

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
  }

  const handleDateFilter = (field: 'from' | 'to', value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const handleScanClick = () => {
    logger.info('InventoryListPage', 'User clicked scan inventarisasi button')
    navigate('/inventory/scan')
  }

  const handleReset = () => {
    setFilters({
      page: 1,
      pageSize: 20,
      search: '',
      from: '',
      to: '',
    })
  }

  // Definisi kolom
  const columns: Column<InventoryRecord>[] = [
    {
      key: 'created_at',
      header: 'Tanggal',
      cell: (item) =>
        format(new Date(item.created_at), 'dd MMM yyyy HH:mm', {
          locale: localeId,
        }),
    },
    {
      key: 'asset_code',
      header: 'Kode Aset',
      cell: (item) => <span className="font-medium">{item.asset_code}</span>,
    },
    {
      key: 'asset_name',
      header: 'Nama Aset',
      cell: (item) => item.asset_name,
    },
    {
      key: 'photo_url',
      header: 'Foto',
      cell: (item) =>
        item.photo_url ? (
          <a
            href={item.photo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Lihat Foto
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: 'note',
      header: 'Catatan',
      cell: (item) =>
        item.note || <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'created_by_name',
      header: 'Petugas',
      cell: (item) => item.created_by_name,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventarisasi</h1>
          <p className="text-gray-500">Riwayat inventarisasi aset sekolah</p>
        </div>

        <Button onClick={handleScanClick}>
          <QrCode className="mr-2 h-4 w-4" />
          Scan Inventarisasi
        </Button>
      </div>

      {/* Filters */}
      <FilterBar onReset={handleReset} isLoading={isLoading}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Cari Aset</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Kode atau nama aset..."
                className="pl-9"
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Tanggal Dari */}
          <div className="space-y-2">
            <Label htmlFor="from">Dari Tanggal</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="from"
                type="date"
                className="pl-9"
                value={filters.from || ''}
                onChange={(e) => handleDateFilter('from', e.target.value)}
              />
            </div>
          </div>

          {/* Tanggal Sampai */}
          <div className="space-y-2">
            <Label htmlFor="to">Sampai Tanggal</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="to"
                type="date"
                className="pl-9"
                value={filters.to || ''}
                onChange={(e) => handleDateFilter('to', e.target.value)}
              />
            </div>
          </div>
        </div>
      </FilterBar>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pagination={{
          page: data?.page || 1,
          pageSize: data?.pageSize || 20,
          total: data?.total || 0,
          totalPages: data ? Math.ceil(data.total / data.pageSize) : 1,
        }}
        onPageChange={handlePageChange}
        emptyMessage="Tidak ada data inventarisasi yang sesuai."
      />
    </div>
  )
}
