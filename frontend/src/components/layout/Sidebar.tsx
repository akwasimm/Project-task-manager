// src/components/layout/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  LogOut,
  Briefcase,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className='sidebar'>
      {/* Logo */}
      <div className='sidebar__logo'>
        <Briefcase size={22} color='var(--primary)' />
        <span>ProjectHub</span>
      </div>

      {/* Nav Links */}
      <nav className='sidebar__nav'>
        <NavLink to='/' end className='sidebar__link'>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to='/projects' className='sidebar__link'>
          <FolderKanban size={18} />
          <span>Projects</span>
        </NavLink>

        <NavLink to='/tasks' className='sidebar__link'>
          <CheckSquare size={18} />
          <span>My Tasks</span>
        </NavLink>

        {/* Admin only */}
        {user?.role === 'admin' && (
          <NavLink to='/users' className='sidebar__link'>
            <Users size={18} />
            <span>Users</span>
          </NavLink>
        )}
      </nav>

      {/* User Info + Logout */}
      <div className='sidebar__footer'>
        <div className='sidebar__user'>
          <div className='sidebar__avatar'>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className='sidebar__user-info'>
            <span className='sidebar__user-name'>{user?.name}</span>
            <span className='sidebar__user-role'>{user?.role}</span>
          </div>
        </div>

        <button className='sidebar__logout' onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar