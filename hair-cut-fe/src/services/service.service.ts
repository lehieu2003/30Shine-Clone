import axios from 'axios'
import z from 'zod'

export interface Service {
  id: number
  serviceName: string
  estimatedTime: number
  price: string
  createdAt: string
  steps: Array<Step>
  description: string
  bannerImageUrl: string
}

export interface Step {
  id: number
  serviceId: number
  stepOrder: number
  stepTitle: string
  stepDescription: string
  stepImageUrl: string
}

const querySchema = z.object({
  keyword: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  size: z.coerce.number().min(1).max(50).optional(),
  sortBy: z.enum(['serviceName', 'price', 'createdAt']).default('createdAt'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
})

function queryServices(query: z.infer<typeof querySchema>) {
  return axios.request<{
    data: Array<Service>
    page: number
    size: number
    total: number
  }>({
    method: 'GET',
    url: '/api/services',
    params: query,
  })
}

function getServiceById(id: number) {
  return axios.request<Service>({
    method: 'GET',
    url: `/api/services/${id}`,
  })
}
export default {
  queryServices,
  getServiceById,
}
