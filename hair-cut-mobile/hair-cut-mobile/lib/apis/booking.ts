import apiClient from '@/lib/api';
export { BookingStatus } from '@/types/booking';

interface FetchUserBookingsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
  status?: string;
}

interface BookingCreateData {
  phoneNumber: string;
  appointmentDate: string;
  serviceIds: number[];
  notes?: string;
  employeeId: number;
  branchId: number;
}

export interface DashboardStats {
  todayBookingsCount: number;
  todayBookingsGrowth: number;
  todayRevenue: number;
  todayRevenueGrowth: number;
  newCustomersCount: number;
  newCustomersGrowth: number;
  averageServiceTime: number;
  averageServiceTimeGrowth: number;
}

export interface RecentActivity {
  id: string;
  message: string;
  timestamp: string;
  type: string;
}

export const bookingApi = {
  // Get booking by ID
  getBookingById: async (bookingId: string) => {
    try {
      const response = await apiClient.get(`/api/bookings/${bookingId}`);
      if (!response.data) {
        throw new Error('Invalid booking data received');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Create a new booking
  createBooking: async (bookingData: BookingCreateData) => {
    try {
      const response = await apiClient.post('/api/bookings', bookingData);
      if (!response.data) {
        throw new Error('Invalid booking data received');
      }
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
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
      };
      if (status) params.status = status;

      const response = await apiClient.get('/api/bookings/my-bookings', {
        params,
      });
      if (!response.data?.success) {
        throw new Error('Failed to fetch user bookings');
      }
      return response.data as {
        success: boolean;
        data: any[];
        meta: { total: number; page: number; size: number; totalPages: number };
      };
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },
};
