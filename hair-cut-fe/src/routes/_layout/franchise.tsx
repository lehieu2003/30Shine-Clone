import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle } from 'lucide-react'
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const Route = createFileRoute('/_layout/franchise')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gray-800">
          <div className="h-full w-full bg-[url('/placeholder.svg?height=500&width=1200')] bg-cover bg-center opacity-70"></div>
        </div>
        <div className="container relative z-20 mx-auto flex h-full flex-col items-start justify-center px-4 text-white">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">
            Nhượng quyền <br />
            <span className="text-blue-500">30Shine</span>
          </h1>
          <p className="mb-6 max-w-md text-lg text-gray-200">
            Cơ hội kinh doanh hấp dẫn cùng thương hiệu salon tóc nam hàng đầu
            Việt Nam
          </p>
          <div className="flex gap-4">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 px-6">
              Tìm hiểu thêm
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white text-black hover:bg-white "
            >
              Liên hệ ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Tại sao chọn nhượng quyền 30Shine?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trở thành đối tác nhượng quyền của 30Shine, bạn sẽ được hưởng
              nhiều lợi ích từ thương hiệu hàng đầu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Thương hiệu mạnh',
                description:
                  '30Shine là thương hiệu salon tóc nam hàng đầu Việt Nam với hơn 130 chi nhánh và phục vụ hơn 18 triệu lượt khách mỗi năm.',
                icon: '🏆',
              },
              {
                title: 'Mô hình kinh doanh hiệu quả',
                description:
                  'Mô hình kinh doanh đã được chứng minh hiệu quả với quy trình vận hành chuẩn hóa và hệ thống quản lý chuyên nghiệp.',
                icon: '📈',
              },
              {
                title: 'Đào tạo chuyên nghiệp',
                description:
                  'Chương trình đào tạo bài bản cho nhân viên và hỗ trợ kỹ thuật liên tục từ đội ngũ chuyên gia của 30Shine.',
                icon: '🎓',
              },
              {
                title: 'Marketing & thương hiệu',
                description:
                  'Hỗ trợ marketing và xây dựng thương hiệu từ đội ngũ marketing chuyên nghiệp của 30Shine.',
                icon: '📱',
              },
              {
                title: 'Nguồn cung ứng sản phẩm',
                description:
                  'Tiếp cận nguồn cung ứng sản phẩm chất lượng cao với giá ưu đãi từ các đối tác của 30Shine.',
                icon: '📦',
              },
              {
                title: 'Hỗ trợ vận hành',
                description:
                  'Hỗ trợ toàn diện về vận hành, từ tuyển dụng, đào tạo đến quản lý chất lượng dịch vụ.',
                icon: '🛠️',
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Franchise Process */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quy trình nhượng quyền</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Các bước đơn giản để trở thành đối tác nhượng quyền của 30Shine
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 hidden md:block"></div>

              {[
                {
                  step: '01',
                  title: 'Liên hệ & Tìm hiểu',
                  description:
                    'Liên hệ với chúng tôi để tìm hiểu thêm về cơ hội nhượng quyền 30Shine.',
                },
                {
                  step: '02',
                  title: 'Đánh giá & Phỏng vấn',
                  description:
                    'Chúng tôi sẽ đánh giá hồ sơ và tổ chức phỏng vấn để tìm hiểu thêm về bạn.',
                },
                {
                  step: '03',
                  title: 'Ký kết hợp đồng',
                  description:
                    'Sau khi được chấp thuận, chúng tôi sẽ tiến hành ký kết hợp đồng nhượng quyền.',
                },
                {
                  step: '04',
                  title: 'Đào tạo & Chuẩn bị',
                  description:
                    'Bạn sẽ được đào tạo về quy trình vận hành và chuẩn bị mọi thứ để mở salon.',
                },
                {
                  step: '05',
                  title: 'Khai trương & Vận hành',
                  description:
                    'Khai trương salon và bắt đầu vận hành dưới sự hỗ trợ của đội ngũ 30Shine.',
                },
              ].map((step, index) => (
                <div key={index} className="relative flex gap-8 mb-12">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0 z-10">
                    {step.step}
                  </div>
                  <div className="pt-3">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Các gói đầu tư</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lựa chọn gói đầu tư phù hợp với khả năng tài chính và mục tiêu
              kinh doanh của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Gói Tiêu Chuẩn',
                price: '800 triệu - 1,2 tỷ',
                description:
                  'Phù hợp cho các thị trường cấp tỉnh và thành phố vừa',
                features: [
                  'Diện tích 80-120m²',
                  '6-8 ghế cắt tóc',
                  'Đào tạo 4-6 nhân viên',
                  'Hỗ trợ marketing cơ bản',
                  'Hỗ trợ vận hành 3 tháng',
                ],
              },
              {
                name: 'Gói Cao Cấp',
                price: '1,2 tỷ - 1,8 tỷ',
                description:
                  'Phù hợp cho các thành phố lớn và khu vực trung tâm',
                features: [
                  'Diện tích 120-180m²',
                  '10-12 ghế cắt tóc',
                  'Đào tạo 8-12 nhân viên',
                  'Hỗ trợ marketing toàn diện',
                  'Hỗ trợ vận hành 6 tháng',
                  'Tư vấn địa điểm kinh doanh',
                ],
                highlighted: true,
              },
              {
                name: 'Gói Đặc Biệt',
                price: '1,8 tỷ - 2,5 tỷ',
                description: 'Phù hợp cho các vị trí đắc địa tại thành phố lớn',
                features: [
                  'Diện tích 180-250m²',
                  '15+ ghế cắt tóc',
                  'Đào tạo 15+ nhân viên',
                  'Chiến lược marketing độc quyền',
                  'Hỗ trợ vận hành 12 tháng',
                  'Tư vấn địa điểm kinh doanh',
                  'Quyền ưu tiên mở rộng khu vực',
                ],
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`overflow-hidden ${plan.highlighted ? 'border-blue-600 shadow-lg' : 'border shadow'}`}
              >
                {plan.highlighted && (
                  <div className="bg-blue-600 text-white text-center py-1 text-sm font-medium">
                    Phổ biến nhất
                  </div>
                )}
                <CardHeader
                  className={`${plan.highlighted ? 'bg-blue-50' : ''}`}
                >
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> VNĐ</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${plan.highlighted ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  >
                    Tìm hiểu thêm
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Câu hỏi thường gặp</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Giải đáp những thắc mắc phổ biến về chương trình nhượng quyền
              30Shine
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question:
                    'Tôi cần những điều kiện gì để trở thành đối tác nhượng quyền 30Shine?',
                  answer:
                    'Để trở thành đối tác nhượng quyền, bạn cần có năng lực tài chính phù hợp với gói đầu tư, có kinh nghiệm kinh doanh hoặc quản lý, và cam kết tuân thủ các tiêu chuẩn của thương hiệu 30Shine.',
                },
                {
                  question: 'Chi phí nhượng quyền bao gồm những gì?',
                  answer:
                    'Chi phí nhượng quyền bao gồm phí nhượng quyền ban đầu, chi phí đầu tư cơ sở vật chất, thiết bị, đào tạo nhân viên, và các chi phí vận hành ban đầu. Chi tiết cụ thể sẽ được tư vấn dựa trên gói đầu tư bạn lựa chọn.',
                },
                {
                  question: 'Thời gian hoàn vốn dự kiến là bao lâu?',
                  answer:
                    'Thời gian hoàn vốn dự kiến từ 18-24 tháng tùy thuộc vào vị trí kinh doanh, quy mô đầu tư và khả năng quản lý của bạn. Chúng tôi sẽ cung cấp kế hoạch kinh doanh chi tiết để bạn có thể đánh giá.',
                },
                {
                  question: '30Shine hỗ trợ gì cho đối tác nhượng quyền?',
                  answer:
                    '30Shine hỗ trợ toàn diện từ việc lựa chọn địa điểm, thiết kế salon, đào tạo nhân viên, cung cấp sản phẩm, hỗ trợ marketing và vận hành. Chúng tôi cam kết đồng hành cùng đối tác để đảm bảo thành công.',
                },
                {
                  question: 'Tôi có thể mở nhiều chi nhánh không?',
                  answer:
                    'Có, sau khi vận hành thành công chi nhánh đầu tiên, bạn có thể đăng ký mở thêm chi nhánh mới. Đối tác có thành tích tốt sẽ được ưu tiên quyền phát triển tại khu vực đã đăng ký.',
                },
                {
                  question: 'Thời hạn hợp đồng nhượng quyền là bao lâu?',
                  answer:
                    'Thời hạn hợp đồng nhượng quyền thông thường là 5 năm và có thể gia hạn nếu đối tác tuân thủ tốt các tiêu chuẩn của thương hiệu và có kết quả kinh doanh tốt.',
                },
              ].map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h2>
              <p className="text-muted-foreground mb-6">
                Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn để tư vấn chi
                tiết về chương trình nhượng quyền 30Shine.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
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
                      className="h-5 w-5 text-blue-600"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Điện thoại</p>
                    <p className="text-muted-foreground">1900 27 27 37</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
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
                      className="h-5 w-5 text-blue-600"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      franchise@30shine.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
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
                      className="h-5 w-5 text-blue-600"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Địa chỉ</p>
                    <p className="text-muted-foreground">
                      Tầng 3, Tòa nhà Lữ Gia, 70 Lữ Gia, Phường 15, Quận 11, TP.
                      HCM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Đăng ký tư vấn</CardTitle>
                  <CardDescription>
                    Điền thông tin để nhận tư vấn về chương trình nhượng quyền
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
                      <label htmlFor="location" className="text-sm font-medium">
                        Khu vực muốn đầu tư
                      </label>
                      <Input id="location" placeholder="TP. Hồ Chí Minh" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="budget" className="text-sm font-medium">
                        Ngân sách đầu tư
                      </label>
                      <Input id="budget" placeholder="1 tỷ - 1.5 tỷ" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Thông tin thêm
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Nhập thông tin thêm về nhu cầu của bạn..."
                        rows={4}
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Gửi thông tin
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
