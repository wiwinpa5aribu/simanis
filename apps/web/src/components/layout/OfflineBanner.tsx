import React, { useEffect } from 'react'
import { useNetwork } from '../../contexts/NetworkContext'
import { showSuccessToast } from '../../libs/ui'

interface OfflineBannerProps {
  className?: string
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  className = '',
}) => {
  const { isOnline, wasOffline } = useNetwork()

  useEffect(() => {
    if (wasOffline && isOnline) {
      showSuccessToast('Koneksi kembali tersedia')
    }
  }, [wasOffline, isOnline])

  if (isOnline) {
    return null
  }

  return (
    <div
      className={`bg-yellow-500 text-white py-2 px-4 flex items-center justify-center ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center space-x-2">
        <svg
          className="w-4 h-4 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-medium">Anda sedang offline</span>
        <span className="text-yellow-100 text-sm">
          Beberapa fitur mungkin tidak tersedia
        </span>
      </div>
    </div>
  )
}
