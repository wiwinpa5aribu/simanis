/**
 * =====================================================
 * SELECT COMPONENT
 * =====================================================
 *
 * Komponen Select yang menggunakan native HTML select
 * dengan API yang mirip Radix UI untuk konsistensi.
 *
 * Perbaikan hydration error:
 * - Menggunakan React.Children untuk collect options
 * - Options dirender di dalam native select element
 * - Tidak ada DOM nesting yang invalid
 * - Removed unused context to prevent hydration mismatch
 *
 * @author SIMANIS Team
 * @version 2.2.0
 */

import { ChevronDown } from 'lucide-react'
import {
  Children,
  forwardRef,
  isValidElement,
  type ReactNode,
  useId,
  useState,
} from 'react'
import { cn } from '@/libs/utils'

// ============================================================
// HELPER: Extract options from children
// ============================================================

interface ExtractedOption {
  value: string
  label: string
  disabled?: boolean
}

function extractOptionsFromChildren(children: ReactNode): ExtractedOption[] {
  const options: ExtractedOption[] = []

  function processChildren(nodes: ReactNode) {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return

      // SelectItem
      if (
        child.type === SelectItem ||
        (child.type as any)?.displayName === 'SelectItem'
      ) {
        const props = child.props as SelectItemProps
        options.push({
          value: props.value,
          label:
            typeof props.children === 'string'
              ? props.children
              : String(props.children),
          disabled: props.disabled,
        })
      }
      // SelectContent, SelectGroup - process their children
      else if (
        child.type === SelectContent ||
        child.type === SelectGroup ||
        (child.type as any)?.displayName === 'SelectContent' ||
        (child.type as any)?.displayName === 'SelectGroup'
      ) {
        processChildren(child.props.children)
      }
      // SelectTrigger - process children to find SelectValue
      else if (
        child.type === SelectTrigger ||
        (child.type as any)?.displayName === 'SelectTrigger'
      ) {
        // Skip - handled separately
      }
    })
  }

  processChildren(children)
  return options
}

function extractPlaceholder(children: ReactNode): string | undefined {
  let placeholder: string | undefined

  function processChildren(nodes: ReactNode) {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return

      if (
        child.type === SelectValue ||
        (child.type as any)?.displayName === 'SelectValue'
      ) {
        placeholder = (child.props as SelectValueProps).placeholder
      } else if (
        child.type === SelectTrigger ||
        (child.type as any)?.displayName === 'SelectTrigger'
      ) {
        processChildren(child.props.children)
      }
    })
  }

  processChildren(children)
  return placeholder
}

function extractTriggerProps(
  children: ReactNode
): { className?: string; id?: string } | null {
  let props: { className?: string; id?: string } | null = null

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return

    if (
      child.type === SelectTrigger ||
      (child.type as any)?.displayName === 'SelectTrigger'
    ) {
      props = {
        className: (child.props as SelectTriggerProps).className,
        id: (child.props as SelectTriggerProps).id,
      }
    }
  })

  return props
}

// ============================================================
// SELECT ROOT
// ============================================================

interface SelectProps {
  children: ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  name?: string
  required?: boolean
}

export function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
  required,
}: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const selectId = useId()

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  // Extract data from children
  const options = extractOptionsFromChildren(children)
  const placeholder = extractPlaceholder(children)
  const triggerProps = extractTriggerProps(children)
  const currentValue = value ?? internalValue

  // Find selected option label
  const selectedOption = options.find((opt) => opt.value === currentValue)

  return (
    <div className="relative">
      <select
        id={triggerProps?.id || selectId}
        name={name}
        value={currentValue}
        onChange={(e) => handleValueChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'appearance-none cursor-pointer pr-10',
          !currentValue && 'text-muted-foreground',
          triggerProps?.className
        )}
      >
        {placeholder && (
          <option value="" disabled={required}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  )
}

// ============================================================
// SELECT TRIGGER (no-op wrapper for API compatibility)
// ============================================================

interface SelectTriggerProps {
  children?: ReactNode
  className?: string
  id?: string
}

export const SelectTrigger = forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ children, className, id }, ref) => {
    // This component is now a no-op - props are extracted by Select
    // Returning null to avoid hydration issues
    return null
  }
)

SelectTrigger.displayName = 'SelectTrigger'

// ============================================================
// SELECT VALUE (no-op - placeholder extracted by Select)
// ============================================================

interface SelectValueProps {
  placeholder?: string
}

export function SelectValue({ placeholder }: SelectValueProps) {
  // This component is now a no-op - placeholder is extracted by Select
  return null
}

SelectValue.displayName = 'SelectValue'

// ============================================================
// SELECT CONTENT (no-op wrapper for API compatibility)
// ============================================================

interface SelectContentProps {
  children: ReactNode
  className?: string
}

export function SelectContent({ children }: SelectContentProps) {
  // This component is now a no-op - children are extracted by Select
  return null
}

SelectContent.displayName = 'SelectContent'

// ============================================================
// SELECT ITEM (no-op - data extracted by Select)
// ============================================================

interface SelectItemProps {
  value: string
  children: ReactNode
  className?: string
  disabled?: boolean
}

export function SelectItem({
  value,
  children,
  className,
  disabled,
}: SelectItemProps) {
  // This component is now a no-op - data is extracted by Select
  return null
}

SelectItem.displayName = 'SelectItem'

// ============================================================
// SELECT GROUP (no-op wrapper for API compatibility)
// ============================================================

interface SelectGroupProps {
  children: ReactNode
}

export function SelectGroup({ children }: SelectGroupProps) {
  // This component is now a no-op - children are extracted by Select
  return null
}

SelectGroup.displayName = 'SelectGroup'

// ============================================================
// SELECT LABEL (untuk optgroup label - not supported in native)
// ============================================================

interface SelectLabelProps {
  children: ReactNode
  className?: string
}

export function SelectLabel({ children, className }: SelectLabelProps) {
  // Native select optgroup not fully supported in this implementation
  return null
}

SelectLabel.displayName = 'SelectLabel'

// ============================================================
// SELECT SEPARATOR (tidak ada di native select)
// ============================================================

export function SelectSeparator() {
  // Native select tidak support separator
  return null
}

SelectSeparator.displayName = 'SelectSeparator'
