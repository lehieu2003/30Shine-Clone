import apiClient from '@/lib/api'

export interface User {
  id: number
  fullName: string
  email: string
  phone: string
  role: Array<'admin' | 'receptionist' | 'barber' | 'customer'>
  status: 'active' | 'inactive'
  gender?: boolean
  address?: string
  birthDate?: string
  CCCD?: string
  availabilityStatus?: 'available' | 'unavailable'
  createdAt?: string
}

export interface FetchUsersParams {
  keyword?: string
  page?: number
  size?: number
  sortBy?: 'fullName' | 'id'
  sortDirection?: 'asc' | 'desc'
  role?: Array<User['role']>
  status?: User['status']
  availabilityStatus?: User['availabilityStatus']
}

export async function fetchUsers({
  keyword = '',
  page = 1,
  size = 10,
  sortBy = 'id',
  sortDirection = 'desc',
  role,
  status,
  availabilityStatus,
}: FetchUsersParams) {
  const response = await apiClient.get('/api/users', {
    params: {
      keyword,
      page,
      size,
      sortBy,
      sortDirection,
      role,
      status,
      availabilityStatus,
    },
  })
  return response.data as {
    data: Array<any>
    total: number
    page: number
    size: number
  }
}

export async function getUserById(userId: number) {
  const response = await apiClient.get(`/api/users/${userId}`)
  return response.data
}

export async function createUser(
  userData: Partial<User> & { password: string },
) {
  const response = await apiClient.post('/api/users', userData)
  return response.data
}

export async function updateUser(userId: number, userData: Partial<User>) {
  const response = await apiClient.put(`/api/users/${userId}`, userData)
  return response.data
}

export async function deleteUser(userId: number) {
  const response = await apiClient.delete(`/api/users/${userId}`)
  return response.data
}

export async function toggleAvailabilityStatus(userId: number) {
  const response = await apiClient.patch(
    `/api/users/${userId}/toggle-availability-status`,
  )
  return response.data
}

export async function toggleActiveStatus(userId: number) {
  const response = await apiClient.patch(`/api/users/${userId}/toggle-status`)
  return response.data
}
