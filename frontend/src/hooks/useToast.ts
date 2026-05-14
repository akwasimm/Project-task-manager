// src/hooks/useToast.ts
import { useState, useCallback } from 'react'
import type { ToastData } from '../components/common/Toast'

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback(
    (type: 'success' | 'error', message: string) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, type, message }])
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = (message: string) => addToast('success', message)
  const error   = (message: string) => addToast('error', message)

  return { toasts, removeToast, success, error }
}