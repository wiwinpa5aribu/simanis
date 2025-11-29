/**
 * Komponen AssetValueSummary
 * Menampilkan ringkasan nilai aset untuk keperluan KIB
 */

import { Banknote, TrendingDown, Calculator } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AssetValueSummaryProps {
  totalValue: number
  depreciatedValue: number
  isLoading?: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function AssetValueSummary({
  totalValue,
  depreciatedValue,
  isLoading = false,
}: AssetValueSummaryProps) {
  const bookValue = totalValue - depreciatedValue
  const depreciationPercent =
    totalValue > 0 ? (depreciatedValue / totalValue) * 100 : 0

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Nilai Aset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">Memuat data...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Nilai Aset (KIB)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Nilai Perolehan
            </span>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {formatCurrency(totalValue)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              Akumulasi Penyusutan
            </span>
          </div>
          <span className="text-lg font-bold text-orange-600">
            {formatCurrency(depreciatedValue)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
          <div>
            <span className="text-sm font-medium text-gray-700">
              Nilai Buku
            </span>
            <p className="text-xs text-gray-500">Nilai setelah penyusutan</p>
          </div>
          <span className="text-xl font-bold text-green-600">
            {formatCurrency(bookValue)}
          </span>
        </div>

        {/* Progress bar penyusutan */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Tingkat Penyusutan</span>
            <span>{depreciationPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(depreciationPercent, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
