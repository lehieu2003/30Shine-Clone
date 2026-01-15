import apiClient from '@/lib/api';

export const userApi = {
  getUserById: async (id: number | string): Promise<any> => {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },
};
