/**
 * Komponen RecentActivities
 *
 * Menampilkan daftar aktivitas terbaru dengan link ke detail
 */

import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import {
  Package,
  ArrowRight,
  HandCoins,
  QrCode,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RecentActivity } from '@/libs/api/dashboard'

interface RecentActivitiesProps {
  activities: RecentActivity[]
  isLoading?: boolean
}

const activityIcons = {
  asset: Package,
  mutation: ArrowRight,
  loan: HandCoins,
  inventory: QrCode,
}

const activityColors = {
  asset: 'text-green-600 bg-green-100',
  mutation: 'text-blue-600 bg-blue-100',
  loan: 'text-purple-600 bg-purple-100',
  inventory: 'text-orange-600 bg-orange-100',
}

export function RecentActivities({
  activities,
  isLoading = false,
}: RecentActivitiesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Memuat aktivitas...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Belum ada aktivitas
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type]
            const colorClass = activityColors[activity.type]

            const activityContent = (
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                      locale: localeId,
                    })}
                  </p>
                </div>
                {activity.link && (
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </div>
            )

            if (activity.link) {
              return (
                <Link key={activity.id} to={activity.link} className="block">
                  {activityContent}
                </Link>
              )
            }

            return <div key={activity.id}>{activityContent}</div>
          })}
        </div>
      </CardContent>
    </Card>
  )
}
