// src/components/common/LoadingSpinner.tsx
import './LoadingSpinner.css'

interface Props {
  size?: 'small' | 'medium' | 'large'
}

const LoadingSpinner = ({ size = 'medium' }: Props) => {
  return (
    <div className={`spinner spinner--${size}`}>
      <div className='spinner__circle'></div>
    </div>
  )
}

export default LoadingSpinner