import { createFileRoute } from '@tanstack/react-router'
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
import { Heart, Search, ShoppingBag, Star } from 'lucide-react'

export const Route = createFileRoute('/_layout/shop')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen">
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
            {[
              'Tất cả sản phẩm',
              'Sáp vuốt tóc',
              'Dầu gội',
              'Dầu xả',
              'Serum dưỡng tóc',
              'Sữa rửa mặt',
              'Kem dưỡng da',
            ].map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? 'default' : 'outline'}
                className={index === 0 ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                {category}
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
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-bold mb-4">Danh mục</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Tất cả sản phẩm', count: 86 },
                      { name: 'Sáp vuốt tóc', count: 24 },
                      { name: 'Dầu gội', count: 18 },
                      { name: 'Dầu xả', count: 12 },
                      { name: 'Serum dưỡng tóc', count: 9 },
                      { name: 'Sữa rửa mặt', count: 15 },
                      { name: 'Kem dưỡng da', count: 8 },
                    ].map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <label className="text-sm cursor-pointer hover:text-blue-600">
                          <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            defaultChecked={index === 0}
                          />
                          {category.name}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          ({category.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-bold mb-4">Thương hiệu</h3>
                  <div className="space-y-2">
                    {[
                      { name: '30Shine', count: 32 },
                      { name: 'Glanzen', count: 18 },
                      { name: 'Gatsby', count: 14 },
                      { name: 'Tigi', count: 10 },
                      { name: "L'Oreal", count: 8 },
                      { name: 'Dove', count: 4 },
                    ].map((brand, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <label className="text-sm cursor-pointer hover:text-blue-600">
                          <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                          />
                          {brand.name}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          ({brand.count})
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
                      defaultValue={[50, 500]}
                      min={0}
                      max={1000}
                      step={10}
                    />
                    <div className="flex items-center justify-between">
                      <div className="border rounded-md px-3 py-1">
                        <span className="text-sm">50K</span>
                      </div>
                      <div className="border rounded-md px-3 py-1">
                        <span className="text-sm">500K</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-bold mb-4">Đánh giá</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`rating-${rating}`}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        <label
                          htmlFor={`rating-${rating}`}
                          className="flex items-center"
                        >
                          {Array(rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          {Array(5 - rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                          <span className="ml-1 text-xs text-muted-foreground">
                            trở lên
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Áp dụng bộ lọc
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex flex-col gap-8">
                {/* Sort and View Options */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Hiển thị 1-12 của 86 sản phẩm
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Sắp xếp theo:</span>
                      <Select defaultValue="popular">
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Hiển thị:</span>
                      <Select defaultValue="12">
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="12" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12</SelectItem>
                          <SelectItem value="24">24</SelectItem>
                          <SelectItem value="36">36</SelectItem>
                          <SelectItem value="48">48</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Featured Products */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Sản phẩm nổi bật</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <Card key={index} className="overflow-hidden group">
                          <div className="relative aspect-square">
                            <img
                              src="/placeholder.svg?height=300&width=300"
                              alt="Product image"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            {index % 3 === 0 && (
                              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                                Mới
                              </div>
                            )}
                            {index % 4 === 0 && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                                -20%
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
                                    className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              <span className="text-xs text-muted-foreground ml-1">
                                (120)
                              </span>
                            </div>
                            <h3 className="font-medium line-clamp-2 mb-1 group-hover:text-blue-600">
                              Sáp vuốt tóc 30Shine Clay Wax 30S1 - Giữ nếp tự
                              nhiên
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-blue-600">
                                199.000đ
                              </span>
                              {index % 4 === 0 && (
                                <span className="text-sm text-muted-foreground line-through">
                                  249.000đ
                                </span>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              Thêm vào giỏ
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Best Sellers */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Sản phẩm bán chạy</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <Card key={index} className="overflow-hidden group">
                          <div className="relative aspect-square">
                            <img
                              src="/placeholder.svg?height=300&width=300"
                              alt="Product image"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
                              Bán chạy
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-1 mb-2">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              <span className="text-xs text-muted-foreground ml-1">
                                (358)
                              </span>
                            </div>
                            <h3 className="font-medium line-clamp-2 mb-1 group-hover:text-blue-600">
                              Dầu gội 30Shine Biotin & Collagen - Ngăn rụng tóc
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-blue-600">
                                169.000đ
                              </span>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              Thêm vào giỏ
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" disabled>
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
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      1
                    </Button>
                    <Button variant="outline" size="icon">
                      2
                    </Button>
                    <Button variant="outline" size="icon">
                      3
                    </Button>
                    <Button variant="outline" size="icon">
                      4
                    </Button>
                    <Button variant="outline" size="icon">
                      5
                    </Button>
                    <Button variant="outline" size="icon">
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
