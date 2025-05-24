import {
  BarChart3,
  Box,
  Building,
  Calendar,
  Home,
  LogOut,
  Menu,
  Scissors,
  User,
  Users,
  X,
} from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Props {
  open: boolean
  toggle: () => void
}
const SIDEBAR_ALL_ITEMS = [
  { href: '/admin', icon: <Home size={20} />, label: 'Dashboard' },
  {
    href: '/admin/bookings',
    icon: <Calendar size={20} />,
    label: 'Lịch hẹn',

    role: ['admin', 'receptionist', 'barber'],
  },
  {
    href: '/admin/services',
    icon: <Scissors size={20} />,
    label: 'Dịch vụ',
    role: ['admin'],
  },
  {
    href: '/admin/customers',
    icon: <Users size={20} />,
    label: 'Khách hàng',
    role: ['admin', 'receptionist'],
  },
  {
    href: '/admin/staff',
    icon: <User size={20} />,
    label: 'Nhân viên',
    role: ['admin'],
  },
  {
    href: '/admin/products/',
    icon: <Box size={20} />,
    label: 'Quản lý sản phẩm',
    role: ['admin'],
  },
  {
    href: '/admin/branches',
    icon: <Building size={20} />,
    label: 'Quản lý chi nhánh',
    role: ['admin'],
  },
  {
    href: '/admin/report',
    icon: <BarChart3 size={20} />,
    label: 'Báo cáo',
    role: ['admin'],
  },
]
export default function Sidebar({ open, toggle }: Props) {
  const { user, refreshUser } = useAuth()
  const role = user?.role
  const sidebarItems = React.useMemo(() => {
    return SIDEBAR_ALL_ITEMS.filter((item) => {
      if (!item.role) return true
      if (Array.isArray(item.role)) {
        return item.role.includes(role || '')
      }
      return item.role === role
    })
  }, [role])
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    refreshUser()
    navigate({
      to: '/',
    })
  }
  return (
    <div
      className={`bg-blue-900 text-white ${open ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-800">
        <div className="flex items-center">
          {open && (
            <span className="ml-3 font-bold text-xl">30Shine Admin</span>
          )}
        </div>
        <button onClick={toggle} className="text-white hover:text-blue-200">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-blue-800"
              >
                {item.icon}
                {open && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center text-white hover:text-blue-200"
        >
          <LogOut size={20} />
          {open && <span className="ml-3">Đăng xuất</span>}
        </button>
      </div>
    </div>
  )
}
