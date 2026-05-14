import { X } from 'lucide-react'
import './Toast.css'

export interface ToastData {
  id: string
  type: 'success' | 'error'
  message: string
}

interface Props {
  toasts: ToastData[]
  removeToast: (id: string) => void
}

const Toast = ({ toasts, removeToast }: Props) => {
  return (
    <div className='toast-container'>
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <span>{toast.message}</span>
          <button
            className='toast__close'
            onClick={() => removeToast(toast.id)}
            aria-label='Close'
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast