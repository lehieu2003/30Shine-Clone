import { createContext, useContext, useEffect, useState } from 'react'
import type { Cart } from '@/types/cart'
import { cartApi } from '@/lib/api/cart'
import { useToast } from '@/components/ui/toast-provider'

interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateCartItem: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  getCartTotal: () => number
  getCartItemsCount: () => number
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    try {
      toast.toast({ title, description, variant })
    } catch (err) {
      console.error('Toast error:', err)
    }
  }

  const fetchCart = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await cartApi.getCart()
      setCart(data)
    } catch (err) {
      setError('Failed to load cart')
      showToast('Error', 'Failed to load cart', 'destructive')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const addToCart = async (productId: string, quantity: number) => {
    try {
      const updatedCart = await cartApi.addToCart(productId, quantity)
      setCart(updatedCart)
      showToast('Success', 'Product added to cart')
    } catch (err) {
      showToast('Error', 'Failed to add product to cart', 'destructive')
    }
  }

  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      const updatedCart = await cartApi.updateCartItem(productId, quantity)
      setCart(updatedCart)
      showToast('Success', 'Cart updated')
    } catch (err) {
      showToast('Error', 'Failed to update cart', 'destructive')
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      const updatedCart = await cartApi.removeFromCart(productId)
      setCart(updatedCart)
      showToast('Success', 'Product removed from cart')
    } catch (err) {
      showToast('Error', 'Failed to remove product from cart', 'destructive')
    }
  }

  const clearCart = async () => {
    try {
      if (!cart?.items) return
      
      // Remove all items from cart
      await Promise.all(
        cart.items.map((item) => removeFromCart(item.productId))
      )
      
      // Refresh cart
      await fetchCart()
      
      showToast('Success', 'Cart cleared successfully')
    } catch (err) {
      showToast('Error', 'Failed to clear cart', 'destructive')
      throw err
    }
  }

  const getCartTotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => {
      const price = item.product.isDiscount ? item.product.price : item.product.listedPrice
      return total + price * item.quantity
    }, 0)
  }

  const getCartItemsCount = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cart,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartTotal,
    getCartItemsCount,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
