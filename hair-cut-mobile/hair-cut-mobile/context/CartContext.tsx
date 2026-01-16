import { createContext, useContext, useEffect, useState } from 'react';
import type { Cart } from '@/types/cart';
import { useAuth } from './AuthContext';
import { cartApi } from '@/lib/apis/cart';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuth } = useAuth();

  const fetchCart = async () => {
    if (!isAuth) {
      setCart(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuth]);

  const addToCart = async (productId: string, quantity: number) => {
    if (!isAuth) {
      return;
    }

    try {
      const updatedCart = await cartApi.addToCart(productId, quantity);
      setCart(updatedCart);
    } catch (err) {
      throw err;
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    if (!isAuth || !cart) {
      return;
    }

    // Update local state immediately (optimistic update)
    const updatedItems = cart.items.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart({ ...cart, items: updatedItems });

    // Then sync with API in background
    try {
      await cartApi.updateCartItem(productId, quantity);
    } catch (err) {
      // If API fails, revert to original state
      setCart(cart);
      throw err;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuth || !cart) {
      return;
    }

    // Only update local state, backend doesn't have DELETE endpoint
    const updatedItems = cart.items.filter((item) => item.id !== productId);
    setCart({ ...cart, items: updatedItems });
  };

  const clearCart = async () => {
    if (!isAuth) {
      return;
    }

    try {
      if (!cart?.items) return;

      // Remove all items from cart
      await Promise.all(
        cart.items.map((item) => removeFromCart(item.productId))
      );

      // Refresh cart
      await fetchCart();
    } catch (err) {
      throw err;
    }
  };

  const getTotalPrice = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product.isDiscount
        ? item.product.price
        : item.product.listedPrice;
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
