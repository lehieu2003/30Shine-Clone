import apiClient from '@/lib/api'

const axios = apiClient

export interface MonthlyRevenueEntry {
  month: string
  total: number
  count: number
}

export interface ServiceRevenueEntry {
  service: string
  total: number
  count: number
}

export interface RevenueFilter {
  year?: number
  from?: string
  to?: string
  employeeId?: number
  serviceId?: number
}

export async function getMonthlyRevenue(
  filters: RevenueFilter = { year: new Date().getFullYear() },
): Promise<Array<MonthlyRevenueEntry>> {
  const response = await axios.get<Array<MonthlyRevenueEntry>>(
    '/api/reports/monthly',
    {
      params: filters,
    },
  )
  return response.data
}

export async function getRevenueByService(
  filters: RevenueFilter = { year: new Date().getFullYear() },
): Promise<Array<ServiceRevenueEntry>> {
  const response = await axios.get<Array<ServiceRevenueEntry>>(
    '/api/reports/service',
    {
      params: filters,
    },
  )
  return response.data
}
