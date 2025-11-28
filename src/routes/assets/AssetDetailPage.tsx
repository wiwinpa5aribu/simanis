import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ImageIcon,
  MapPin,
  Activity,
  Star,
} from 'lucide-react'
import {
  getAssetById,
  deleteAsset,
  updateAssetPhoto,
} from '../../libs/api/assets'
import { LoadingSpinner, ErrorAlert } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/button'
import { showSuccessToast, showErrorToast } from '../../libs/ui/toast'
import { useFavoriteStore } from '../../libs/store/favoriteStore'
import { AssetActivityTimeline } from './components/AssetActivityTimeline'
import { usePermission } from '../../libs/hooks/usePermission'
import { FileUpload } from '../../components/uploads/FileUpload'

export function AssetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { can } = usePermission()
  const queryClient = useQueryClient()

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

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus aset ini?')) {
      try {
        await deleteAsset(Number(id))
        navigate('/assets')
      } catch (error) {
        console.error('Gagal menghapus aset:', error)
        alert('Gagal menghapus aset.')
      }
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Navigasi */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/assets"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {asset.nama_barang}
              <button
                onClick={handleToggleFavorite}
                className="focus:outline-none"
                title={
                  isAssetFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'
                }
              >
                <Star
                  className={`w-6 h-6 ${
                    isAssetFavorite
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                />
              </button>
            </h1>
            <p className="text-gray-500">{asset.kode_aset}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {can('manage_assets') && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/assets/${id}/edit`)}
                className="text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 bg-red-50 hover:bg-red-100 border-red-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom Kiri: Informasi Utama */}
        <div className="md:col-span-2 space-y-6">
          {/* Card Foto Aset */}
          <div className="bg-white shadow rounded-xl overflow-hidden p-6">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <ImageIcon className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Foto Aset</h3>
            </div>
            
            {/* Tampilkan foto saat ini jika ada */}
            {asset.photo_url && (
              <div className="mb-4">
                <img
                  src={asset.photo_url}
                  alt={asset.nama_barang}
                  className="w-full h-auto rounded-lg border"
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
                currentFile={asset.photo_url}
              />
            ) : (
              !asset.photo_url && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Belum ada foto untuk aset ini</p>
                </div>
              )
            )}
          </div>

          <div className="bg-white shadow rounded-xl overflow-hidden p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Informasi Aset
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Kategori</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">
                  {asset.category_name || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Kondisi</dt>
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
                <dt className="text-sm font-medium text-gray-500">
                  Merk / Brand
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {asset.merk || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Tahun Perolehan
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {asset.tahun_perolehan || '-'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Spesifikasi
                </dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {asset.spesifikasi || '-'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Kolom Kanan: Lokasi & Mutasi */}
        <div className="space-y-6">
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
                Gudang Utama (Default)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Fitur mutasi lokasi akan segera hadir
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat Aktivitas Lengkap */}
      <div className="bg-white shadow rounded-xl overflow-hidden p-6">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          <Activity className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Riwayat Aktivitas Lengkap
          </h3>
        </div>
        <AssetActivityTimeline assetId={Number(id)} />
      </div>
    </div>
  )
}
