// Komponen dropdown menu sederhana
import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

interface DropdownMenuProps {
  children: ReactNode
}

interface DropdownMenuTriggerProps {
  children: ReactNode
  asChild?: boolean
}

interface DropdownMenuContentProps {
  children: ReactNode
  align?: 'start' | 'end'
}

interface DropdownMenuItemProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={menuRef} className="relative inline-block">
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  )
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  return <div className="cursor-pointer">{children}</div>
}

export function DropdownMenuContent({
  children,
  align = 'end',
}: DropdownMenuContentProps) {
  return (
    <div
      className={`absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
        align === 'end' ? 'right-0' : 'left-0'
      }`}
    >
      <div className="py-1">{children}</div>
    </div>
  )
}

export function DropdownMenuItem({
  children,
  onClick,
  className = '',
}: DropdownMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${className}`}
    >
      {children}
    </button>
  )
}
