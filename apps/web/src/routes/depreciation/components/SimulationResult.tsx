/**
 * SimulationResult - Tabel dan grafik proyeksi, estimasi tanggal habis
 * Validates: Requirements 6.2, 6.3
 */

import { Calendar, TrendingDown } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SimulateDepreciationResult } from '@/libs/api/depreciation'
import { formatCurrency } from '@/libs/utils/format'

interface SimulationResultProps {
  result: SimulateDepreciationResult | null
}

export function SimulationResult({ result }: SimulationResultProps) {
  if (!result) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          Jalankan simulasi untuk melihat hasil proyeksi
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Hasil Simulasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.asset && (
            <div className="mb-4 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-600">Aset:</p>
              <p className="font-semibold">
                {result.asset.kodeAset} - {result.asset.namaBarang}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Nilai Perolehan:</span>
                  <span className="ml-1 font-medium">
                    {formatCurrency(result.asset.nilaiPerolehan)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Nilai Buku Saat Ini:</span>
                  <span className="ml-1 font-medium text-green-600">
                    {formatCurrency(result.asset.currentBookValue)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">Total Penyusutan Periode</p>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(result.totalDepreciationInPeriod)}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">Jumlah Bulan</p>
              <p className="text-xl font-bold">{result.projections.length} bulan</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-500">Estimasi Habis</p>
              </div>
              <p className="text-xl font-bold">
                {result.estimatedEndDate ? (
                  <Badge variant="secondary">{formatDate(result.estimatedEndDate)}</Badge>
                ) : (
                  <span className="text-gray-400">Belum habis</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grafik Proyeksi</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={result.projections}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis
                dataKey="monthLabel"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  new Intl.NumberFormat('id-ID', {
                    notation: 'compact',
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="nilaiBuku"
                name="Nilai Buku"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="akumulasiPenyusutan"
                name="Akumulasi"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Proyeksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bulan</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead className="text-right">Penyusutan</TableHead>
                  <TableHead className="text-right">Akumulasi</TableHead>
                  <TableHead className="text-right">Nilai Buku</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.projections.map((proj) => (
                  <TableRow
                    key={proj.month}
                    className={proj.nilaiBuku === 0 ? 'bg-gray-50' : ''}
                  >
                    <TableCell>{proj.month}</TableCell>
                    <TableCell>{proj.monthLabel}</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(proj.penyusutan)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(proj.akumulasiPenyusutan)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {formatCurrency(proj.nilaiBuku)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
