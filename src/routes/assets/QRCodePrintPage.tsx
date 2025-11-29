import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Printer } from 'lucide-react'
import { getAssets } from '../../libs/api/assets'
import { LoadingSpinner, ErrorAlert } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/button'
import { QRCodeCard } from './components/QRCodeCard'
import './print-qr.css'

export function QRCodePrintPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const assetIds: number[] = location.state?.assetIds || []

  // Fetch all assets and filter by selected IDs
  const {
    data: allAssets,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  })

  const selectedAssets =
    allAssets?.filter((asset) => assetIds.includes(asset.id)) || []

  const handlePrint = () => {
    window.print()
  }

  if (assetIds.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/assets"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Print QR Code</h1>
          </div>
        </div>
        <ErrorAlert message="Tidak ada aset yang dipilih. Silakan pilih aset terlebih dahulu." />
        <Button onClick={() => navigate('/assets')}>
          Kembali ke Daftar Aset
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSpinner text="Memuat data aset..." />
  }

  if (isError) {
    return <ErrorAlert message="Gagal memuat data aset." />
  }

  return (
    <div className="qr-print-page">
      {/* Header - Hidden on print */}
      <div className="print:hidden mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/assets"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Print QR Code
              </h1>
              <p className="text-gray-500">
                {selectedAssets.length} aset dipilih
              </p>
            </div>
          </div>
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Cetak
          </Button>
        </div>
      </div>

      {/* QR Code Grid - Optimized for A4 print */}
      <div className="qr-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
        {selectedAssets.map((asset) => (
          <QRCodeCard
            key={asset.id}
            asset={{
              id: asset.id,
              kode_aset: asset.kode_aset,
              nama_barang: asset.nama_barang,
            }}
          />
        ))}
      </div>
    </div>
  )
}
