import { Loader2, AlertCircle } from 'lucide-react'

// Komponen Loading Spinner
export function LoadingSpinner({ text = 'Memuat data...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-500">{text}</span>
    </div>
  )
}

// Komponen Error Alert
export function ErrorAlert({ message = 'Terjadi kesalahan.' }: { message?: string }) {
  return (
    <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}
