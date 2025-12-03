import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Activity,
  ArrowLeft,
  ImageIcon,
  MapPin,
  Pencil,
  Star,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { ErrorAlert, LoadingSpinner } from '../../components/ui/Feedback'
import { FileUpload } from '../../components/uploads/FileUpload'
import {
  deleteAsset,
  getAssetById,
  updateAssetPhoto,
} from '../../libs/api/assets'
import { useMediaQuery } from '../../libs/hooks/useMediaQuery'
import { usePermission } from '../../libs/hooks/usePermission'
import { useFavoriteStore } from '../../libs/store/favoriteStore'
import { showErrorToast, showSuccessToast } from '../../libs/ui/toast'
import {
  AssetActivityTimeline,
  AssetMutationHistory,
  DeleteAssetDialog,
  QRCodeDisplay,
} from './components'

export function AssetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { can, role } = usePermission()
  const queryClient = useQueryClient()

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Responsive breakpoint - true if mobile (< 1024px / lg breakpoint)
  const isMobile = useMediaQuery('(max-width: 1023px)')

  // Favorite store
  const { isFavorite, toggleFavorite } = useFavoriteStore()
  const isAssetFavorite = id ? isFavorite(Number(id)) : false

  // Fetch Detail Aset
  const {
    data: asset,
    isLoading: isLoadingAsset,
    isError,
  } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => getAssetById(id!),
    enabled: !!id,
  })

  // Mutation untuk upload foto
  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => updateAssetPhoto(Number(id), file),
    onSuccess: () => {
      showSuccessToast('Foto aset berhasil diupload')
      // Invalidate query untuk refresh data aset
      queryClient.invalidateQueries({ queryKey: ['asset', id] })
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'Gagal mengupload foto')
    },
  })

  // Handle delete with Berita Acara
  const handleDeleteConfirm = async (_beritaAcaraFile: File) => {
    try {
      // TODO: Upload berita acara file to server along with delete request
      // For now, just delete the asset
      await deleteAsset(Number(id))
      showSuccessToast('Aset berhasil dihapus')
      navigate('/assets')
    } catch (error) {
      console.error('Gagal menghapus aset:', error)
      showErrorToast('Gagal menghapus aset')
      throw error
    }
  }

  const handleToggleFavorite = () => {
    if (id) {
      toggleFavorite(Number(id))
      if (!isAssetFavorite) {
        showSuccessToast('Aset ditambahkan ke favorit')
      }
    }
  }

  const handlePhotoUpload = async (file: File) => {
    await uploadPhotoMutation.mutateAsync(file)
  }

  if (isLoadingAsset) {
    return <LoadingSpinner text="Memuat detail aset..." />
  }

  if (isError || !asset) {
    return (
      <ErrorAlert message="Gagal memuat data aset. Aset mungkin tidak ditemukan." />
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6 px-4 lg:px-0">
      {/* Header & Navigasi - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 lg:gap-4">
          <Link
            to="/assets"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="truncate">{asset.namaBarang}</span>
              <button
                onClick={handleToggleFavorite}
                className="focus:outline-none shrink-0"
                title={
                  isAssetFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'
                }
              >
                <Star
                  className={`w-5 h-5 lg:w-6 lg:h-6 ${
                    isAssetFavorite
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                />
              </button>
            </h1>
            <p className="text-sm lg:text-base text-gray-500 font-mono">
              {asset.kodeAset}
            </p>
          </div>
        </div>

        {/* Action Buttons - Stack on mobile */}
        <div className="flex items-center gap-2 ml-11 sm:ml-0">
          {can('manage_assets') && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/assets/${id}/edit`)}
                className="text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200 flex-1 sm:flex-none"
              >
                <Pencil className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Edit</span>
                <span className="sm:hidden">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600 bg-red-50 hover:bg-red-100 border-red-200 flex-1 sm:flex-none"
              >
                <Trash2 className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Hapus</span>
                <span className="sm:hidden">Hapus</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile: QR Code Section (compact mode) */}
      {isMobile && (
        <QRCodeDisplay
          kodeAset={asset.kodeAset}
          namaBarang={asset.namaBarang}
          kategori={asset.category?.name}
          compact={true}
        />
      )}

      {/* Main Content Grid - 1 col mobile, 3 col desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Kolom Kiri: Informasi Utama (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Card Foto Aset */}
          <div className="bg-white shadow rounded-xl overflow-hidden p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <ImageIcon className="w-5 h-5 text-green-600" />
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                Foto Aset
              </h3>
            </div>

            {/* Tampilkan foto saat ini jika ada */}
            {asset.fotoUrl && (
              <div className="mb-4">
                <img
                  src={asset.fotoUrl}
                  alt={asset.namaBarang}
                  className="w-full h-auto rounded-lg border max-h-64 lg:max-h-96 object-contain bg-gray-50"
                />
              </div>
            )}

            {/* Upload foto - hanya untuk user dengan permission */}
            {can('manage_assets') ? (
              <FileUpload
                accept="image/*"
                maxSizeMB={5}
                onUpload={handlePhotoUpload}
                label="Upload Foto Aset"
                disabled={uploadPhotoMutation.isPending}
                currentFile={asset.fotoUrl ?? undefined}
              />
            ) : (
              !asset.fotoUrl && (
                <div className="text-center py-6 lg:py-8 text-gray-500">
                  <p className="text-sm">Belum ada foto untuk aset ini</p>
                </div>
              )
            )}
          </div>

          {/* Card Informasi Aset */}
          <div className="bg-white shadow rounded-xl overflow-hidden p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Informasi Aset
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 lg:gap-y-6">
              <div>
                <dt className="text-xs lg:text-sm font-medium text-gray-500">
                  Kategori
                </dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">
                  {asset.category?.name ?? '-'}
                </dd>
              </div>
              <div>
                <dt className="text-xs lg:text-sm font-medium text-gray-500">
                  Kondisi
                </dt>
                <dd className="mt-1">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      asset.kondisi === 'Baik'
                        ? 'bg-green-100 text-green-800'
                        : asset.kondisi === 'Hilang'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {asset.kondisi}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs lg:text-sm font-medium text-gray-500">
                  Merk / Brand
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {asset.merk || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-xs lg:text-sm font-medium text-gray-500">
                  Tahun Perolehan
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {asset.tahunPerolehan
                    ? asset.tahunPerolehan instanceof Date
                      ? asset.tahunPerolehan.toLocaleDateString('id-ID')
                      : String(asset.tahunPerolehan)
                    : '-'}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs lg:text-sm font-medium text-gray-500">
                  Spesifikasi
                </dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {asset.spesifikasi || '-'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Mobile: Lokasi Card (moved here for mobile) */}
          {isMobile && (
            <div className="bg-white shadow rounded-xl overflow-hidden p-4">
              <div className="flex items-center gap-2 mb-3 border-b pb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-900">
                  Lokasi Saat Ini
                </h3>
              </div>
              <p className="text-base font-medium text-gray-900">
                {(asset as { currentRoom?: { name: string } }).currentRoom
                  ?.name || 'Gudang Utama (Default)'}
              </p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: QR Code & Lokasi (Desktop only) */}
        {!isMobile && (
          <div className="space-y-6">
            {/* QR Code Display - Full size on desktop */}
            <QRCodeDisplay
              kodeAset={asset.kodeAset}
              namaBarang={asset.namaBarang}
              kategori={asset.category?.name}
            />

            {/* Card Lokasi Saat Ini */}
            <div className="bg-white shadow rounded-xl overflow-hidden p-6">
              <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Lokasi Saat Ini
                </h3>
              </div>

              <div className="text-center py-4">
                <p className="text-lg font-medium text-gray-900">
                  {(asset as { currentRoom?: { name: string } }).currentRoom
                    ?.name || 'Gudang Utama (Default)'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Lokasi penempatan aset saat ini
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Riwayat Mutasi Lokasi */}
      <div className="bg-white shadow rounded-xl overflow-hidden p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          <MapPin className="w-5 h-5 text-purple-600" />
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">
            Riwayat Mutasi Lokasi
          </h3>
        </div>
        <AssetMutationHistory assetId={Number(id)} />
      </div>

      {/* Riwayat Aktivitas Lengkap */}
      <div className="bg-white shadow rounded-xl overflow-hidden p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          <Activity className="w-5 h-5 text-gray-600" />
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">
            Riwayat Aktivitas Lengkap
          </h3>
        </div>
        <AssetActivityTimeline assetId={Number(id)} />
      </div>

      {/* Delete Asset Dialog */}
      <DeleteAssetDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        assetName={asset.namaBarang}
        assetCode={asset.kodeAset}
        userRole={role}
      />
    </div>
  )
}
