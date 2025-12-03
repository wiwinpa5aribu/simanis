/**
 * DepreciationDetailModal - Info aset dan riwayat penyusutan
 * Validates: Requirements 2.2
 */

import { useQuery } from '@tanstack/react-query'
import { X, Calendar, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { getAssetDepreciationHistory } from '@/libs/api/depreciation'
import { formatCurrency } from '@/libs/utils/format'

interface DepreciationDetailModalProps {
  assetId: number | null
  open: boolean
  onClose: () => void
}

export function DepreciationDetailModal({
  assetId,
  open,
  onClose,
}: DepreciationDetailModalProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['asset-depreciation-history', assetId],
    queryFn: () => getAssetDepreciationHistory(assetId!),
    enabled: !!assetId && open,
  })

  const formatMonth = (bulan: number, tahun: number) => {
    const date = new Date(tahun, bulan - 1)
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Riwayat Penyusutan Aset</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : isError || !data ? (
          <div className="py-8 text-center text-red-500">
            Gagal memuat riwayat penyusutan
          </div>
        ) : (
          <div className="space-y-6">
            {/* Asset Info */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Kode Aset</p>
                  <p className="font-mono font-semibold">
                    {data.asset.kodeAset}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama Barang</p>
                  <p className="font-semibold">{data.asset.namaBarang}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nilai Perolehan</p>
                  <p className="font-semibold text-blue-600">
                    {formatCurrency(data.asset.nilaiPerolehan)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Masa Manfaat</p>
                  <p className="font-semibold">
                    {data.asset.masaManfaatTahun} tahun
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Total Penyusutan</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(data.totalDepreciation)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nilai Buku Saat Ini</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(data.currentBookValue)}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <Calendar className="h-4 w-4" />
                Riwayat Penyusutan
              </h3>

              {data.entries.length === 0 ? (
                <p className="text-center text-gray-500">
                  Belum ada riwayat penyusutan
                </p>
              ) : (
                <div className="relative space-y-0">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />

                  {data.entries.map((entry, index) => (
                    <div key={entry.id} className="relative flex gap-4 pb-4">
                      {/* Timeline dot */}
                      <div
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                          index === 0
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        <TrendingDown className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 rounded-lg border bg-white p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {formatMonth(entry.bulan, entry.tahun)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.createdAt).toLocaleDateString(
                              'id-ID'
                            )}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Penyusutan:</span>
                            <span className="ml-1 font-medium text-red-600">
                              {formatCurrency(entry.nilaiPenyusutan)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Nilai Buku:</span>
                            <span className="ml-1 font-medium text-green-600">
                              {formatCurrency(entry.nilaiBuku)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
