export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  brand: string | null
  brandSlug: string | null
  category: string | null
  categorySlug: string | null
  subcategory: string | null
  subcategorySlug: string | null
  price: number
  listedPrice: number
  cost: number | null
  discountPercent: number
  isDiscount: boolean
  quantity: number
  minimumStock: number
  isOutOfStock: boolean
  imageUrl: string | null
  sku: string | null
  tags: string | null
  ingredients: string | null
  manual: string | null
  ratingScore: number
  totalSold: number
  isActive: boolean
  createdAt: string
  updatedAt: string | null
  images: Array<ProductImage>
  variants: Array<ProductVariant>
}

export interface ProductImage {
  id: number
  productId: string
  name: string
  url: string
  alt: string | null
}

export interface ProductVariant {
  id: number
  productId: string
  name: string
  price: number
  listedPrice: number
  sku: string | null
  imageUrl: string | null
  isDiscount: boolean
  discountPercent: number
  isOutOfStock: boolean
}

export interface InventoryTransaction {
  id: number
  productId: string
  productName?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  transactionDate: string
  notes: string | null
  employeeId: number
  employeeName?: string
} 