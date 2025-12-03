/**
 * DepreciationFilters - Filter kategori dan tahun
 * Validates: Requirements 1.3, 1.4
 */

import { useQuery } from '@tanstack/react-query'
import { Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getCategories } from '@/libs/api/categories'

interface DepreciationFiltersProps {
  categoryId?: number
  year?: number
  onCategoryChange: (categoryId: number | undefined) => void
  onYearChange: (year: number | undefined) => void
}

export function DepreciationFilters({
  categoryId,
  year,
  onCategoryChange,
  onYearChange,
}: DepreciationFiltersProps) {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  // Generate year options (5 years back to current year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>

          <div className="min-w-[180px] space-y-1">
            <Label htmlFor="category-filter" className="text-xs text-gray-500">
              Kategori
            </Label>
            <Select
              value={categoryId?.toString() ?? 'all'}
              onValueChange={(val) =>
                onCategoryChange(val === 'all' ? undefined : parseInt(val))
              }
            >
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[120px] space-y-1">
            <Label htmlFor="year-filter" className="text-xs text-gray-500">
              Tahun
            </Label>
            <Select
              value={year?.toString() ?? 'all'}
              onValueChange={(val) =>
                onYearChange(val === 'all' ? undefined : parseInt(val))
              }
            >
              <SelectTrigger id="year-filter">
                <SelectValue placeholder="Semua Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
