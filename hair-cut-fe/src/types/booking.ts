export enum BookingStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
  in_progress = 'in_progress',
  completed = 'completed',
  success = 'success',
}

export interface BookingService {
  id: number
  bookingId: number
  serviceId: number
  servicePrice: number
  service: {
    id: number
    serviceName: string
    price: number
    estimatedTime: number
  }
}

export interface Employee {
  id: number
  fullName: string
  phone: string
  email?: string
}

export interface Branch {
  id: number
  name: string
  address: string
  phone?: string
  email?: string
}

export interface Customer {
  id: number
  fullName: string
  phone: string
  email?: string
  CCCD?: string
}

export interface Booking {
  id: number
  customerId: number
  appointmentDate: string
  employeeId?: number
  branchId: number
  notes?: string
  status: BookingStatus
  totalPrice: number
  estimatedDuration?: number
  createdAt: string
  updatedAt: string
  customer: Customer
  employee?: Employee
  branch: Branch
  services: Array<BookingService>
}

export interface BookingCreateData {
  phoneNumber: string
  appointmentDate: string
  serviceIds: Array<number>
  notes?: string
  employeeId?: number
  branchId: number
}

export interface BookingUpdateData extends Partial<BookingCreateData> {
  status?: BookingStatus
}

export interface BookingQuery {
  keyword?: string
  page?: number
  size?: number
  sortBy?:
    | 'id'
    | 'appointmentDate'
    | 'status'
    | 'totalPrice'
    | 'createdAt'
    | 'updatedAt'
  sortDirection?: 'asc' | 'desc'
  employeeId?: number
  status?: BookingStatus
  dateFrom?: string
  dateTo?: string
}

export interface UserBookingQuery {
  page?: number
  size?: number
  sortBy?: 'appointmentDate' | 'status' | 'totalPrice' | 'createdAt'
  sortDirection?: 'asc' | 'desc'
  status?: BookingStatus
}

export interface BookingResponse {
  data: Array<Booking>
  meta: {
    total: number
    page: number
    size: number
    totalPages?: number
  }
}

export interface UserBookingResponse {
  success: boolean
  data: Array<Booking>
  meta: {
    total: number
    page: number
    size: number
    totalPages: number
  }
}
