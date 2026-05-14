// src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import './Layout.css'

const Layout = () => {
  return (
    <div className='layout'>
      <Sidebar />
      <div className='layout__main'>
        <Navbar />
        <main className='layout__content'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout