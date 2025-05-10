import React, { createContext, useContext, useEffect, useState } from 'react'
import type { InventoryTransaction, Product } from '@/types/product'
import { productApi } from '@/lib/api/products'

interface ProductContextType {
  products: Array<Product>
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  createProduct: (productData: Partial<Product>) => Promise<void>
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  updateInventory: (
    id: string,
    inventoryData: Partial<InventoryTransaction>,
  ) => Promise<void>
  getInventoryTransactions: (
    productId: string,
  ) => Promise<Array<InventoryTransaction>>
  getAllInventoryTransactions: () => Promise<Array<InventoryTransaction>>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Array<Product>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const productsData = await productApi.getAllProducts()
      setProducts(productsData)
    } catch (err) {
      setError('Failed to fetch products')
      console.error('Error fetching products:', err)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const createProduct = async (productData: Partial<Product>) => {
    setIsLoading(true)
    setError(null)
    try {
      const newProduct = await productApi.createProduct(productData)
      setProducts((prev) => [...prev, newProduct])
    } catch (err) {
      setError('Failed to create product')
      console.error('Error creating product:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedProduct = await productApi.updateProduct(id, productData)
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, ...updatedProduct } : product,
        ),
      )
    } catch (err) {
      setError('Failed to update product')
      console.error('Error updating product:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await productApi.deleteProduct(id)
      setProducts((prev) => prev.filter((product) => product.id !== id))
    } catch (err) {
      setError('Failed to delete product')
      console.error('Error deleting product:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateInventory = async (
    id: string,
    inventoryData: Partial<InventoryTransaction>,
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      await productApi.updateInventory(id, inventoryData)
      // Refresh products to get updated inventory
      await fetchProducts()
    } catch (err) {
      setError('Failed to update inventory')
      console.error('Error updating inventory:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getInventoryTransactions = async (productId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      return await productApi.getProductInventoryTransactions(productId)
    } catch (err) {
      setError('Failed to fetch inventory transactions')
      console.error('Error fetching inventory transactions:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getAllInventoryTransactions = async () => {
    setIsLoading(true)
    setError(null)
    try {
      return await productApi.getAllInventoryTransactions()
    } catch (err) {
      setError('Failed to fetch all inventory transactions')
      console.error('Error fetching all inventory transactions:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const value = {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateInventory,
    getInventoryTransactions,
    getAllInventoryTransactions,
  }

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider')
  }
  return context
}
