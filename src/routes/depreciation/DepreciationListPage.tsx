import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDepreciationList } from '@/libs/api/depreciation'
import { formatCurrency } from '@/libs/utils/format'
import { Loading } from '@/components/ui/loading'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DepreciationFilters {
  year: string
  category: string
  month: string
}

export default function DepreciationListPage() {
  const { register, watch, setValue } = useForm<DepreciationFilters>({
    defaultValues: {
      year: new Date().getFullYear().toString(),
      category: '',
      month: (new Date().getMonth() + 1).toString(),
    },
  })

  const filters = watch()

  // Fetch data penyusutan
  const { data, isLoading, isError } = useQuery({
    queryKey: ['depreciation', filters],
    queryFn: () =>
      getDepreciationList({
        year: parseInt(filters.year),
        month: parseInt(filters.month),
        category_id: filters.category ? parseInt(filters.category) : undefined,
      }),
  })

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Penyusutan Aset</h1>
          <p className="text-gray-500">
            Laporan penyusutan nilai aset bulanan (View Only)
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <Input
                id="year"
                type="number"
                {...register('year')}
                placeholder="2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Bulan</Label>
              <Select
                value={filters.month}
                onValueChange={(val) => setValue('month', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <SelectItem key={m} value={m.toString()}>
                      {new Date(0, m - 1).toLocaleString('id-ID', {
                        month: 'long',
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori (ID)</Label>
              <Input
                id="category"
                {...register('category')}
                placeholder="ID Kategori (Opsional)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Penyusutan</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Gagal memuat data penyusutan. Pastikan backend berjalan.
              </AlertDescription>
            </Alert>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data penyusutan untuk periode ini.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Aset</TableHead>
                  <TableHead>Nama Aset</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Nilai Buku</TableHead>
                  <TableHead className="text-right">Penyusutan (Bln)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.asset_code}
                    </TableCell>
                    <TableCell>{item.asset_name}</TableCell>
                    <TableCell>{item.category_name || '-'}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.book_value)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {formatCurrency(item.depreciation_value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
