/**
 * DepreciationTable - Tabel daftar aset dengan info penyusutan
 * Validates: Requirements 2.1, 2.3, 2.4
 * Responsive: Mobile card view, Desktop table view
 */

import { useQuery } from '@tanstack/react-query'
import { ArrowUpDown, CheckCircle, Eye } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  type DepreciationListItem,
  getDepreciationList,
} from '@/libs/api/depreciation'
import { useMediaQuery } from '@/libs/hooks/useMediaQuery'
import { formatCurrency } from '@/libs/utils/format'

interface DepreciationTableProps {
  categoryId?: number
  year?: number
  month?: number
  onViewDetail?: (item: DepreciationListItem) => void
}

type SortField = 'kodeAset' | 'namaBarang' | 'nilaiBuku' | 'akumulasiPenyusutan'
type SortOrder = 'asc' | 'desc'

// Mobile card component for responsive view
function DepreciationCard({
  item,
  onViewDetail,
}: {
  item: DepreciationListItem
  onViewDetail?: (item: DepreciationListItem) => void
}) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="font-mono text-sm text-gray-500">{item.kodeAset}</p>
          <p className="font-semibold">{item.namaBarang}</p>
          <p className="text-sm text-gray-500">{item.categoryName}</p>
        </div>
        <div className="flex items-center gap-2">
          {item.isFullyDepreciated ? (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Habis
            </Badge>
          ) : (
            <Badge variant="outline">Aktif</Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetail?.(item)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Nilai Perolehan</p>
          <p className="font-medium">{formatCurrency(item.nilaiPerolehan)}</p>
        </div>
        <div>
          <p className="text-gray-500">Penyusutan/Bln</p>
          <p className="font-medium text-red-600">
            {formatCurrency(item.penyusutanPerBulan)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Akumulasi</p>
          <p className="font-medium">
            {formatCurrency(item.akumulasiPenyusutan)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Nilai Buku</p>
          <p className="font-semibold text-green-600">
            {formatCurrency(item.nilaiBuku)}
          </p>
        </div>
      </div>
    </div>
  )
}

export function DepreciationTable({
  categoryId,
  year,
  month,
  onViewDetail,
}: DepreciationTableProps) {
  const [sortBy, setSortBy] = useState<SortField>('kodeAset')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'depreciation-list',
      categoryId,
      year,
      month,
      sortBy,
      sortOrder,
      page,
    ],
    queryFn: () =>
      getDepreciationList({
        categoryId,
        year,
        month,
        sortBy,
        sortOrder,
        page,
        pageSize,
      }),
  })

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField
    children: React.ReactNode
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown
          className={`h-3 w-3 ${sortBy === field ? 'text-blue-600' : 'text-gray-400'}`}
        />
      </div>
    </TableHead>
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Penyusutan Aset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Penyusutan Aset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-red-500">
            Gagal memuat data penyusutan
          </div>
        </CardContent>
      </Card>
    )
  }

  // Mobile card view
  if (isMobile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Penyusutan Aset</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.items.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Tidak ada data penyusutan
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {data?.items.map((item) => (
                  <DepreciationCard
                    key={item.id}
                    item={item}
                    onViewDetail={onViewDetail}
                  />
                ))}
              </div>

              {/* Mobile Pagination */}
              {data?.meta && data.meta.totalPages > 1 && (
                <div className="mt-4 space-y-2">
                  <p className="text-center text-sm text-gray-500">
                    {(page - 1) * pageSize + 1} -{' '}
                    {Math.min(page * pageSize, data.meta.total)} dari{' '}
                    {data.meta.total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={page >= data.meta.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  // Desktop table view
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Penyusutan Aset</CardTitle>
      </CardHeader>
      <CardContent>
        {data?.items.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Tidak ada data penyusutan
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableHeader field="kodeAset">Kode Aset</SortableHeader>
                    <SortableHeader field="namaBarang">
                      Nama Barang
                    </SortableHeader>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">
                      Nilai Perolehan
                    </TableHead>
                    <TableHead className="text-right">Penyusutan/Bln</TableHead>
                    <SortableHeader field="akumulasiPenyusutan">
                      Akumulasi
                    </SortableHeader>
                    <SortableHeader field="nilaiBuku">
                      Nilai Buku
                    </SortableHeader>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">
                        {item.kodeAset}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.namaBarang}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {item.categoryName}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.nilaiPerolehan)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(item.penyusutanPerBulan)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.akumulasiPenyusutan)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(item.nilaiBuku)}
                      </TableCell>
                      <TableCell>
                        {item.isFullyDepreciated ? (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Habis
                          </Badge>
                        ) : (
                          <Badge variant="outline">Aktif</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetail?.(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Desktop Pagination */}
            {data?.meta && data.meta.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Menampilkan {(page - 1) * pageSize + 1} -{' '}
                  {Math.min(page * pageSize, data.meta.total)} dari{' '}
                  {data.meta.total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= data.meta.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
