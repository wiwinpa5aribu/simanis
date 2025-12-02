/**
 * Loading Component
 * Simple loading spinner component
 */

import { Loader2 } from 'lucide-react'

interface LoadingProps {
  text?: string
  className?: string
}

export function Loading({ text = 'Memuat...', className = '' }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  )
}
