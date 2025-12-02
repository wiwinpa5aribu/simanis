import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import {
  Activity,
  ArrowLeft,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Filter,
  MapPin,
  PlusCircle,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { ErrorAlert, LoadingSpinner } from '../../components/ui/Feedback'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { type AuditLog, getAuditLogs } from '../../libs/api/audit'
import { useAuthStore } from '../../libs/store/authStore'

export function UserActivityPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [filterType, setFilterType] = useState<string>('all')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['audit-logs', 'user', user?.id, filterType],
    queryFn: () =>
      getAuditLogs({
        user_id: user?.id ? Number(user.id) : undefined,
        entity_type: filterType !== 'all' ? filterType : undefined,
        pageSize: 50,
      }),
    enabled: !!user?.id,
  })

  const getIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return <PlusCircle className="w-5 h-5 text-green-600" />
      case 'update':
        return <Edit className="w-5 h-5 text-blue-600" />
      case 'delete':
        return <Trash2 className="w-5 h-5 text-red-600" />
      case 'move':
        return <MapPin className="w-5 h-5 text-purple-600" />
      case 'loan':
        return <FileText className="w-5 h-5 text-orange-600" />
      case 'return':
        return <CheckCircle className="w-5 h-5 text-teal-600" />
      default:
        return <Activity className="w-5 h-5 text-gray-600" />
    }
  }

  const getActionLabel = (log: AuditLog) => {
    const action = log.action.toLowerCase()
    const entity =
      log.entity_type === 'asset'
        ? 'Aset'
        : log.entity_type === 'loan'
          ? 'Peminjaman'
          : log.entity_type

    switch (action) {
      case 'create':
        return `Menambahkan ${entity} baru`
      case 'update':
        return `Memperbarui data ${entity}`
      case 'delete':
        return `Menghapus ${entity}`
      case 'move':
        return `Memindahkan lokasi ${entity}`
      case 'loan':
        return `Mencatat peminjaman`
      case 'return':
        return `Mencatat pengembalian`
      default:
        return `${action} ${entity}`
    }
  }

  if (isError) return <ErrorAlert message="Gagal memuat riwayat aktivitas." />

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Riwayat Aktivitas Saya
          </h1>
          <p className="text-gray-500">
            Daftar aktivitas terbaru yang Anda lakukan
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Aktivitas</SelectItem>
              <SelectItem value="asset">Aset</SelectItem>
              <SelectItem value="loan">Peminjaman</SelectItem>
              <SelectItem value="mutation">Mutasi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline Aktivitas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner text="Memuat aktivitas..." />
          ) : !data?.data || data.data.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Belum ada aktivitas yang tercatat.
            </div>
          ) : (
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
                              {getActionLabel(log)}{' '}
                              <span className="text-gray-500 font-normal">
                                #{log.entity_id}
                              </span>
                            </p>
                            {log.field_changed && (
                              <p className="mt-1 text-xs text-gray-500">
                                Perubahan pada:{' '}
                                {Object.keys(log.field_changed).join(', ')}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
