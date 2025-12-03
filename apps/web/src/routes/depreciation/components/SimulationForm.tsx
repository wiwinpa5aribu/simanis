/**
 * SimulationForm - Form pilih aset/kategori dan periode simulasi
 * Validates: Requirements 6.1
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Calculator } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAssets } from '@/libs/api/assets'
import { getCategories } from '@/libs/api/categories'
import {
  simulateDepreciationSchema,
  type SimulateDepreciationInput,
} from '@/libs/validation/depreciationSchemas'

interface SimulationFormProps {
  onSimulate: (params: {
    assetId?: number
    categoryId?: number
    periodMonths: number
  }) => void
  isLoading?: boolean
}

export function SimulationForm({ onSimulate, isLoading }: SimulationFormProps) {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { data: assetsData } = useQuery({
    queryKey: ['assets-for-simulation'],
    queryFn: () => getAssets({ page: 1, pageSize: 100 }),
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SimulateDepreciationInput>({
    resolver: zodResolver(simulateDepreciationSchema),
    defaultValues: {
      periodMonths: 12,
    },
  })

  const simulationType = watch('assetId')
    ? 'asset'
    : watch('categoryId')
      ? 'category'
      : ''

  const onSubmit = (data: SimulateDepreciationInput) => {
    onSimulate({
      assetId: data.assetId,
      categoryId: data.categoryId,
      periodMonths: data.periodMonths,
    })
  }

  const handleTypeChange = (type: string) => {
    if (type === 'asset') {
      setValue('categoryId', undefined)
    } else {
      setValue('assetId', undefined)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Simulasi Penyusutan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Simulation Type */}
          <div className="space-y-2">
            <Label>Tipe Simulasi</Label>
            <Select value={simulationType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe simulasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asset">Per Aset</SelectItem>
                <SelectItem value="category">
                  Per Kategori (Hipotesis)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Asset Selection */}
          {simulationType === 'asset' && (
            <div className="space-y-2">
              <Label htmlFor="assetId">Pilih Aset</Label>
              <Select
                value={watch('assetId')?.toString() ?? ''}
                onValueChange={(val) => setValue('assetId', parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih aset" />
                </SelectTrigger>
                <SelectContent>
                  {assetsData?.data?.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id.toString()}>
                      {asset.kodeAset} - {asset.namaBarang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assetId && (
                <p className="text-sm text-red-500">{errors.assetId.message}</p>
              )}
            </div>
          )}

          {/* Category Selection */}
          {simulationType === 'category' && (
            <div className="space-y-2">
              <Label htmlFor="categoryId">Pilih Kategori</Label>
              <Select
                value={watch('categoryId')?.toString() ?? ''}
                onValueChange={(val) => setValue('categoryId', parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name} ({cat.defaultMasaManfaat ?? 5} tahun)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Period */}
          <div className="space-y-2">
            <Label htmlFor="periodMonths">Periode Simulasi (Bulan)</Label>
            <Input
              id="periodMonths"
              type="number"
              min={1}
              max={60}
              {...register('periodMonths', { valueAsNumber: true })}
            />
            {errors.periodMonths && (
              <p className="text-sm text-red-500">
                {errors.periodMonths.message}
              </p>
            )}
            <p className="text-xs text-gray-500">Maksimal 60 bulan (5 tahun)</p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !simulationType}
          >
            {isLoading ? 'Menghitung...' : 'Jalankan Simulasi'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
