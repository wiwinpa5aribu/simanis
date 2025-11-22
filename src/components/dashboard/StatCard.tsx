/**
 * Komponen StatCard
 *
 * Card untuk menampilkan statistik tunggal di dashboard
 * Menampilkan judul, nilai, dan ikon opsional dengan styling yang konsisten
 */

import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: number | string
  icon?: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

export function StatCard({
  title,
  value,
  icon,
  variant = 'default',
}: StatCardProps) {
  // Mapping warna berdasarkan variant
  const variantStyles = {
    default: 'bg-white border-gray-200',
    primary: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
  }

  const iconStyles = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  }

  const valueStyles = {
    default: 'text-gray-900',
    primary: 'text-blue-900',
    success: 'text-green-900',
    warning: 'text-yellow-900',
    danger: 'text-red-900',
  }

  return (
    <Card className={`${variantStyles[variant]} border-2`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && <div className={iconStyles[variant]}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueStyles[variant]}`}>
          {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
        </div>
      </CardContent>
    </Card>
  )
}
