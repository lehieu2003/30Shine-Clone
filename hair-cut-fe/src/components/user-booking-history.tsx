import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, Clock, Eye, FileText, MapPin, User } from 'lucide-react'
import { bookingApi } from '@/lib/api/bookings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatDateTime, formatPrice } from '@/lib/formatters'
import { formatMinutes } from '@/lib/duration'

type Status =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'in_progress'
  | 'completed'
  | 'success'

const StatusBadge = ({ status }: { status: Status }) => {
  const getStatusClasses = (bookingStatus: Status): string => {
    const baseClasses = 'text-xs px-2 py-1 rounded-full font-medium'

    switch (bookingStatus) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`
      case 'confirmed':
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`
      case 'in_progress':
        return `${baseClasses} bg-purple-100 text-purple-800 border border-purple-200`
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
      case 'success':
        return `${baseClasses} bg-emerald-100 text-emerald-800 border border-emerald-200`
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`
    }
  }

  const getStatusLabel = (bookingStatus: Status): string => {
    switch (bookingStatus) {
      case 'pending':
        return 'Chờ xác nhận'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'in_progress':
        return 'Đang thực hiện'
      case 'completed':
        return 'Hoàn thành'
      case 'success':
        return 'Thành công'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return 'Không xác định'
    }
  }

  return (
    <span className={getStatusClasses(status)}>{getStatusLabel(status)}</span>
  )
}

const BookingDetailDialog = ({ booking }: { booking: any }) => {
  const totalDuration = booking.services?.reduce(
    (sum: number, service: any) => sum + (service.service?.estimatedTime || 0),
    0,
  )

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Chi tiết lịch hẹn #{booking.id}</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Ngày hẹn</span>
            </div>
            <p className="text-sm">{formatDateTime(booking.appointmentDate)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Trạng thái</span>
            </div>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* Thông tin chi nhánh */}
        {booking.branch && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Chi nhánh</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">{booking.branch.name}</p>
              <p className="text-muted-foreground">{booking.branch.address}</p>
              {booking.branch.phone && (
                <p className="text-muted-foreground">
                  SĐT: {booking.branch.phone}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Thông tin nhân viên */}
        {booking.employee && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Nhân viên phục vụ</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">{booking.employee.fullName}</p>
              <p className="text-muted-foreground">
                SĐT: {booking.employee.phone}
              </p>
            </div>
          </div>
        )}

        {/* Danh sách dịch vụ */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Dịch vụ đã đặt</h4>
          <div className="space-y-2">
            {booking.services?.map((bookingService: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {bookingService.service?.serviceName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Thời gian:{' '}
                    {formatMinutes(bookingService.service?.estimatedTime || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatPrice(bookingService.service?.price || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tổng kết */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Tổng thời gian:</span>
            <span className="text-sm font-medium">
              {formatMinutes(totalDuration)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Tổng tiền:</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(booking.totalPrice)}
            </span>
          </div>
        </div>

        {/* Ghi chú */}
        {booking.notes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Ghi chú</span>
            </div>
            <p className="text-sm text-muted-foreground">{booking.notes}</p>
          </div>
        )}
      </div>
    </DialogContent>
  )
}

export default function UserBookingHistory() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const pageSize = 10

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user-bookings', currentPage, statusFilter],
    queryFn: () =>
      bookingApi.getUserBookings({
        page: currentPage,
        size: pageSize,
        status: statusFilter === 'all' ? undefined : statusFilter,
        sortBy: 'appointmentDate',
        sortDirection: 'desc',
      }),
  })

  const bookings = data?.data || []
  const meta = data?.meta

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Đang tải lịch sử đặt lịch...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-destructive">Có lỗi xảy ra khi tải dữ liệu</p>
          <Button onClick={() => refetch()} className="mt-2">
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Lịch sử đặt lịch</h1>
          <p className="text-muted-foreground">
            Xem lại các lịch hẹn bạn đã đặt tại salon
          </p>
        </div>

        {/* Bộ lọc */}
        <div className="mb-6 flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="in_progress">Đang thực hiện</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="success">Thành công</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Danh sách đặt lịch */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Chưa có lịch hẹn nào
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Bạn chưa đặt lịch hẹn nào. Hãy đặt lịch ngay để trải nghiệm
                  dịch vụ của chúng tôi!
                </p>
                <Button onClick={() => (window.location.href = '/booking')}>
                  Đặt lịch ngay
                </Button>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking: any) => (
              <Card
                key={booking.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Lịch hẹn #{booking.id}
                    </CardTitle>
                    <StatusBadge status={booking.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDateTime(booking.appointmentDate)}</span>
                      </div>

                      {booking.branch && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.branch.name}</span>
                        </div>
                      )}

                      {booking.employee && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.employee.fullName}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Dịch vụ: </span>
                        <span>{booking.services?.length || 0} dịch vụ</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Tổng tiền: </span>
                        <span className="text-primary font-bold">
                          {formatPrice(booking.totalPrice)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Đặt lúc: {formatDateTime(booking.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </DialogTrigger>
                      <BookingDetailDialog booking={booking} />
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Phân trang */}
        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Trang trước
            </Button>

            <span className="text-sm text-muted-foreground">
              Trang {currentPage} / {meta.totalPages} ({meta.total} lịch hẹn)
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(meta.totalPages, currentPage + 1))
              }
              disabled={currentPage === meta.totalPages}
            >
              Trang sau
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
