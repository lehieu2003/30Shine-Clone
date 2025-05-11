import { createContext, useContext, useState } from 'react'
import { Toast } from './toast'

interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

interface ToastContextType {
  toast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastOptions[]>([])

  const toast = (options: ToastOptions) => {
    setToasts((prev) => [...prev, options])
  }

  const removeToast = (index: number) => {
    setToasts((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-4">
        {toasts.map((t, i) => (
          <Toast key={i} {...t} onClose={() => removeToast(i)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
} 