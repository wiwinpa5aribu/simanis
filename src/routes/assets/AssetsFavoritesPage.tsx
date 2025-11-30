import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Eye, Star, ArrowLeft } from 'lucide-react'
import { getAssets } from '../../libs/api/assets'
import type { Asset } from '../../libs/validation/assetSchemas'
import { ErrorAlert } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { DataTable } from '../../components/table/DataTable'
import type { Column, RowAction } from '../../components/table/DataTable'
import { FilterBar } from '../../components/filters/FilterBar'
import { useFavoriteStore } from '../../libs/store/favoriteStore'
import { showSuccessToast } from '../../libs/ui/toast'

// Komponen Halaman Aset Favorit
// Menampilkan daftar aset yang ditandai sebagai favorit
export function AssetsFavoritesPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  // Favorite store
  const { favoriteAssetIds, toggleFavorite } = useFavoriteStore()

  // Fetch data aset dari API
  const {
    data: assetsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['assets'],
    queryFn: () => getAssets(),
  })

  // Filter aset: hanya yang ada di favoriteAssetIds DAN sesuai search term
  const filteredAssets =
    assetsResponse?.data?.filter(
      (asset: Asset) =>
        favoriteAssetIds.includes(asset.id) &&
        (asset.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.kodeAset.toLowerCase().includes(searchTerm.toLowerCase()))
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
            toggleFavorite(item.id)
            showSuccessToast('Aset dihapus dari favorit')
          }}
        >
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/assets')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Aset Favorit</h1>
            <p className="text-gray-500">
              Daftar aset yang Anda tandai sebagai penting
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onReset={() => setSearchTerm('')} isLoading={isLoading}>
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Cari aset favorit..."
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
        emptyMessage={
          favoriteAssetIds.length === 0
            ? 'Belum ada aset yang ditandai sebagai favorit.'
            : 'Tidak ada aset favorit yang sesuai dengan pencarian.'
        }
      />
    </div>
  )
}
