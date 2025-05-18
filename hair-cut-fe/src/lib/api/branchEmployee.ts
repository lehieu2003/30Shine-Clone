import apiClient from '@/lib/api'

export const branchEmployeeApi = {
  getEmployeesByBranchId: async (branchId: number): Promise<any> => {
    const response = await apiClient.get(
      `/api/branch-employees/branch/${branchId}/employees`,
    )
    return response.data
  },

  getBranchesByEmployeeId: async (employeeId: number): Promise<any> => {
    const response = await apiClient.get(
      `/api/branch-employees/employee/${employeeId}/branches`,
    )
    return response.data
  },

  getAllBranchEmployees: async (): Promise<any> => {
    const response = await apiClient.get('/api/branch-employees')
    return response.data
  },

  getBranchEmployeeById: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/api/branch-employees/${id}`)
    return response.data
  },

  createBranchEmployee: async (data: any): Promise<any> => {
    const response = await apiClient.post('/api/branch-employees', data)
    return response.data
  },

  updateBranchEmployee: async (id: number, data: any): Promise<any> => {
    const response = await apiClient.put(`/api/branch-employees/${id}`, data)
    return response.data
  },

  deleteBranchEmployee: async (id: number): Promise<any> => {
    const response = await apiClient.delete(`/api/branch-employees/${id}`)
    return response.data
  },
}
