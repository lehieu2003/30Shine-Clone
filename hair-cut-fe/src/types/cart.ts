import type { Product } from './product'

export interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  product: Product
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: string
  userId: string
  items: Array<CartItem>
  createdAt: string
  updatedAt: string
}
