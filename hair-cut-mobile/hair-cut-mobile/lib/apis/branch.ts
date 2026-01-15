import type { Branch, BranchResponse } from '../../types/branch.ts';
import apiClient from '@/lib/api';

export const branchApi = {
  // Get all branches with pagination and filtering
  getBranches: async (params?: {
    keyword?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    isActive?: boolean;
  }): Promise<BranchResponse> => {
    const response = await apiClient.get('/api/branches', { params });
    return response.data;
  },

  // Get a specific branch by ID
  getBranchById: async (id: number | string): Promise<Branch> => {
    const response = await apiClient.get(`/api/branches/${id}`);
    return response.data;
  },
};
