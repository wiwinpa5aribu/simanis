import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Eye,
  Star,
  MapPin,
  DollarSign,
  CircleCheck,
  CircleAlert,
  CircleX,
  CircleHelp,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { formatCurrency } from '../../libs/utils/format'
import { getAssets } from '../../libs/api/assets'
import { getCategories } from '../../libs/api/categories'
import type { Asset } from '../../libs/validation/assetSchemas'
import { ASSET_CONDITIONS } from '../../libs/validation/assetSchemas'
import { ErrorAlert } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { DataTable, type Column } from '../../components/table/DataTable'
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
    data: assetsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['assets'],
    queryFn: () => getAssets(),
  })

  // Fetch Categories for Filter
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [conditionFilter, setConditionFilter] = useState<string>('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const PAGE_SIZE_OPTIONS = [10, 25, 50] as const

  // Filter client-side (sementara, idealnya server-side)
  const filteredAssets = useMemo(() => {
    return (
      assetsResponse?.data?.filter((asset: Asset) => {
        const matchesSearch =
          asset.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.kodeAset.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory =
          categoryFilter === 'all' ||
          asset.categoryId?.toString() === categoryFilter

        const matchesCondition =
          conditionFilter === 'all' || asset.kondisi === conditionFilter

        return matchesSearch && matchesCategory && matchesCondition
      }) || []
    )
  }, [assetsResponse?.data, searchTerm, categoryFilter, conditionFilter])

  // Paginated data
  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAssets.slice(startIndex, startIndex + pageSize)
  }, [filteredAssets, currentPage, pageSize])

  const totalPages = Math.ceil(filteredAssets.length / pageSize)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, conditionFilter, pageSize])

  // Helper function untuk mendapatkan warna badge kondisi
  const getConditionBadge = (kondisi: string) => {
    const badgeStyles: Record<
      string,
      { bg: string; text: string; icon: React.ReactNode }
    > = {
      Baik: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CircleCheck className="w-3.5 h-3.5" />,
      },
      'Rusak Ringan': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <CircleAlert className="w-3.5 h-3.5" />,
      },
      'Rusak Berat': {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        icon: <CircleX className="w-3.5 h-3.5" />,
      },
      Hilang: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <CircleHelp className="w-3.5 h-3.5" />,
      },
    }
    const style = badgeStyles[kondisi] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: null,
    }
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
      >
        {style.icon}
        {kondisi}
      </span>
    )
  }

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
              assetName: item.namaBarang,
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
      key: 'kodeAset',
      header: 'Kode Aset',
      cell: (item) => <span className="font-medium">{item.kodeAset}</span>,
    },
    {
      key: 'namaBarang',
      header: 'Nama Barang',
      cell: (item) => item.namaBarang,
    },
    {
      key: 'category',
      header: 'Kategori',
      cell: (item) => item.category?.name ?? '-',
    },
    {
      key: 'location',
      header: 'Lokasi',
      cell: (item) => {
        // Use type assertion for relation field that may not be in base type
        const room = (item as Asset & { currentRoom?: { name: string } | null })
          .currentRoom
        if (room) {
          return (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{room.name}</span>
            </div>
          )
        }
        return <span className="text-gray-400">-</span>
      },
    },
    {
      key: 'kondisi',
      header: 'Kondisi',
      cell: (item) => getConditionBadge(item.kondisi),
    },
    {
      key: 'value',
      header: 'Nilai Aset',
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-medium">
            {formatCurrency(Number(item.harga))}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      cell: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            logger.info('AssetsListPage', 'User clicked asset detail', {
              assetId: item.id,
              assetName: item.namaBarang,
            })
            navigate(`/assets/${item.id}`)
          }}
        >
          <Eye className="w-4 h-4 mr-2" />
          Detail
        </Button>
      ),
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

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Condition Filter */}
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Kondisi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kondisi</SelectItem>
            {ASSET_CONDITIONS.map((cond) => (
              <SelectItem key={cond} value={cond}>
                {cond}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>

      {/* Page Size Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Tampilkan</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(val) => setPageSize(Number(val))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">item per halaman</span>
        </div>
        <div className="text-sm text-gray-500">
          Total: {filteredAssets.length} aset
        </div>
      </div>

      {/* Tabel Aset */}
      <DataTable
        columns={columns}
        data={paginatedAssets}
        isLoading={isLoading}
        pagination={{
          page: currentPage,
          pageSize: pageSize,
          total: filteredAssets.length,
          totalPages: totalPages,
        }}
        onPageChange={setCurrentPage}
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
