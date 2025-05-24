import type {
  Branch,
  BranchFormData,
  BranchResponse,
} from '../../types/branch.ts'

import apiClient from '@/lib/api'

// Branch API calls
const branchApi = {
  // Get all branches with pagination and filtering
  getBranches: async (params?: {
    keyword?: string
    page?: number
    size?: number
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    isActive?: boolean
  }): Promise<BranchResponse> => {
    const response = await apiClient.get('/api/branches', { params })
    return response.data
  },

  // Get a specific branch by ID
  getBranchById: async (id: number | string): Promise<Branch> => {
    const response = await apiClient.get(`/api/branches/${id}`)
    return response.data
  },

  // Create a new branch
  createBranch: async (data: BranchFormData): Promise<Branch> => {
    const response = await apiClient.post('/api/branches', data)
    return response.data
  },

  // Update an existing branch
  updateBranch: async (
    id: number | string,
    data: Partial<BranchFormData>,
  ): Promise<Branch> => {
    const response = await apiClient.put(`/api/branches/${id}`, data)
    return response.data
  },

  // Delete a branch
  deleteBranch: async (id: number | string): Promise<void> => {
    await apiClient.delete(`/api/branches/${id}`)
  },
}

export default branchApi
