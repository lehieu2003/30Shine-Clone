import apiClient from '../api';
import type { Product } from '@/types/product';

export const productApi = {
  // Fetch all products with pagination and filters
  fetchProducts: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }) => {
    const response = await apiClient.get<{
      data: Product[];
      total: number;
      page: number;
      size: number;
    }>('/api/products', { params });
    return response.data;
  },

  // Fetch single product by ID
  fetchProductById: async (id: string) => {
    const response = await apiClient.get<{
      success: boolean;
      data: Product;
    }>(`/api/products/${id}`);
    return response.data.data;
  },

  // Search products
  searchProducts: async (query: string) => {
    const response = await apiClient.get<Product[]>('/api/products/search', {
      params: { q: query },
    });
    return response.data;
  },

  // Get all products (legacy)
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/api/products');

    return Array.isArray(response.data.data) ? response.data.data : [];
  },
  // Get a product by ID (legacy)
  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/api/products/${id}`);
      if (!response.data?.success || !response.data?.data) {
        throw new Error('Invalid product data received');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },
};
