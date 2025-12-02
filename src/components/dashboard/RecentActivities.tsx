/**
 * Komponen RecentActivities
 *
 * Menampilkan daftar aktivitas terbaru di dashboard
 * Setiap aktivitas dapat diklik untuk navigasi ke detail terkait
 */

import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RecentActivity } from '@/libs/api/dashboard'

interface RecentActivitiesProps {
  activities: RecentActivity[]
  isLoading?: boolean
}

export function RecentActivities({
  activities,
  isLoading,
}: RecentActivitiesProps) {
  const navigate = useNavigate()

  // Fungsi untuk navigasi berdasarkan tipe aktivitas
  const handleActivityClick = (activity: RecentActivity) => {
    if (activity.link) {
      navigate(activity.link)
    }
  }

  // Icon berdasarkan tipe aktivitas
  const getActivityIcon = (type: RecentActivity['type']) => {
    const iconClass = 'w-2 h-2 rounded-full'
    switch (type) {
      case 'asset':
        return <div className={`${iconClass} bg-blue-500`} />
      case 'loan':
        return <div className={`${iconClass} bg-green-500`} />
      case 'mutation':
        return <div className={`${iconClass} bg-purple-500`} />
      case 'inventory':
        return <div className={`${iconClass} bg-orange-500`} />
      default:
        return <div className={`${iconClass} bg-gray-500`} />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            Belum ada aktivitas terbaru
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => handleActivityClick(activity)}
              onKeyDown={(e) =>
                e.key === 'Enter' && handleActivityClick(activity)
              }
              role={activity.link ? 'button' : undefined}
              tabIndex={activity.link ? 0 : undefined}
              className={`flex gap-3 p-3 rounded-lg transition-colors ${
                activity.link ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center pt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                    locale: localeId,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
