import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface FilterBarProps {
  children: ReactNode
  onApply?: () => void
  onReset?: () => void
  isLoading?: boolean
  /** Enable collapsible mode for mobile */
  collapsible?: boolean
  /** Default expanded state (only applies when collapsible is true) */
  defaultExpanded?: boolean
}

export function FilterBar({
  children,
  onApply,
  onReset,
  isLoading,
  collapsible = true,
  defaultExpanded = false,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Mobile Toggle Button - only show when collapsible */}
          {collapsible && (
            <div className="md:hidden">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter & Pencarian
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}

          {/* Filter Content - collapsible on mobile */}
          <div
            className={`${
              collapsible
                ? `${isExpanded ? 'block' : 'hidden'} md:block`
                : 'block'
            }`}
          >
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
        </div>
      </CardContent>
    </Card>
  )
}
