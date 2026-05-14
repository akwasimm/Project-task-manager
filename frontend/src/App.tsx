// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout
import Layout from './components/layout/Layout'

// Auth Pages
import LoginPage from './pages/LoginPage/LoginPage'
import SignupPage from './pages/SignupPage/SignupPage'

// App Pages
import DashboardPage from './pages/DashboardPage/DashboardPage'
import ProjectsPage from './pages/ProjectsPage/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage/ProjectDetailPage'
import TasksPage from './pages/TasksPage/TasksPage'
import UsersPage from './pages/UsersPage/UsersPage'

// Protected Route
import ProtectedRoute from './components/common/ProtectedRoute'

// Loading Spinner
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoadingSpinner size='large' />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/login'  element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path='/'            element={<DashboardPage />} />
          <Route path='/projects'    element={<ProjectsPage />} />
          <Route path='/projects/:id' element={<ProjectDetailPage />} />
          <Route path='/tasks'       element={<TasksPage />} />
          <Route path='/users'       element={<UsersPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default App