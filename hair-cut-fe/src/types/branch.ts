export interface Branch {
  id: number
  name: string
  address: string
  phone?: string | null
  email?: string | null
  description?: string | null
  imageUrl?: string | null
  latitude?: number | null
  longitude?: number | null
  isActive: boolean
  createdAt: string
  updatedAt?: string
  employees?: Array<any>
  bookings?: Array<any>
  inventory?: Array<any>
  expenses?: Array<any>
  schedules?: Array<any>
  BranchService?: Array<any>
  InventoryTransaction?: Array<any>
}

export interface BranchParams {
  keyword?: string
  page?: number
  size?: number
  sortBy?: 'id' | 'name' | 'createdAt' | 'updatedAt'
  sortDirection?: 'asc' | 'desc'
  isActive?: boolean
}

export interface BranchFormData {
  name: string
  address: string
  phone?: string
  email?: string | null
  description?: string | null
  imageUrl?: string | null
  latitude?: number | null
  longitude?: number | null
  isActive?: boolean
}

export interface BranchResponse {
  data: Array<Branch>
  meta: {
    total: number
    page: number
    size: number
  }
}

export interface BranchResponse {
  data: Array<Branch>
  meta: {
    total: number
    page: number
    size: number
  }
}
