import QRCode from 'react-qr-code'

interface QRCodeCardProps {
  asset: {
    id: number
    kode_aset: string
    nama_barang: string
  }
}

/**
 * QRCodeCard - Komponen kartu QR Code untuk print
 * Menampilkan QR code, kode aset, dan nama aset
 * Dioptimalkan untuk layout print A4
 */
export function QRCodeCard({ asset }: QRCodeCardProps) {
  // QR code value berisi kode aset untuk scanning
  const qrValue = asset.kode_aset

  return (
    <div className="qr-card border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-white">
      {/* QR Code */}
      <div className="qr-code-container mb-3">
        <QRCode
          value={qrValue}
          size={120}
          level="M"
          className="qr-code"
        />
      </div>

      {/* Asset Code */}
      <p className="text-sm font-bold text-gray-900 text-center mb-1 truncate w-full">
        {asset.kode_aset}
      </p>

      {/* Asset Name */}
      <p className="text-xs text-gray-600 text-center truncate w-full">
        {asset.nama_barang}
      </p>
    </div>
  )
}
