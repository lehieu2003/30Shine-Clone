import { Link, createFileRoute, useLoaderData } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import serviceService from '@/services/service.service'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/_layout/services/hair-cut/$id')({
  loader: async ({ params }) => {
    const serviceId = params.id
    const data = await serviceService.getServiceById(Number(serviceId))
    return data.data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const service = useLoaderData({
    from: '/_layout/services/hair-cut/$id',
  })

  useEffect(() => {
    if (user) {
      setPhoneNumber(user.phone)
    }
  }, [user])

  const handleBooking = () => {
    if (user?.phone) {
      // Redirect to booking page with phone number as a query parameter
      window.location.href = `/booking?phoneNumber=${phoneNumber}`
    } else {
      // Handle case when phone number is not available
      alert('Vui lòng đăng nhập để đặt lịch hẹn.')
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        to="/services/hair-cut"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Quay lại danh sách dịch vụ
      </Link>

      <div className="bg-blue-900 text-white py-4 px-6 rounded-lg mb-6">
        <h1 className="text-xl md:text-2xl font-bold uppercase">
          {service.serviceName}
        </h1>
      </div>

      <div className="relative w-full h-64 md:h-80 bg-gradient-to-r from-orange-400 to-blue-500 rounded-lg overflow-hidden mb-8">
        <img
          src={service.bannerImageUrl}
          alt="Massage đá nóng Himalaya"
          className="absolute right-0 top-0 h-full w-full object-cover"
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-1 h-8 bg-blue-500 mr-3"></div>
          <h2 className="text-2xl font-bold text-blue-900">
            QUY TRÌNH DỊCH VỤ
          </h2>
        </div>

        <p className="text-gray-600 mb-6">{service.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {service.steps.map((step) => (
            <div
              className="bg-white rounded-lg overflow-hidden shadow-sm"
              key={step.id}
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={step.stepImageUrl}
                  alt="Massage vùng lưng"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center ">
                <h3 className="text-blue-800 font-semibold">
                  {step.stepTitle}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-center">
        <Button
          className="bg-blue-100 hover:bg-blue-200 mx-auto text-xl py-5 px-15 cursor-pointer text-blue-900 font-bold rounded-md whitespace-nowrap"
          onClick={handleBooking}
        >
          ĐẶT LỊCH NGAY
        </Button>
      </div>
    </main>
  )
}
