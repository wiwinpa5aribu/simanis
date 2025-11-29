// Komponen dialog/modal sederhana
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

interface DialogContentProps {
  children: ReactNode
  className?: string
}

interface DialogHeaderProps {
  children: ReactNode
}

interface DialogTitleProps {
  children: ReactNode
}

interface DialogDescriptionProps {
  children: ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
        onKeyDown={(e) => e.key === 'Escape' && onOpenChange(false)}
        role="button"
        tabIndex={0}
        aria-label="Close dialog"
      />
      <div className="relative z-50">{children}</div>
    </div>
  )
}

export function DialogContent({
  children,
  className = '',
}: DialogContentProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 ${className}`}
    >
      {children}
    </div>
  )
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return <div className="px-6 pt-6 pb-4 border-b">{children}</div>
}

export function DialogTitle({ children }: DialogTitleProps) {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return <p className="text-sm text-gray-500 mt-1">{children}</p>
}

export function DialogClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
    >
      <X className="w-5 h-5" />
    </button>
  )
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <div className="px-6 py-4 border-t flex justify-end gap-2">{children}</div>
  )
}

// (definitions moved above)
