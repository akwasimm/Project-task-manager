// src/components/common/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className='flex-center' style={{ height: '100vh' }}>
        <LoadingSpinner size='large' />
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
}

export default ProtectedRoute