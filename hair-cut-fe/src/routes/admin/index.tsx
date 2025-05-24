import { Link, createFileRoute } from '@tanstack/react-router'
import {
  BarChart3,
  Calendar,
  ClipboardList,
  Clock,
  DollarSign,
  PieChart,
  Users,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  fetchBookingsByDate,
  fetchDashboardStats,
  fetchRecentActivities,
  fetchRecentBookings,
  fetchRevenueByService,
} from '@/lib/api/bookings'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatters'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

export default function AdminDashboard() {
  const { user } = useAuth()
  const [revenuePeriod, setRevenuePeriod] = useState('7days')
  const [bookingsPeriod, setBookingsPeriod] = useState('7days')

  // Fetch dashboard statistics
  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    select: (data) => data.data,
  })

  // Fetch recent bookings
  const { data: recentBookings } = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: () =>
      fetchRecentBookings({
        limit: 5,
        sortBy: 'appointmentDate',
        sortDirection: 'asc',
      }),
    select: (data) => data.data,
  })

  // Fetch recent activities
  const { data: recentActivities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: () => fetchRecentActivities(5),
    select: (data) => data.data,
  })

  // Fetch revenue by service data
  const { data: revenueByService } = useQuery({
    queryKey: ['revenue-by-service', revenuePeriod],
    queryFn: () => fetchRevenueByService(revenuePeriod),
    select: (data) => data.data,
  })

  // Fetch bookings by date
  const { data: bookingsByDate } = useQuery({
    queryKey: ['bookings-by-date', bookingsPeriod],
    queryFn: () => fetchBookingsByDate(bookingsPeriod),
    select: (data) => data.data,
  })

  const handleRevenuePeriodChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRevenuePeriod(event.target.value)
  }

  const handleBookingsPeriodChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setBookingsPeriod(event.target.value)
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Chào mừng trở lại, {user?.fullName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tổng lịch hẹn hôm nay</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {statsData?.todayBookingsCount || 0}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div
            className={`mt-4 text-sm ${
              statsData?.todayBookingsGrowth &&
              statsData.todayBookingsGrowth >= 0
                ? 'text-green-600'
                : 'text-red-600'
            } flex items-center`}
          >
            <span>
              {statsData?.todayBookingsGrowth
                ? (statsData.todayBookingsGrowth >= 0 ? '+' : '') +
                  statsData.todayBookingsGrowth +
                  '%'
                : '0%'}{' '}
              so với hôm qua
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Doanh thu hôm nay</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {statsData?.todayRevenue
                  ? formatCurrency(statsData.todayRevenue)
                  : '0'}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div
            className={`mt-4 text-sm ${
              statsData?.todayRevenueGrowth && statsData.todayRevenueGrowth >= 0
                ? 'text-green-600'
                : 'text-red-600'
            } flex items-center`}
          >
            <span>
              {statsData?.todayRevenueGrowth
                ? (statsData.todayRevenueGrowth >= 0 ? '+' : '') +
                  statsData.todayRevenueGrowth +
                  '%'
                : '0%'}{' '}
              so với hôm qua
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Khách hàng mới</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {statsData?.newCustomersCount || 0}
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div
            className={`mt-4 text-sm ${
              statsData?.newCustomersGrowth && statsData.newCustomersGrowth >= 0
                ? 'text-green-600'
                : 'text-red-600'
            } flex items-center`}
          >
            <span>
              {statsData?.newCustomersGrowth
                ? (statsData.newCustomersGrowth >= 0 ? '+' : '') +
                  statsData.newCustomersGrowth +
                  '%'
                : '0%'}{' '}
              so với tuần trước
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Thời gian trung bình</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {statsData?.averageServiceTime || 0} phút
              </h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div
            className={`mt-4 text-sm ${
              statsData?.averageServiceTimeGrowth &&
              statsData.averageServiceTimeGrowth <= 0
                ? 'text-green-600'
                : 'text-red-600'
            } flex items-center`}
          >
            <span>
              {statsData?.averageServiceTimeGrowth
                ? (statsData.averageServiceTimeGrowth > 0 ? '+' : '') +
                  statsData.averageServiceTimeGrowth +
                  ' phút'
                : '0 phút'}{' '}
              so với tuần trước
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Doanh thu theo dịch vụ
            </h3>
            <select
              className="text-sm border rounded-md px-2 py-1"
              value={revenuePeriod}
              onChange={handleRevenuePeriodChange}
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="quarter">Quý này</option>
            </select>
          </div>
          <div className="h-80 flex items-center justify-center">
            {revenueByService ? (
              // Replace with your chart component using revenueByService data
              <PieChart className="h-64 w-64 text-gray-300" />
            ) : (
              <div className="text-gray-500">Đang tải dữ liệu...</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Lịch hẹn theo ngày
            </h3>
            <select
              className="text-sm border rounded-md px-2 py-1"
              value={bookingsPeriod}
              onChange={handleBookingsPeriodChange}
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="quarter">Quý này</option>
            </select>
          </div>
          <div className="h-80 flex items-center justify-center">
            {bookingsByDate ? (
              // Replace with your chart component using bookingsByDate data
              <BarChart3 className="h-64 w-64 text-gray-300" />
            ) : (
              <div className="text-gray-500">Đang tải dữ liệu...</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Lịch hẹn gần đây
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày giờ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stylist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                          {booking.customer.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customer.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customer.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.services && booking.services.length > 0
                          ? booking.services[0].service.serviceName +
                            (booking.services.length > 1
                              ? ` +${booking.services.length - 1} dịch vụ khác`
                              : '')
                          : 'Không có dịch vụ'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDateTime(booking.totalPrice)} VND
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.appointmentDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.appointmentDate).toLocaleTimeString(
                          'vi-VN',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.employee
                        ? booking.employee.fullName
                        : 'Chưa phân công'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : ''
                        }
                        ${
                          booking.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : ''
                        }
                        ${
                          booking.status === 'in_progress'
                            ? 'bg-purple-100 text-purple-800'
                            : ''
                        }
                        ${
                          booking.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : ''
                        }
                        ${
                          booking.status === 'success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ''
                        }
                        ${
                          booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : ''
                        }`}
                      >
                        {booking.status === 'pending' && 'Chờ xác nhận'}
                        {booking.status === 'confirmed' && 'Đã xác nhận'}
                        {booking.status === 'in_progress' && 'Đang thực hiện'}
                        {booking.status === 'completed' && 'Hoàn thành'}
                        {booking.status === 'success' && 'Thành công'}
                        {booking.status === 'cancelled' && 'Đã hủy'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không có lịch hẹn gần đây
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t">
          <Link
            to="/admin/bookings"
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            Xem tất cả lịch hẹn
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Hoạt động gần đây
          </h3>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map(
                (activity: {
                  id: string
                  message: string
                  timestamp: string
                }) => (
                  <li key={activity.id} className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDateTime(activity.timestamp)}
                      </div>
                    </div>
                  </li>
                ),
              )
            ) : (
              <li className="text-center text-gray-500">
                Không có hoạt động gần đây
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  )
}
