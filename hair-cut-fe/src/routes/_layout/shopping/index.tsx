import { Link, createFileRoute } from '@tanstack/react-router'
import { Heart, Search, ShoppingBag, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/types/product'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useProduct } from '@/contexts/ProductContext'
import { useCart } from '@/contexts/CartContext'

export const Route = createFileRoute('/_layout/shopping/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { products, isLoading, error } = useProduct()
  const { addToCart } = useCart()
  const [filteredProducts, setFilteredProducts] = useState<Array<Product>>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [sortBy, setSortBy] = useState('popular')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Add ref for the top element
  const topRef = useRef<HTMLDivElement>(null)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Scroll to top when products or pagination changes
  useEffect(() => {
    window.scrollTo({
      top: 400,
      behavior: 'smooth',
    })
  }, [products, currentPage])

  // Get unique categories and brands from products
  const categories = [
    'all',
    ...new Set(
      products.map((p) => p.category).filter(Boolean) as Array<string>,
    ),
  ] as const
  const brands = [
    'all',
    ...new Set(products.map((p) => p.brand).filter(Boolean) as Array<string>),
  ] as const

  useEffect(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      )
    }

    // Apply brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    )

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.ratingScore - a.ratingScore)
        break
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        break
      default: // popular
        filtered.sort((a, b) => b.totalSold - a.totalSold)
    }

    setFilteredProducts(filtered)
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
  ])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const handleAddToCart = async (product: Product) => {
    await addToCart(product.id, 1)
  }

  const renderProductCard = (product: Product) => (
    <Card key={product.id} className="overflow-hidden group">
      <Link
        to="/shopping/product/$id"
        params={{ id: product.id.toString() }}
        className="block"
      >
        <div className="relative aspect-square">
          <img
            src={product.imageUrl || '/placeholder.svg?height=300&width=300'}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <Button
            size="icon"
            variant="outline"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault()
              // Add to wishlist logic here
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          {product.isDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              -{product.discountPercent}%
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-1 mb-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.ratingScore)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({product.totalSold})
            </span>
          </div>
          <h3 className="font-medium line-clamp-2 mb-1 group-hover:text-blue-600">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.isDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.listedPrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={(e) => {
            e.preventDefault()
            handleAddToCart(product)
          }}
          disabled={product.isOutOfStock}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {product.isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="flex flex-col min-h-screen">
      {/* Reference element at the top of the page */}
      <div ref={topRef} />

      {/* Hero Section */}
      <section className="relative h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gray-800">
          <div className="h-full w-full bg-[url('/placeholder.svg?height=300&width=1200')] bg-cover bg-center opacity-70"></div>
        </div>
        <div className="container relative z-20 mx-auto flex h-full flex-col items-start justify-center px-4 text-white">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">30Shine Shop</h1>
          <p className="mb-6 max-w-md text-lg text-gray-200">
            Sản phẩm chăm sóc tóc & da mặt chính hãng
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? 'default' : 'outline'}
                className={
                  category === selectedCategory
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : ''
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Tất cả sản phẩm' : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Tìm kiếm</h3>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Tìm sản phẩm..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-bold mb-4">Danh mục</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <label className="text-sm cursor-pointer hover:text-blue-600">
                          <input
                            type="radio"
                            name="category"
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            checked={category === selectedCategory}
                            onChange={() => setSelectedCategory(category)}
                          />
                          {category === 'all' ? 'Tất cả sản phẩm' : category}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          (
                          {
                            products.filter((p) => p.category === category)
                              .length
                          }
                          )
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-bold mb-4">Thương hiệu</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div
                        key={brand}
                        className="flex items-center justify-between"
                      >
                        <label className="text-sm cursor-pointer hover:text-blue-600">
                          <input
                            type="radio"
                            name="brand"
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            checked={brand === selectedBrand}
                            onChange={() => setSelectedBrand(brand)}
                          />
                          {brand === 'all' ? 'Tất cả thương hiệu' : brand}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          ({products.filter((p) => p.brand === brand).length})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-bold mb-4">Giá (nghìn đồng)</h3>
                  <div className="space-y-6">
                    <Slider
                      defaultValue={[0, 1000000]}
                      min={0}
                      max={1000000}
                      step={10000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex items-center justify-between">
                      <div className="border rounded-md px-3 py-1">
                        <span className="text-sm">
                          {formatPrice(priceRange[0])}
                        </span>
                      </div>
                      <div className="border rounded-md px-3 py-1">
                        <span className="text-sm">
                          {formatPrice(priceRange[1])}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex flex-col gap-8">
                {/* Sort and View Options */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Hiển thị {filteredProducts.length} sản phẩm
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Sắp xếp theo:</span>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Phổ biến nhất" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">Phổ biến nhất</SelectItem>
                          <SelectItem value="newest">Mới nhất</SelectItem>
                          <SelectItem value="price-asc">
                            Giá: Thấp đến cao
                          </SelectItem>
                          <SelectItem value="price-desc">
                            Giá: Cao đến thấp
                          </SelectItem>
                          <SelectItem value="rating">
                            Đánh giá cao nhất
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                          <Skeleton className="aspect-square" />
                          <CardContent className="p-4">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map(renderProductCard)}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant="outline"
                            size="icon"
                            className={
                              page === currentPage
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : ''
                            }
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ),
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Đăng ký nhận thông tin</h2>
            <p className="text-muted-foreground mb-6">
              Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và các mẹo
              chăm sóc tóc hữu ích
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Email của bạn"
                className="flex-1"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">Đăng ký</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
