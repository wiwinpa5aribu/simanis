// Komponen select sederhana

import type { ReactNode } from 'react'
import { forwardRef } from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode
  onValueChange?: (value: string) => void
}

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

interface SelectContentProps {
  children: ReactNode
}

interface SelectItemProps {
  value: string
  children: ReactNode
  className?: string
}

interface SelectValueProps {
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = '', onValueChange, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'

export function SelectTrigger({
  children,
  className = '',
  ...props
}: SelectTriggerProps) {
  return (
    <button
      className={`flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SelectContent({ children }: SelectContentProps) {
  return <div className="mt-1">{children}</div>
}

export function SelectItem({
  value,
  children,
  className = '',
}: SelectItemProps) {
  return (
    <option className={className} value={value}>
      {children}
    </option>
  )
}

export function SelectValue({ placeholder }: SelectValueProps) {
  return <span className="text-gray-500">{placeholder}</span>
}
