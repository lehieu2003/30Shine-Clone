import apiClient from '../api'
import type { Cart } from '@/types/cart'

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get('/api/cart')
    return response.data
  },

  addToCart: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.post('/api/cart', { productId, quantity })
    return response.data
  },

  updateCartItem: async (
    productId: string,
    quantity: number,
  ): Promise<Cart> => {
    const response = await apiClient.put(`/api/cart/${productId}`, { quantity })
    return response.data
  },

  removeFromCart: async (productId: string): Promise<Cart> => {
    const response = await apiClient.delete(`/api/cart/${productId}`)
    return response.data
  },
}
