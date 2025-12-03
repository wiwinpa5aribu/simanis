/**
 * DepreciationFilters - Filter kategori dan tahun
 * Validates: Requirements 1.3, 1.4
 * Responsive: Collapsible on mobile
 */

import { useQuery } from '@tanstack/react-query'
import { Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { useMediaQuery } from '@/libs/hooks/useMediaQuery'

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
  const [isExpanded, setIsExpanded] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  // Generate year options (5 years back to current year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i)

  // Count active filters
  const activeFilters = [categoryId, year].filter(Boolean).length

  const filterContent = (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="hidden items-center gap-2 text-gray-600 sm:flex">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filter:</span>
      </div>

      <div className="w-full space-y-1 sm:min-w-[180px] sm:w-auto">
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

      <div className="w-full space-y-1 sm:min-w-[120px] sm:w-auto">
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
  )

  // Mobile collapsible view
  if (isMobile) {
    return (
      <Card>
        <CardContent className="p-0">
          <Button
            variant="ghost"
            className="flex w-full items-center justify-between p-4"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filter</span>
              {activeFilters > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                  {activeFilters}
                </span>
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {isExpanded && <div className="border-t p-4">{filterContent}</div>}
        </CardContent>
      </Card>
    )
  }

  // Desktop view
  return (
    <Card>
      <CardContent className="pt-6">{filterContent}</CardContent>
    </Card>
  )
}
