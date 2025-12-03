/**
 * DepreciationSummaryCards - Menampilkan ringkasan penyusutan
 * 3 cards: Nilai Perolehan, Akumulasi Penyusutan, Nilai Buku
 * Validates: Requirements 1.1
 */

import { useQuery } from '@tanstack/react-query'
import { TrendingDown, Wallet, Calculator } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getDepreciationSummary } from '@/libs/api/depreciation'
import { formatCurrency } from '@/libs/utils/format'

interface DepreciationSummaryCardsProps {
  categoryId?: number
  year?: number
}

export function DepreciationSummaryCards({
  categoryId,
  year,
}: DepreciationSummaryCardsProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['depreciation-summary', categoryId, year],
    queryFn: () => getDepreciationSummary({ categoryId, year }),
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="mt-2 h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        Gagal memuat ringkasan penyusutan
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Nilai Perolehan',
      value: data.totalNilaiPerolehan,
      icon: Wallet,
      description: `${data.totalAssets} aset`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Akumulasi Penyusutan',
      value: data.totalAkumulasiPenyusutan,
      icon: TrendingDown,
      description: `${data.fullyDepreciatedCount} habis disusutkan`,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Nilai Buku',
      value: data.totalNilaiBuku,
      icon: Calculator,
      description: 'Nilai saat ini',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`rounded-full p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {formatCurrency(card.value)}
            </div>
            <p className="mt-1 text-xs text-gray-500">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
