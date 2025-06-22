import type { BookingStatus } from '@/types/booking'
import apiClient from '@/lib/api'

export { BookingStatus } from '@/types/booking'

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

interface FetchUserBookingsParams {
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: string
  status?: string
}

interface BookingCreateData {
  phoneNumber: string
  appointmentDate: string
  serviceIds: Array<number>
  notes?: string
  employeeId: number
  branchId: number
}

export interface DashboardStats {
  todayBookingsCount: number
  todayBookingsGrowth: number
  todayRevenue: number
  todayRevenueGrowth: number
  newCustomersCount: number
  newCustomersGrowth: number
  averageServiceTime: number
  averageServiceTimeGrowth: number
}

export interface RecentActivity {
  id: string
  message: string
  timestamp: string
  type: string
}

export const bookingApi = {
  // Get all bookings (admin)
  getAllBookings: async ({
    keyword = '',
    page = 1,
    size = 10,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    employeeId,
    status,
    dateFrom,
    dateTo,
  }: FetchBookingsParams) => {
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
  },

  // Get booking by ID
  getBookingById: async (bookingId: string) => {
    try {
      const response = await apiClient.get(`/api/bookings/${bookingId}`)
      if (!response.data) {
        throw new Error('Invalid booking data received')
      }
      return response.data
    } catch (error) {
      console.error('Error fetching booking:', error)
      throw error
    }
  },

  // Create a new booking
  createBooking: async (bookingData: BookingCreateData) => {
    try {
      const response = await apiClient.post('/api/bookings', bookingData)
      if (!response.data) {
        throw new Error('Invalid booking data received')
      }
      return response.data
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  },

  // Update an existing booking
  updateBooking: async (
    bookingId: string,
    bookingData: Partial<BookingCreateData>,
  ) => {
    try {
      const response = await apiClient.put(
        `/api/bookings/${bookingId}`,
        bookingData,
      )
      if (!response.data) {
        throw new Error('Invalid booking data received')
      }
      return response.data
    } catch (error) {
      console.error('Error updating booking:', error)
      throw error
    }
  },

  // Delete a booking
  deleteBooking: async (bookingId: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/bookings/${bookingId}`)
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  },

  // Change booking status
  changeBookingStatus: async (bookingId: string, status: BookingStatus) => {
    try {
      const response = await apiClient.patch(
        `/api/bookings/${bookingId}/status`,
        {
          status,
        },
      )
      if (!response.data) {
        throw new Error('Invalid booking data received')
      }
      return response.data
    } catch (error) {
      console.error('Error changing booking status:', error)
      throw error
    }
  },

  // Get user's booking history
  getUserBookings: async ({
    page = 1,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'desc',
    status,
  }: FetchUserBookingsParams) => {
    try {
      const params: Record<string, any> = {
        page,
        size,
        sortBy,
        sortDirection,
      }
      if (status) params.status = status

      const response = await apiClient.get('/api/bookings/my-bookings', {
        params,
      })
      if (!response.data?.success) {
        throw new Error('Failed to fetch user bookings')
      }
      return response.data as {
        success: boolean
        data: Array<any>
        meta: { total: number; page: number; size: number; totalPages: number }
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw error
    }
  },

  // Get recent bookings
  getRecentBookings: async ({
    limit = 5,
    sortBy = 'appointmentDate',
    sortDirection = 'desc',
  }: {
    limit?: number
    sortBy?: string
    sortDirection?: string
  }) => {
    const params: Record<string, any> = {
      page: 1,
      size: limit,
      sortBy,
      sortDirection,
    }

    const response = await apiClient.get('/api/bookings', { params })
    return response.data as {
      data: Array<any>
      meta: { total: number; page: number; size: number }
    }
  },

  // Dashboard and reports
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/api/reports/dashboard')
    return response.data
  },

  getRecentActivities: async (limit = 5): Promise<Array<RecentActivity>> => {
    const response = await apiClient.get('/api/reports/activities', {
      params: { limit },
    })
    return Array.isArray(response.data) ? response.data : []
  },

  getRevenueByService: async (period: string) => {
    const response = await apiClient.get('/api/reports/service', {
      params: { period },
    })
    return response.data
  },

  getBookingsByDate: async (period: string) => {
    const response = await apiClient.get('/api/reports/monthly', {
      params: { period },
    })
    return response.data
  },
}

// Legacy exports for backward compatibility
export const fetchBookings = bookingApi.getAllBookings
export const createBooking = bookingApi.createBooking
export const deleteBooking = bookingApi.deleteBooking
export const getBookingById = bookingApi.getBookingById
export const updateBooking = bookingApi.updateBooking
export const changeBookingStatus = bookingApi.changeBookingStatus
export const fetchUserBookings = bookingApi.getUserBookings
export const fetchRecentBookings = bookingApi.getRecentBookings
export const fetchDashboardStats = bookingApi.getDashboardStats
export const fetchRecentActivities = bookingApi.getRecentActivities
export const fetchRevenueByService = bookingApi.getRevenueByService
export const fetchBookingsByDate = bookingApi.getBookingsByDate
