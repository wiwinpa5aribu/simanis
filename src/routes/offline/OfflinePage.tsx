/**
 * Offline Page - Halaman yang ditampilkan saat aplikasi dimuat dalam kondisi offline
 */

import { RefreshCw, WifiOff } from 'lucide-react'

export function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden text-center p-8">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <WifiOff className="w-10 h-10 text-yellow-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Anda Sedang Offline
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Tidak dapat terhubung ke internet. Periksa koneksi jaringan Anda dan
          coba lagi.
        </p>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-gray-900 mb-2">Langkah-langkah:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Periksa koneksi WiFi atau data seluler</li>
            <li>• Pastikan router/modem berfungsi dengan baik</li>
            <li>• Coba matikan dan nyalakan kembali WiFi</li>
            <li>• Hubungi administrator jaringan jika masalah berlanjut</li>
          </ul>
        </div>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Coba Lagi
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          SIMANIS - Sistem Manajemen Aset Sekolah
        </p>
      </div>
    </div>
  )
}
