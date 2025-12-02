import { useQuery } from '@tanstack/react-query'
import { MapPin, ArrowRight, Clock, FileText, Package } from 'lucide-react'
import { LoadingSpinner, ErrorAlert } from '@/components/ui/Feedback'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { api } from '@/libs/api/client'

// Interface sesuai dengan Prisma schema (camelCase)
interface MutationResponse {
  id: number
  assetId: number
  fromRoomId: number | null
  toRoomId: number
  mutatedAt: string
  note: string | null
  fromRoom: { id: number; name: string } | null
  toRoom: { id: number; name: string }
}

interface AssetMutationHistoryProps {
  assetId: number
}

// Fetch mutations langsung dari API
// Note: API client sudah unwrap response { success, data } menjadi data langsung
const fetchAssetMutations = async (
  assetId: number
): Promise<MutationResponse[]> => {
  const response = await api.get<MutationResponse[]>(
    `/assets/${assetId}/mutations`
  )
  // response.data sudah berisi array langsung (di-unwrap oleh interceptor)
  return response.data ?? []
}

export function AssetMutationHistory({ assetId }: AssetMutationHistoryProps) {
  const {
    data: mutations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['asset-mutations', assetId],
    queryFn: () => fetchAssetMutations(assetId),
    enabled: !!assetId,
  })

  if (isLoading) {
    return <LoadingSpinner text="Memuat riwayat mutasi..." />
  }

  if (isError) {
    return <ErrorAlert message="Gagal memuat riwayat mutasi lokasi." />
  }

  if (!mutations || mutations.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">
          Belum ada riwayat perpindahan lokasi untuk aset ini.
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Riwayat akan muncul saat aset dipindahkan ke lokasi lain.
        </p>
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {mutations.map((mutation, idx) => (
          <MutationItem
            key={mutation.id}
            mutation={mutation}
            isLast={idx === mutations.length - 1}
          />
        ))}
      </ul>
    </div>
  )
}

interface MutationItemProps {
  mutation: MutationResponse
  isLast: boolean
}

function MutationItem({ mutation, isLast }: MutationItemProps) {
  const fromRoom = mutation.fromRoom?.name || 'Gudang Utama'
  const toRoom = mutation.toRoom?.name || 'Tidak diketahui'
  const mutationDate = new Date(mutation.mutatedAt)

  return (
    <li>
      <div className="relative pb-8">
        {/* Connector line */}
        {!isLast && (
          <span
            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        )}

        <div className="relative flex space-x-3">
          {/* Icon */}
          <div>
            <span className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center ring-8 ring-white">
              <MapPin className="w-4 h-4 text-purple-600" />
            </span>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1 pt-1.5">
            {/* Location change */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                {fromRoom}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                {toRoom}
              </span>
            </div>

            {/* Notes */}
            {mutation.note && (
              <div className="mt-2 flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <p className="whitespace-pre-wrap">{mutation.note}</p>
              </div>
            )}

            {/* Timestamp */}
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <time dateTime={mutationDate.toISOString()}>
                {format(mutationDate, "d MMMM yyyy 'pukul' HH:mm", {
                  locale: idLocale,
                })}
              </time>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
