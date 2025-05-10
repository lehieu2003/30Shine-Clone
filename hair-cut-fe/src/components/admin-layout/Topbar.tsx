import { Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Topbar() {
  const { user } = useAuth()
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center w-72"></div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-blue-600">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <div className="flex items-center">
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-700">
                {user?.fullName}
              </div>
              <div className="text-xs text-gray-500">
                {roleDisplay(user?.role)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
function roleDisplay(role?: string) {
  switch (role) {
    case 'admin':
      return 'Quản lý'
    case 'receptionist':
      return 'Lễ tân'
    case 'barber':
      return 'Thợ cắt tóc'
    case 'customer':
      return 'Khách hàng'
    default:
      return 'Khách hàng'
  }
}
