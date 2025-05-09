// /src/routes/admin-services/api/services.ts
import apiClient from '@/lib/api'

interface FetchServicesParams {
  keyword?: string
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: string
}

export async function fetchServices({
  keyword = '',
  page = 1,
  size = 10,
  sortBy = 'createdAt',
  sortDirection = 'desc',
}: FetchServicesParams) {
  const response = await apiClient.get('/api/services', {
    params: { keyword, page, size, sortBy, sortDirection },
  })
  return response.data
}

export async function createService(serviceData: any) {
  console.log('serviceData', serviceData)
  const response = await apiClient.post('/api/services', serviceData)
  return response.data
}

export async function deleteService(serviceId: string) {
  const response = await apiClient.delete(`/api/services/${serviceId}`)
  return response.data
}

export async function getServiceById(serviceId: string) {
  const response = await apiClient.get(`/api/services/${serviceId}`)
  return response.data
}

export async function updateService(serviceId: string, serviceData: any) {
  const response = await apiClient.patch(
    `/api/services/${serviceId}`,
    serviceData,
  )
  return response.data
}
