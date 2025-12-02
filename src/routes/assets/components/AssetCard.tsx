import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  CircleX,
  Eye,
  MapPin,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/libs/utils/format'
import type { Asset } from '@/libs/validation/assetSchemas'

interface AssetCardProps {
  asset: Asset & {
    currentRoom?: { name: string } | null
    category?: { name: string } | null
  }
  isFavorite: boolean
  onToggleFavorite: () => void
  onViewDetail: () => void
}

// Helper function untuk mendapatkan warna badge kondisi
const getConditionBadge = (kondisi: string) => {
  const badgeStyles: Record<
    string,
    { bg: string; text: string; icon: React.ReactNode }
  > = {
    Baik: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: <CircleCheck className="w-3 h-3" />,
    },
    'Rusak Ringan': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: <CircleAlert className="w-3 h-3" />,
    },
    'Rusak Berat': {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      icon: <CircleX className="w-3 h-3" />,
    },
    Hilang: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: <CircleHelp className="w-3 h-3" />,
    },
  }
  const style = badgeStyles[kondisi] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    icon: null,
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.icon}
      {kondisi}
    </span>
  )
}

/**
 * AssetCard - Komponen card untuk tampilan mobile
 * Menampilkan informasi aset dalam format card yang compact
 */
export function AssetCard({
  asset,
  isFavorite,
  onToggleFavorite,
  onViewDetail,
}: AssetCardProps) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: Kode Aset + Favorite */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs text-gray-500 font-mono">{asset.kodeAset}</p>
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {asset.namaBarang}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        >
          <Star
            className={`w-5 h-5 ${
              isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      </div>

      {/* Info: Kategori + Lokasi */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
          {asset.category?.name ?? 'Tanpa Kategori'}
        </span>
        {asset.currentRoom && (
          <span className="flex items-center gap-1 text-xs">
            <MapPin className="w-3 h-3" />
            {asset.currentRoom.name}
          </span>
        )}
      </div>

      {/* Footer: Kondisi + Nilai + Action */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-3">
          {getConditionBadge(asset.kondisi)}
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(Number(asset.harga))}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewDetail}
          className="h-8"
        >
          <Eye className="w-4 h-4 mr-1" />
          Detail
        </Button>
      </div>
    </div>
  )
}
