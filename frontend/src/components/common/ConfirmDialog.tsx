// src/components/common/ConfirmDialog.tsx
import { AlertTriangle } from 'lucide-react'
import './ConfirmDialog.css'

interface Props {
  isOpen:    boolean
  title:     string
  message:   string
  onConfirm: () => void
  onCancel:  () => void
  isLoading?: boolean
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
}: Props) => {
  if (!isOpen) return null

  return (
    <div className='dialog-overlay' onClick={onCancel}>
      <div
        className='dialog'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='dialog__icon'>
          <AlertTriangle size={24} color='var(--danger)' />
        </div>
        <h3 className='dialog__title'>{title}</h3>
        <p className='dialog__message'>{message}</p>
        <div className='dialog__actions'>
          <button
            className='btn btn-secondary'
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className='btn btn-danger'
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog