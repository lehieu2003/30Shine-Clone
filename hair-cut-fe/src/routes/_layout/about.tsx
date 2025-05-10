import { createFileRoute } from '@tanstack/react-router'
import { Award, CheckCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ourStoryImages } from '@/utils/images'

export const Route = createFileRoute('/_layout/about')({
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
            Về 30Shine
          </h1>
          <p className="mb-6 max-w-md text-lg text-gray-200">
            Hành trình kiến tạo vẻ đẹp cho nam giới Việt Nam
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Câu chuyện của chúng tôi
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  30Shine được thành lập vào năm 2015 với sứ mệnh mang đến trải
                  nghiệm cắt tóc đẳng cấp cho nam giới Việt Nam. Từ cửa hàng đầu
                  tiên tại Hà Nội, chúng tôi đã phát triển thành chuỗi salon tóc
                  nam lớn nhất Việt Nam với hơn 130 chi nhánh trên toàn quốc.
                </p>
                <p>
                  Tên gọi "30Shine" xuất phát từ ý tưởng mỗi người đàn ông đều
                  xứng đáng tỏa sáng trong 30 phút trải nghiệm tại salon. Chúng
                  tôi không chỉ đơn thuần là nơi cắt tóc, mà còn là điểm đến để
                  nam giới được chăm sóc, thư giãn và tự tin hơn với vẻ ngoài
                  của mình.
                </p>
                <p>
                  Với đội ngũ stylist được đào tạo chuyên nghiệp và không ngừng
                  cập nhật xu hướng, 30Shine cam kết mang đến những kiểu tóc phù
                  hợp nhất với từng khách hàng, tôn lên cá tính và vẻ đẹp riêng
                  của mỗi người.
                </p>
              </div>
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                Tìm hiểu thêm
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={ourStoryImages[0]}
                  alt="30Shine salon"
                  width={300}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg mt-8">
                <img
                  src={ourStoryImages[1]}
                  alt="30Shine stylist"
                  width={300}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={ourStoryImages[2]}
                  alt="30Shine customer"
                  width={300}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg mt-8">
                <img
                  src={ourStoryImages[3]}
                  alt="30Shine interior"
                  width={300}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-sm">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold mb-2">18M+</h3>
              <p className="text-muted-foreground">
                Lượt khách hàng phục vụ mỗi năm
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-sm">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold mb-2">130+</h3>
              <p className="text-muted-foreground">Chi nhánh trên toàn quốc</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-sm">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold mb-2">98%</h3>
              <p className="text-muted-foreground">Khách hàng hài lòng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tầm nhìn & Sứ mệnh</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi không ngừng nỗ lực để nâng tầm trải nghiệm và vẻ đẹp cho
              nam giới Việt Nam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border rounded-xl bg-card">
              <h3 className="text-2xl font-bold mb-4">Tầm nhìn</h3>
              <p className="text-muted-foreground mb-4">
                Trở thành thương hiệu chăm sóc tóc và ngoại hình cho nam giới
                hàng đầu Đông Nam Á, mang đến những trải nghiệm đẳng cấp và giá
                trị vượt trội cho khách hàng.
              </p>
              <ul className="space-y-2">
                {[
                  'Phát triển bền vững',
                  'Mở rộng thị trường quốc tế',
                  'Đổi mới không ngừng',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 border rounded-xl bg-card">
              <h3 className="text-2xl font-bold mb-4">Sứ mệnh</h3>
              <p className="text-muted-foreground mb-4">
                Kiến tạo vẻ đẹp, tôn vinh cá tính và nâng cao sự tự tin cho nam
                giới Việt Nam thông qua những dịch vụ chất lượng và trải nghiệm
                khách hàng xuất sắc.
              </p>
              <ul className="space-y-2">
                {[
                  'Chất lượng dịch vụ hàng đầu',
                  'Trải nghiệm khách hàng xuất sắc',
                  'Giá trị vượt trội',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Đội ngũ lãnh đạo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những người đứng sau thành công của 30Shine
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Nguyễn Văn A', role: 'Nhà sáng lập & CEO' },
              { name: 'Trần Thị B', role: 'Giám đốc Marketing' },
              { name: 'Lê Văn C', role: 'Giám đốc Vận hành' },
              { name: 'Phạm Thị D', role: 'Giám đốc Đào tạo' },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-card rounded-xl overflow-hidden shadow-sm"
              >
                <img
                  src={ourStoryImages[0]}
                  alt={member.name}
                  className="object-cover"
                  width={350}
                />
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
