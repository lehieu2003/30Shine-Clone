import { createFileRoute } from '@tanstack/react-router'

import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

export default function AdminDashboard() {
  const { user } = useAuth()
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Chào mừng trở lại,
          {user?.fullName}!
        </p>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tổng lịch hẹn hôm nay</p>
              <h3 className="text-3xl font-bold text-gray-800">42</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 flex items-center">
            <span>+12% so với hôm qua</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Doanh thu hôm nay</p>
              <h3 className="text-3xl font-bold text-gray-800">8.5M</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 flex items-center">
            <span>+8% so với hôm qua</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Khách hàng mới</p>
              <h3 className="text-3xl font-bold text-gray-800">15</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 flex items-center">
            <span>+5% so với tuần trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Thời gian trung bình</p>
              <h3 className="text-3xl font-bold text-gray-800">45 phút</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-red-600 flex items-center">
            <span>+3 phút so với tuần trước</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Doanh thu theo dịch vụ
            </h3>
            <select className="text-sm border rounded-md px-2 py-1">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
              <option>Quý này</option>
            </select>
          </div>
          <div className="h-80 flex items-center justify-center">
            <PieChart className="h-64 w-64 text-gray-300" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Lịch hẹn theo ngày
            </h3>
            <select className="text-sm border rounded-md px-2 py-1">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
              <option>Quý này</option>
            </select>
          </div>
          <div className="h-80 flex items-center justify-center">
            <BarChart3 className="h-64 w-64 text-gray-300" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Lịch hẹn gần đây
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Thêm lịch hẹn
          </Button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Nguyễn Văn A
                        </div>
                        <div className="text-sm text-gray-500">0987654321</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Cắt gội Combo 2</div>
                    <div className="text-sm text-gray-500">55 phút</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">24/04/2025</div>
                    <div className="text-sm text-gray-500">10:30 AM</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Trần Văn B
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Đã xác nhận
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Chi tiết
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Hủy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t">
          <a
            href="/admin/bookings"
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            Xem tất cả lịch hẹn
          </a>
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
            {[1, 2, 3, 4, 5].map((item) => (
              <li key={item} className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    Nguyễn Văn A đã đặt lịch cắt tóc
                  </div>
                  <div className="text-sm text-gray-500">2 giờ trước</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-6 py-4 border-t">
          <a
            href="/admin/activities"
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            Xem tất cả hoạt động
          </a>
        </div>
      </div> */}
    </>
  )
}
