import apiClient from '@/lib/api';

export const branchEmployeeApi = {
  getEmployeesByBranchId: async (branchId: number): Promise<any> => {
    const response = await apiClient.get(
      `/api/branch-employees/branch/${branchId}/employees`
    );
    return response.data;
  },

  getBranchesByEmployeeId: async (employeeId: number): Promise<any> => {
    const response = await apiClient.get(
      `/api/branch-employees/employee/${employeeId}/branches`
    );
    return response.data;
  },

  getAllBranchEmployees: async (): Promise<any> => {
    const response = await apiClient.get('/api/branch-employees');
    return response.data;
  },

  getBranchEmployeeById: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/api/branch-employees/${id}`);
    return response.data;
  },
};
