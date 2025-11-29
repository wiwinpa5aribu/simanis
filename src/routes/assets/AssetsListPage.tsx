import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Eye, Star } from 'lucide-react'
import { getAssets } from '../../libs/api/assets'
import type { Asset } from '../../libs/validation/assetSchemas'
import { ErrorAlert } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { DataTable } from '../../components/table/DataTable'
import type { Column, RowAction } from '../../components/table/DataTable'
import { FilterBar } from '../../components/filters/FilterBar'
import { useFilterStore } from '../../libs/store/filterStore'
import { useFavoriteStore } from '../../libs/store/favoriteStore'
import { AssetBulkActions } from './components/AssetBulkActions'
import { showSuccessToast } from '../../libs/ui/toast'
import { usePermission } from '../../libs/hooks/usePermission'
import { useDebouncedValue } from '../../libs/hooks/useDebouncedValue'
import { logger } from '../../libs/utils/logger'

// Komponen Halaman Daftar Aset
// Menggunakan DataTable dan FilterBar reusable
export function AssetsListPage() {
  const navigate = useNavigate()
  const { can } = usePermission()

  // Filter state persistence
  const routeKey = 'assets-list'
  const { setFilter, getFilter } = useFilterStore()
  const savedFilters = getFilter(routeKey) || {}

  const [searchTerm, setSearchTerm] = useState(
    (savedFilters.search as string) || ''
  )
  const debouncedSearch = useDebouncedValue(searchTerm, 500)

  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Favorite store
  const { isFavorite, toggleFavorite } = useFavoriteStore()

  // Lifecycle logging
  useEffect(() => {
    logger.lifecycle('AssetsListPage', 'mount', {
      savedFilters,
      hasPermission: can('manage_assets'),
    })

    return () => {
      logger.lifecycle('AssetsListPage', 'unmount')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update store saat filter berubah
  useEffect(() => {
    setFilter(routeKey, { search: debouncedSearch })
  }, [debouncedSearch, setFilter])

  // Fetch data aset dari API
  const {
    data: assets,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  })

  // Filter client-side (sementara, idealnya server-side)
  const filteredAssets =
    assets?.filter(
      (asset) =>
        asset.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.kode_aset.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  // Definisi kolom tabel
  const columns: Column<Asset>[] = [
    {
      key: 'favorite',
      header: '',
      className: 'w-10',
      cell: (item) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
            logger.info('AssetsListPage', 'User toggled favorite', {
              assetId: item.id,
              assetName: item.nama_barang,
              isFavorite: isFavorite(item.id),
            })
            toggleFavorite(item.id)
            if (!isFavorite(item.id)) {
              showSuccessToast('Aset ditambahkan ke favorit')
            }
          }}
        >
          <Star
            className={`h-4 w-4 ${
              isFavorite(item.id)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </Button>
      ),
    },
    {
      key: 'kode_aset',
      header: 'Kode Aset',
      cell: (item) => <span className="font-medium">{item.kode_aset}</span>,
    },
    {
      key: 'nama_barang',
      header: 'Nama Barang',
      cell: (item) => item.nama_barang,
    },
    {
      key: 'category',
      header: 'Kategori',
      cell: (item) => item.category_name || '-',
    },
    {
      key: 'kondisi',
      header: 'Kondisi',
      cell: (item) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            item.kondisi === 'Baik'
              ? 'bg-green-100 text-green-800'
              : item.kondisi === 'Hilang'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {item.kondisi}
        </span>
      ),
    },
  ]

  // Definisi aksi baris
  const rowActions: RowAction<Asset>[] = [
    {
      label: 'Detail',
      icon: <Eye className="w-4 h-4" />,
      onClick: (item) => navigate(`/assets/${item.id}`),
    },
  ]

  if (isError) {
    return (
      <ErrorAlert message="Gagal memuat data aset. Silakan coba lagi nanti." />
    )
  }

  return (
    <div className="space-y-6 relative pb-20">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Aset</h1>
          <p className="text-gray-500">
            Kelola seluruh aset yang terdaftar di sistem
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/assets/favorites')}
          >
            <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
            Favorit
          </Button>
          {can('manage_assets') && (
            <Button
              onClick={() => {
                logger.info(
                  'AssetsListPage',
                  'User clicked create asset button'
                )
                navigate('/assets/new')
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Aset
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onReset={() => setSearchTerm('')} isLoading={isLoading}>
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Cari aset berdasarkan nama atau kode..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </FilterBar>

      {/* Tabel Aset */}
      <DataTable
        columns={columns}
        data={filteredAssets}
        isLoading={isLoading}
        rowActions={rowActions}
        pagination={{
          page: 1,
          pageSize: filteredAssets.length,
          total: filteredAssets.length,
          totalPages: 1,
        }}
        emptyMessage="Belum ada data aset yang sesuai dengan pencarian."
        selectable={can('manage_assets')}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {/* Bulk Actions Panel */}
      {can('manage_assets') && (
        <AssetBulkActions
          selectedIds={selectedIds}
          onClearSelection={() => setSelectedIds([])}
        />
      )}
    </div>
  )
}
