// src/components/layout/Navbar.tsx
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

const pageTitles: Record<string, string> = {
  '/':        'Dashboard',
  '/projects': 'Projects',
  '/tasks':   'My Tasks',
  '/users':   'Users',
}

const Navbar = () => {
  const { user } = useAuth()
  const location = useLocation()

  // Handle /projects/:id
  const title = location.pathname.startsWith('/projects/')
    ? 'Project Details'
    : pageTitles[location.pathname] || 'ProjectHub'

  return (
    <header className='navbar'>
      <div className='navbar__left'>
        <h1 className='navbar__title'>{title}</h1>
      </div>
      <div className='navbar__right'>
        <span className='navbar__welcome'>
          Welcome, <strong>{user?.name}</strong>
        </span>
        <span className={`navbar__role navbar__role--${user?.role}`}>
          {user?.role}
        </span>
      </div>
    </header>
  )
}

export default Navbar