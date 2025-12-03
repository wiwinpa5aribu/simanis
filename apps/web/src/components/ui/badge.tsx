import { clsx } from 'clsx'
import * as React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
          'bg-gray-100 text-gray-900 hover:bg-gray-200':
            variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
          'border border-gray-300 text-gray-700': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
