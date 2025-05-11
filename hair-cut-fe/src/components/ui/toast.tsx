import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  onClose: () => void
}

export function Toast({ title, description, variant = 'default', onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex w-full max-w-sm items-center justify-between rounded-lg p-4 shadow-lg transition-all duration-300',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
        variant === 'default' ? 'bg-white text-gray-900' : 'bg-red-600 text-white'
      )}
    >
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="ml-4 rounded-full p-1 hover:bg-gray-100 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
} 