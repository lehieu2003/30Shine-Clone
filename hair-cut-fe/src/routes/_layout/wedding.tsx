import { createFileRoute } from '@tanstack/react-router'
import { Quote, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export const Route = createFileRoute('/_layout/wedding')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gray-800">
          <div className="h-full w-full bg-[url('/placeholder.svg?height=400&width=1200')] bg-cover bg-center opacity-70"></div>
        </div>
        <div className="container relative z-20 mx-auto flex h-full flex-col items-start justify-center px-4 text-white">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">
            Nụ cười DV
          </h1>
          <p className="mb-6 max-w-md text-lg text-gray-200">
            Những câu chuyện và trải nghiệm từ khách hàng của 30Shine
          </p>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Câu chuyện nổi bật</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những trải nghiệm đáng nhớ của khách hàng tại 30Shine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <img
                src="/placeholder.svg?height=500&width=500"
                alt="Customer story"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Customer avatar"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">Nguyễn Văn A</h4>
                    <p className="text-sm text-gray-300">
                      Khách hàng thân thiết
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Thay đổi diện mạo, thay đổi cuộc sống
                </h3>
                <p className="text-sm text-gray-300 line-clamp-2">
                  "30Shine không chỉ giúp tôi có một kiểu tóc đẹp mà còn giúp
                  tôi tự tin hơn trong công việc và cuộc sống..."
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <Quote className="h-10 w-10 text-blue-600 shrink-0" />
                <p className="text-lg italic">
                  30Shine không chỉ giúp tôi có một kiểu tóc đẹp mà còn giúp tôi
                  tự tin hơn trong công việc và cuộc sống. Từ một người luôn
                  ngại ngùng khi gặp đối tác, giờ đây tôi tự tin hơn rất nhiều
                  nhờ vào diện mạo mới. Cảm ơn 30Shine đã đồng hành cùng tôi
                  trong hành trình thay đổi này.
                </p>
              </div>
              <div className="flex items-center gap-1 mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <img
                    src="/placeholder.svg?height=64&width=64"
                    alt="Customer avatar"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Nguyễn Văn A</h4>
                  <p className="text-muted-foreground">Giám đốc kinh doanh</p>
                  <p className="text-sm text-blue-600">Khách hàng từ 2018</p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Xem câu chuyện đầy đủ
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những đánh giá chân thực từ khách hàng của 30Shine
            </p>
          </div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-1 mb-4">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                        </div>
                        <Quote className="h-8 w-8 text-blue-600 mb-2" />
                        <p className="text-muted-foreground mb-4 line-clamp-4">
                          Dịch vụ tuyệt vời, nhân viên nhiệt tình và chuyên
                          nghiệp. Tôi rất hài lòng với kiểu tóc mới và sẽ tiếp
                          tục quay lại 30Shine.
                        </p>
                        <div className="flex items-center gap-3 mt-auto">
                          <div className="h-12 w-12 rounded-full overflow-hidden">
                            <img
                              src="/placeholder.svg?height=48&width=48"
                              alt="Customer avatar"
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold">
                              Khách hàng {index + 1}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Chi nhánh Thái Hà
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </section>

      {/* Before & After */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trước & Sau</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những màn lột xác ấn tượng tại 30Shine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="grid grid-cols-2 gap-2 p-2">
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <img
                        src="/placeholder.svg?height=200&width=200"
                        alt="Before"
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Trước
                      </div>
                    </div>
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <img
                        src="/placeholder.svg?height=200&width=200"
                        alt="After"
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Sau
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 pt-2">
                    <h3 className="font-bold mb-1">Khách hàng {index + 1}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Dịch vụ: Cắt tóc + Uốn Hàn Quốc
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Chi nhánh Thái Hà
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="text-center mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700">Xem thêm</Button>
          </div>
        </div>
      </section>

      {/* Video Stories */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Video Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Câu chuyện của khách hàng qua video
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src="/placeholder.svg?height=200&width=350"
                      alt="Video thumbnail"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
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
                          className="h-8 w-8 text-white"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">
                      Câu chuyện của Minh Quân
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Từ một chàng trai nhút nhát đến một người đàn ông tự tin
                      với diện mạo mới
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Share Your Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Chia sẻ câu chuyện của bạn
                </CardTitle>
                <CardDescription>
                  Hãy chia sẻ trải nghiệm của bạn tại 30Shine để chúng tôi có
                  thể phục vụ bạn tốt hơn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Họ và tên
                      </label>
                      <Input id="name" placeholder="Nguyễn Văn A" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Số điện thoại
                      </label>
                      <Input id="phone" placeholder="0912 345 678" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="branch" className="text-sm font-medium">
                      Chi nhánh đã sử dụng dịch vụ
                    </label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option>30Shine Thái Hà</option>
                      <option>30Shine Cầu Giấy</option>
                      <option>30Shine Nguyễn Trãi</option>
                      <option>30Shine Trần Duy Hưng</option>
                      <option>Chi nhánh khác</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-medium">
                      Dịch vụ đã sử dụng
                    </label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option>Cắt tóc</option>
                      <option>Uốn tóc</option>
                      <option>Nhuộm tóc</option>
                      <option>Combo cắt gội massage</option>
                      <option>Dịch vụ khác</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="rating" className="text-sm font-medium">
                      Đánh giá của bạn
                    </label>
                    <div className="flex items-center gap-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="h-8 w-8 cursor-pointer text-gray-300 hover:text-yellow-400 hover:fill-yellow-400"
                          />
                        ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="story" className="text-sm font-medium">
                      Câu chuyện của bạn
                    </label>
                    <Textarea
                      id="story"
                      placeholder="Chia sẻ trải nghiệm của bạn tại 30Shine..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Hình ảnh (nếu có)
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
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
                        className="mx-auto h-12 w-12 text-muted-foreground"
                      >
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                        <line x1="16" x2="22" y1="5" y2="5"></line>
                        <line x1="19" x2="19" y1="2" y2="8"></line>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                      </svg>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Kéo thả hoặc click để tải lên
                      </p>
                      <input type="file" className="hidden" />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Gửi câu chuyện
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
