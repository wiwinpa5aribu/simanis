/**
 * Komponen QuickActions
 * Aksi cepat untuk operasi umum manajemen aset sekolah
 */

import { Link } from 'react-router-dom'
import {
  Plus,
  QrCode,
  FileText,
  ClipboardList,
  ArrowRightLeft,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuickActionItem {
  title: string
  description: string
  icon: React.ElementType
  href: string
  color: string
  bgColor: string
  roles: string[] // Roles that can see this action
}

const quickActions: QuickActionItem[] = [
  {
    title: 'Tambah Aset',
    description: 'Daftarkan aset baru',
    icon: Plus,
    href: '/assets/create',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 hover:bg-blue-200',
    roles: ['admin', 'wakasek', 'operator'],
  },
  {
    title: 'Scan QR',
    description: 'Inventarisasi cepat',
    icon: QrCode,
    href: '/inventory/scan',
    color: 'text-green-600',
    bgColor: 'bg-green-100 hover:bg-green-200',
    roles: ['admin', 'wakasek', 'operator'],
  },
  {
    title: 'Peminjaman',
    description: 'Catat peminjaman baru',
    icon: ClipboardList,
    href: '/loans/create',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 hover:bg-purple-200',
    roles: ['admin', 'wakasek', 'operator', 'guru'],
  },
  {
    title: 'Mutasi Aset',
    description: 'Pindahkan lokasi aset',
    icon: ArrowRightLeft,
    href: '/assets/mutation',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 hover:bg-orange-200',
    roles: ['admin', 'wakasek', 'operator'],
  },
  {
    title: 'Laporan KIB',
    description: 'Generate laporan',
    icon: FileText,
    href: '/reports/kib',
    color: 'text-red-600',
    bgColor: 'bg-red-100 hover:bg-red-200',
    roles: ['admin', 'wakasek', 'bendahara', 'kepsek'],
  },
]

interface QuickActionsProps {
  role?: string
}

export function QuickActions({ role = 'operator' }: QuickActionsProps) {
  const filteredActions = quickActions.filter((action) =>
    action.roles.includes(role)
  )

  if (filteredActions.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className={`flex flex-col items-center p-4 rounded-xl transition-all ${action.bgColor}`}
            >
              <action.icon className={`h-6 w-6 ${action.color} mb-2`} />
              <span className="text-sm font-medium text-gray-900 text-center">
                {action.title}
              </span>
              <span className="text-xs text-gray-500 text-center mt-0.5">
                {action.description}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
