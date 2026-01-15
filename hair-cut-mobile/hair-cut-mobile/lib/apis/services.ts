import apiClient from '@/lib/api';

interface FetchServicesParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export const serviceApi = {
  fetchServices: async ({
    keyword = '',
    page = 1,
    size = 10,
    sortBy = 'createdAt',
    sortDirection = 'desc',
  }: FetchServicesParams) => {
    const response = await apiClient.get('/api/services', {
      params: { keyword, page, size, sortBy, sortDirection },
    });
    return response.data;
  },

  getServiceById: async (serviceId: string) => {
    const response = await apiClient.get(`/api/services/${serviceId}`);
    return response.data;
  },
};
