// src/components/common/ErrorMessage.tsx
import { AlertCircle } from 'lucide-react'
import './ErrorMessage.css'

interface Props {
  message?: string
}

const ErrorMessage = ({ message = 'Something went wrong' }: Props) => {
  return (
    <div className='error-message'>
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  )
}

export default ErrorMessage