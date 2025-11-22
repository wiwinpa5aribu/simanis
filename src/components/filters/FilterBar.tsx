import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Filter, X } from 'lucide-react'

interface FilterBarProps {
  children: ReactNode
  onApply?: () => void
  onReset?: () => void
  isLoading?: boolean
}

export function FilterBar({
  children,
  onApply,
  onReset,
  isLoading,
}: FilterBarProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {children}
          </div>
          <div className="flex flex-wrap gap-2 justify-end border-t pt-4 mt-4">
            {onReset && (
              <Button
                variant="outline"
                onClick={onReset}
                disabled={isLoading}
                size="sm"
              >
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
            {onApply && (
              <Button onClick={onApply} disabled={isLoading} size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Terapkan Filter
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
