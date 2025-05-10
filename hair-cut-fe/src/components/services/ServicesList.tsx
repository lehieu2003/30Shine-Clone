import { useQuery } from '@tanstack/react-query'
import { Clock, Edit, Trash2 } from 'lucide-react'
import dayjs from 'dayjs'
import type { Service } from '@/types/service'
import { fetchServices } from '@/lib/api/services'
import { Button } from '@/components/ui/button'

interface ServicesListProps {
  searchQuery: string
  currentPage: number
  sortBy: string
  sortDirection: string
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
  onPageChange: (page: number) => void
}

export function ServicesList({
  searchQuery,
  currentPage,
  sortBy,
  sortDirection,
  onEdit,
  onDelete,
  onPageChange,
}: ServicesListProps) {
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['services', searchQuery, currentPage, sortBy, sortDirection],
    queryFn: () =>
      fetchServices({
        keyword: searchQuery,
        page: currentPage,
        sortBy,
        sortDirection,
      }),
  })

  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm')
  }

  // Calculate pagination
  const totalPages = servicesData
    ? Math.ceil(servicesData.total / servicesData.size)
    : 0
  const services = servicesData?.data || []

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {isLoading ? (
        <div className="p-8 text-center">Đang tải dữ liệu...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service: Service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-12 w-16 rounded overflow-hidden bg-gray-100">
                      <img
                        src={service.bannerImageUrl || '/placeholder.svg'}
                        alt={service.serviceName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {service.serviceName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {service.estimatedTime} phút
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {formatPrice(service.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(service.createdAt || '')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {service.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(service)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(service)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Hiển thị{' '}
          {services.length > 0
            ? `${(currentPage - 1) * servicesData?.size + 1}-${Math.min(currentPage * servicesData?.size, servicesData?.total)}`
            : '0'}{' '}
          của {servicesData?.total || 0} dịch vụ
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          >
            Trước
          </Button>
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
            const pageNumber = idx + 1
            return (
              <Button
                key={pageNumber}
                variant="outline"
                size="sm"
                className={pageNumber === currentPage ? 'bg-blue-50' : ''}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            )
          })}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}
