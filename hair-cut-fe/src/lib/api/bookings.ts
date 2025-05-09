import apiClient from '@/lib/api'

interface FetchBookingsParams {
  keyword?: string
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: string
  employeeId?: number
  status?: string
  dateFrom?: string
  dateTo?: string
}

export async function fetchBookings({
  keyword = '',
  page = 1,
  size = 10,
  sortBy = 'createdAt',
  sortDirection = 'desc',
  employeeId,
  status,
  dateFrom,
  dateTo,
}: FetchBookingsParams) {
  const params: Record<string, any> = {
    keyword,
    page,
    size,
    sortBy,
    sortDirection,
  }
  if (employeeId !== undefined) params.employeeId = employeeId
  if (status) params.status = status
  if (dateFrom) params.dateFrom = dateFrom
  if (dateTo) params.dateTo = dateTo

  const response = await apiClient.get('/api/bookings', { params })
  return response.data as {
    data: Array<any>
    meta: { total: number; page: number; size: number }
  }
}

interface BookingCreateData {
  phoneNumber: string
  appointmentDate: string
  serviceIds: Array<number>
  notes?: string
  employeeId?: number
}

export async function createBooking(bookingData: BookingCreateData) {
  const response = await apiClient.post('/api/bookings', bookingData)
  return response.data
}

export async function deleteBooking(bookingId: string) {
  const response = await apiClient.delete(`/api/bookings/${bookingId}`)
  return response.data
}

export async function getBookingById(bookingId: string) {
  const response = await apiClient.get(`/api/bookings/${bookingId}`)
  return response.data
}

export async function updateBooking(bookingId: string, bookingData: any) {
  const response = await apiClient.put(
    `/api/bookings/${bookingId}`,
    bookingData,
  )
  return response.data
}
export enum BookingStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
  in_progress = 'in_progress',
  completed = 'completed',
  success = 'success',
}
export async function changeBookingStatus(
  bookingId: string,
  status: BookingStatus,
) {
  const response = await apiClient.patch(`/api/bookings/${bookingId}/status`, {
    status,
  })
  return response.data
}
