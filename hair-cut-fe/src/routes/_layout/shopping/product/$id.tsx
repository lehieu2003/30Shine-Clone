import { Link, createFileRoute, useParams } from '@tanstack/react-router'
import { ArrowLeft, Heart, ShoppingBag, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Product } from '@/types/product'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { productApi } from '@/lib/api/products'
import { formatPrice } from '@/lib/formatters'
import { useCart } from '@/contexts/CartContext'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export const Route = createFileRoute('/_layout/shopping/product/$id')({
  component: ProductDetailComponent,
})

function ProductDetailComponent() {
  const { id } = useParams({ from: '/_layout/shopping/product/$id' })
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is missing')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await productApi.getProductById(id)
        console.log('Received product data:', data) // Add debugging
        setProduct(data)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Not Found</h2>
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    )
  }

  const handleAddToCart = async () => {
    await addToCart(product.id, 1)
  }

  return (
    <div className="container py-8">
      <Link
        to="/shopping"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại cửa hàng
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square">
          {/* <img
            src={product.imageUrl || '/placeholder.svg?height=600&width=600'}
            alt={product.name}
            className="object-cover rounded-lg"
          /> */}
          <Card>
            <CardContent className="p-0">
              {product.images.length > 0 ? (
                <Carousel>
                  <CarouselContent>
                    {product.images.map((image) => (
                      <CarouselItem key={image.id}>
                        <img
                          src={
                            image.url || '/placeholder.svg?height=600&width=600'
                          }
                          alt={image.alt || product.name}
                          className="object-cover rounded-lg"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <img
                  src={
                    product.imageUrl || '/placeholder.svg?height=600&width=600'
                  }
                  alt={product.name}
                  className="object-cover rounded-lg"
                />
              )}
            </CardContent>
          </Card>

          {product.isDiscount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded">
              -{product.discountPercent}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.ratingScore)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.totalSold} đã bán)
              </span>
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              {product.isDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.listedPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Thương hiệu:</span>
              <span className="text-sm text-muted-foreground">
                {product.brand}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Danh mục:</span>
              <span className="text-sm text-muted-foreground">
                {product.category}
              </span>
            </div>
            {product.subcategory && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Phân loại:</span>
                <span className="text-sm text-muted-foreground">
                  {product.subcategory}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleAddToCart}
              disabled={product.isOutOfStock}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {product.isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => {
                // Add to wishlist logic here
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="details">Chi tiết</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  {product.description || 'Chưa có mô tả sản phẩm'}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">SKU:</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {product.sku || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Tình trạng:</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {product.isOutOfStock ? 'Hết hàng' : 'Còn hàng'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Số lượng:</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {product.quantity}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      Tồn kho tối thiểu:
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {product.minimumStock}
                    </span>
                  </div>
                  {product.ingredients && (
                    <div>
                      <span className="text-sm font-medium">Thành phần:</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {product.ingredients}
                      </span>
                    </div>
                  )}
                  {product.manual && (
                    <div>
                      <span className="text-sm font-medium">
                        Hướng dẫn sử dụng:
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {product.manual}
                      </span>
                    </div>
                  )}
                  {product.tags && (
                    <div className="col-span-2">
                      <span className="text-sm font-medium">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.tags.split(',').map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-sm rounded"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  Chưa có đánh giá nào
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-lg" />
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-1/3" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
