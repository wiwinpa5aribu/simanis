import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { getAssetById } from '../../libs/api/assets'
import { LoadingSpinner, ErrorAlert } from '../../components/ui/Feedback'
import { AssetEditForm } from './components/AssetEditForm'

export function AssetEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Fetch asset data
  const {
    data: asset,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => getAssetById(id!),
    enabled: !!id,
  })

  const handleCancel = () => {
    navigate(`/assets/${id}`)
  }

  const handleSuccess = () => {
    navigate(`/assets/${id}`)
  }

  if (isLoading) {
    return <LoadingSpinner text="Memuat data aset..." />
  }

  if (isError || !asset) {
    return (
      <ErrorAlert message="Gagal memuat data aset. Aset mungkin tidak ditemukan." />
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Navigasi Kembali */}
      <div className="flex items-center gap-4">
        <Link
          to={`/assets/${id}`}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Aset</h1>
          <p className="text-gray-500">
            {asset.kode_aset} - {asset.nama_barang}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <AssetEditForm
          asset={asset}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  )
}
