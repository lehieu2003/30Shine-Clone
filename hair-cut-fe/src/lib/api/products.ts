import apiClient from '../api'
import type { InventoryTransaction, Product } from '@/types/product'

export const productApi = {
  // Get all products
  getAllProducts: async (): Promise<Array<Product>> => {
    const response = await apiClient.get('/api/products')

    return Array.isArray(response.data.data) ? response.data.data : []
  },
  // Get a product by ID
  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/api/products/${id}`)
      if (!response.data?.success || !response.data?.data) {
        throw new Error('Invalid product data received')
      }
      return response.data.data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  // Create a new product
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post('/api/products/admin', productData)
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid product data received')
    }
    return response.data
  },

  // Update an existing product
  updateProduct: async (
    id: string,
    productData: Partial<Product>,
  ): Promise<Product> => {
    const response = await apiClient.put(
      `/api/products/admin/${id}`,
      productData,
    )
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid product data received')
    }
    return response.data
  },

  // Delete a product
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/products/admin/${id}`)
  },

  // Update product inventory
  updateInventory: async (
    id: string,
    inventoryData: Partial<InventoryTransaction>,
  ): Promise<void> => {
    await apiClient.post(`/api/products/admin/${id}/inventory`, inventoryData)
  },

  // Get inventory transactions for a specific product
  getProductInventoryTransactions: async (
    productId: string,
  ): Promise<Array<InventoryTransaction>> => {
    const response = await apiClient.get(
      `/api/products/admin/inventory/${productId}`,
    )
    return Array.isArray(response.data) ? response.data : []
  },

  // Get all inventory transactions
  getAllInventoryTransactions: async (): Promise<
    Array<InventoryTransaction>
  > => {
    const response = await apiClient.get('/api/products/admin/inventory')
    return Array.isArray(response.data) ? response.data : []
  },
}
