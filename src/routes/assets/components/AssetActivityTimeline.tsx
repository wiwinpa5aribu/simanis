import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  FileText,
  MapPin,
  Clock,
  Edit,
  Trash2,
  PlusCircle,
  CheckCircle,
} from 'lucide-react'
import { getAuditLogs, type AuditLog } from '@/libs/api/audit'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { LoadingSpinner, ErrorAlert } from '@/components/ui/Feedback'

interface AssetActivityTimelineProps {
  assetId: number
}

export function AssetActivityTimeline({ assetId }: AssetActivityTimelineProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['audit-logs', 'asset', assetId],
    queryFn: () =>
      getAuditLogs({
        entity_type: 'asset',
        entity_id: assetId,
        pageSize: 20,
      }),
  })

  const getIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return <PlusCircle className="w-4 h-4 text-green-600" />
      case 'update':
        return <Edit className="w-4 h-4 text-blue-600" />
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-600" />
      case 'move':
        return <MapPin className="w-4 h-4 text-purple-600" />
      case 'loan':
        return <FileText className="w-4 h-4 text-orange-600" />
      case 'return':
        return <CheckCircle className="w-4 h-4 text-teal-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getActionLabel = (log: AuditLog) => {
    const action = log.action.toLowerCase()
    switch (action) {
      case 'create':
        return 'Aset ditambahkan'
      case 'update':
        return 'Informasi aset diperbarui'
      case 'delete':
        return 'Aset dihapus'
      case 'move':
        return 'Lokasi aset dipindahkan'
      case 'loan':
        return 'Aset dipinjam'
      case 'return':
        return 'Aset dikembalikan'
      default:
        return `Aktivitas: ${log.action}`
    }
  }

  const getDescription = (log: AuditLog) => {
    if (log.new_values && log.old_values) {
      const changes = Object.keys(log.new_values)
        .map((key) => {
          return `${key}: ${log.old_values?.[key]} -> ${log.new_values?.[key]}`
        })
        .join(', ')
      return changes ? `Perubahan: ${changes}` : ''
    }
    return ''
  }

  if (isLoading) return <LoadingSpinner text="Memuat riwayat aktivitas..." />
  if (isError) return <ErrorAlert message="Gagal memuat riwayat aktivitas." />
  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada aktivitas tercatat untuk aset ini.
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {data.data.map((log, idx) => (
          <li key={log.id}>
            <div className="relative pb-8">
              {idx !== data.data.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                    {getIcon(log.action)}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getActionLabel(log)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Oleh{' '}
                      <span className="font-medium">
                        {log.user_name || 'System'}
                      </span>
                    </p>
                    {getDescription(log) && (
                      <p className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                        {getDescription(log)}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <time dateTime={log.timestamp}>
                      {formatDistanceToNow(new Date(log.timestamp), {
                        addSuffix: true,
                        locale: idLocale,
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
