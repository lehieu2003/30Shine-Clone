import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle, ChevronRight, ExternalLink } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { brands } from '@/utils/images'

export const Route = createFileRoute('/_layout/partners')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gray-800">
          <div className="h-full w-full bg-[url('https://30shine.com/logo-new.png')] bg-cover bg-center opacity-70"></div>
        </div>
        <div className="container relative z-20 mx-auto flex h-full flex-col items-start justify-center px-4 text-white">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">
            Đối tác
          </h1>
          <p className="mb-6 max-w-md text-lg text-gray-200">
            Cùng 30Shine phát triển và mang đến giá trị cho khách hàng
          </p>
          <Button className="rounded-full bg-blue-600 hover:bg-blue-700 px-6">
            Trở thành đối tác
          </Button>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Các loại hình đối tác</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              30Shine luôn tìm kiếm cơ hội hợp tác với các đối tác trong nhiều
              lĩnh vực khác nhau
            </p>
          </div>

          <Tabs defaultValue="supplier" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
              <TabsTrigger value="supplier" className="py-3">
                Nhà cung cấp
              </TabsTrigger>
              <TabsTrigger value="brand" className="py-3">
                Thương hiệu
              </TabsTrigger>
              <TabsTrigger value="technology" className="py-3">
                Công nghệ
              </TabsTrigger>
              <TabsTrigger value="media" className="py-3">
                Truyền thông
              </TabsTrigger>
            </TabsList>

            <TabsContent value="supplier" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    Nhà cung cấp sản phẩm
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    30Shine luôn tìm kiếm các nhà cung cấp sản phẩm chất lượng
                    cao trong lĩnh vực chăm sóc tóc và da mặt cho nam giới.
                    Chúng tôi cam kết mang đến cho khách hàng những sản phẩm tốt
                    nhất, và đối tác của chúng tôi đóng vai trò quan trọng trong
                    việc thực hiện cam kết này.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        Sản phẩm chăm sóc tóc: sáp, gôm, dầu gội, dầu xả,
                        serum...
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        Sản phẩm chăm sóc da: sữa rửa mặt, kem dưỡng, mặt nạ...
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        Thiết bị và dụng cụ salon: máy sấy, tông đơ, kéo cắt...
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Nội thất và trang thiết bị salon</span>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Trở thành nhà cung cấp
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="brand" className="mt-8">
              <div className="flex-col gap-8 items-center">
                <h3 className="text-2xl font-bold mb-4">Đối tác thương hiệu</h3>
                <p className="text-muted-foreground mb-4">
                  30Shine hợp tác với các thương hiệu uy tín để mang đến những
                  trải nghiệm độc đáo và giá trị gia tăng cho khách hàng. Chúng
                  tôi tìm kiếm các cơ hội hợp tác marketing, đồng thương hiệu và
                  các chương trình khuyến mãi chung.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Hợp tác marketing và quảng cáo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Chương trình khuyến mãi chung</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Phát triển sản phẩm đồng thương hiệu</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Chương trình ưu đãi cho khách hàng</span>
                  </div>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700">
                  Hợp tác thương hiệu
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="technology" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Đối tác công nghệ</h3>
                  <p className="text-muted-foreground mb-4">
                    30Shine luôn đi đầu trong việc ứng dụng công nghệ để nâng
                    cao trải nghiệm khách hàng và tối ưu hóa vận hành. Chúng tôi
                    tìm kiếm các đối tác công nghệ trong nhiều lĩnh vực để cùng
                    nhau phát triển.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Phần mềm quản lý salon và đặt lịch</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Ứng dụng di động và trải nghiệm khách hàng</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Công nghệ thanh toán và tài chính</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Giải pháp AI và phân tích dữ liệu</span>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Hợp tác công nghệ
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    Đối tác truyền thông
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    30Shine tìm kiếm các đối tác truyền thông để mở rộng tầm ảnh
                    hưởng và tiếp cận nhiều khách hàng hơn. Chúng tôi cởi mở với
                    nhiều hình thức hợp tác truyền thông khác nhau.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Báo chí và tạp chí</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Nền tảng truyền thông số</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Influencer và KOL</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Sự kiện và hội thảo</span>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Hợp tác truyền thông
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Current Partners */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Đối tác của chúng tôi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              30Shine tự hào hợp tác với các thương hiệu và đối tác uy tín
            </p>
          </div>

          <Carousel className="max-w-5xl mx-auto mb-6">
            <CarouselPrevious />
            <CarouselContent>
              {brands.map((brand, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <img
                    width={300}
                    height={300}
                    src={brand.path}
                    alt={brand.name}
                    className="object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Câu chuyện thành công</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những câu chuyện hợp tác thành công giữa 30Shine và các đối tác
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Hợp tác với Gatsby',
                description:
                  '30Shine và Gatsby đã hợp tác phát triển dòng sản phẩm sáp vuốt tóc độc quyền, mang đến giải pháp tạo kiểu tóc hoàn hảo cho nam giới Việt Nam.',
                image: '/placeholder.svg?height=300&width=400',
              },
              {
                title: 'Chương trình với MoMo',
                description:
                  'Hợp tác với ví điện tử MoMo giúp 30Shine mang đến trải nghiệm thanh toán thuận tiện và nhiều ưu đãi hấp dẫn cho khách hàng.',
                image: '/placeholder.svg?height=300&width=400',
              },
              {
                title: "Đối tác với L'Oreal",
                description:
                  "30Shine và L'Oreal Men Expert đã cùng nhau phát triển các chương trình chăm sóc da toàn diện cho nam giới, nâng cao nhận thức về việc chăm sóc da.",
                image: '/placeholder.svg?height=300&width=400',
              },
            ].map((story, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={story.image || '/placeholder.svg'}
                    alt={story.title}
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {story.description}
                  </p>
                  <Button variant="outline" className="group">
                    Xem chi tiết
                    <ExternalLink className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Process */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quy trình hợp tác</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Các bước đơn giản để trở thành đối tác của 30Shine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Liên hệ',
                description:
                  'Gửi thông tin đề xuất hợp tác qua form đăng ký hoặc email',
              },
              {
                step: '02',
                title: 'Thảo luận',
                description:
                  'Chúng tôi sẽ liên hệ để thảo luận chi tiết về cơ hội hợp tác',
              },
              {
                step: '03',
                title: 'Đề xuất',
                description:
                  'Xây dựng đề xuất hợp tác cụ thể phù hợp với cả hai bên',
              },
              {
                step: '04',
                title: 'Triển khai',
                description:
                  'Ký kết hợp đồng và bắt đầu triển khai các hoạt động hợp tác',
              },
            ].map((step, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">
                    {step.step}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Đăng ký trở thành đối tác
                </CardTitle>
                <CardDescription>
                  Điền thông tin để bắt đầu quá trình hợp tác với 30Shine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium">
                        Tên công ty/tổ chức
                      </label>
                      <Input id="company" placeholder="Công ty TNHH ABC" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="type" className="text-sm font-medium">
                        Loại hình hợp tác
                      </label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                        <option>Nhà cung cấp</option>
                        <option>Thương hiệu</option>
                        <option>Công nghệ</option>
                        <option>Truyền thông</option>
                        <option>Khác</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Người liên hệ
                      </label>
                      <Input id="name" placeholder="Nguyễn Văn A" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="position" className="text-sm font-medium">
                        Chức vụ
                      </label>
                      <Input id="position" placeholder="Giám đốc kinh doanh" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      <label htmlFor="phone" className="text-sm font-medium">
                        Số điện thoại
                      </label>
                      <Input id="phone" placeholder="0912 345 678" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium">
                      Website
                    </label>
                    <Input id="website" placeholder="https://www.example.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="proposal" className="text-sm font-medium">
                      Đề xuất hợp tác
                    </label>
                    <Textarea
                      id="proposal"
                      placeholder="Mô tả chi tiết về đề xuất hợp tác của bạn..."
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Gửi đề xuất hợp tác
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
