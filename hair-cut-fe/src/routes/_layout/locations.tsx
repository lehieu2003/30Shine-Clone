import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, MapPin, Phone, Star } from 'lucide-react'

export const Route = createFileRoute('/_layout/locations')({
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
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">
            Tìm 30Shine gần nhất
          </h1>
          <p className="mb-6 max-w-md text-lg text-gray-200">
            Hơn 130 chi nhánh trên toàn quốc, luôn sẵn sàng phục vụ bạn
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Tìm salon gần bạn
              </h2>
              <Tabs defaultValue="location" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="location">Tìm theo vị trí</TabsTrigger>
                  <TabsTrigger value="name">Tìm theo tên</TabsTrigger>
                </TabsList>
                <TabsContent value="location">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Tỉnh/Thành phố
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hanoi">Hà Nội</SelectItem>
                          <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                          <SelectItem value="danang">Đà Nẵng</SelectItem>
                          <SelectItem value="haiphong">Hải Phòng</SelectItem>
                          <SelectItem value="cantho">Cần Thơ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Quận/Huyện
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hoankiem">Hoàn Kiếm</SelectItem>
                          <SelectItem value="dongda">Đống Đa</SelectItem>
                          <SelectItem value="caugiay">Cầu Giấy</SelectItem>
                          <SelectItem value="haibatrung">
                            Hai Bà Trưng
                          </SelectItem>
                          <SelectItem value="longbien">Long Biên</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 mt-auto">
                      Tìm kiếm
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="name">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input placeholder="Nhập tên salon (VD: 30Shine Thái Hà)" />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Tìm kiếm
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Salon List */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Salon gần bạn</h3>
                  <span className="text-sm text-muted-foreground">
                    12 salon
                  </span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {Array(8)
                    .fill(0)
                    .map((_, index) => (
                      <Card
                        key={index}
                        className={`overflow-hidden ${index === 0 ? 'border-blue-600 bg-blue-50/50' : ''}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                              <img
                                src="/placeholder.svg?height=100&width=100"
                                alt="Salon image"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-blue-600">
                                30Shine Thái Hà
                              </h4>
                              <div className="flex items-center gap-1 my-1">
                                <div className="flex">
                                  {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                      />
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  (126)
                                </span>
                              </div>
                              <div className="flex items-start gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>30 Thái Hà, Đống Đa, Hà Nội</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <Clock className="h-4 w-4" />
                                <span>8:00 - 21:30</span>
                                <span className="text-blue-600 font-medium ml-1">
                                  Đang mở cửa
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Gọi ngay
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              Đặt lịch
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-muted rounded-xl overflow-hidden h-[600px] relative">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center"></div>
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-background rounded-lg shadow-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img
                          src="/placeholder.svg?height=100&width=100"
                          alt="Salon image"
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-blue-600">
                          30Shine Thái Hà
                        </h4>
                        <div className="flex items-center gap-1 my-1">
                          <div className="flex">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            (126)
                          </span>
                        </div>
                        <div className="flex items-start gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>30 Thái Hà, Đống Đa, Hà Nội</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Gọi ngay
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Đặt lịch
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Khu vực phổ biến</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tìm kiếm nhanh salon 30Shine theo khu vực phổ biến
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Hà Nội', count: 42 },
              { name: 'TP. Hồ Chí Minh', count: 38 },
              { name: 'Đà Nẵng', count: 12 },
              { name: 'Hải Phòng', count: 8 },
              { name: 'Cần Thơ', count: 6 },
              { name: 'Nha Trang', count: 5 },
              { name: 'Huế', count: 4 },
              { name: 'Bình Dương', count: 4 },
            ].map((location, index) => (
              <Card
                key={index}
                className="overflow-hidden group cursor-pointer hover:border-blue-600"
              >
                <div className="relative aspect-video">
                  <img
                    src="/placeholder.svg?height=200&width=300"
                    alt={location.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg">{location.name}</h3>
                    <p className="text-sm text-gray-200">
                      {location.count} salon
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-blue-50 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-blue-800">
              Đặt lịch ngay hôm nay
            </h2>
            <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
              Trải nghiệm dịch vụ cắt tóc đẳng cấp tại 30Shine. Đặt lịch trước
              để không phải chờ đợi.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
              Đặt lịch ngay
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
