import { Link, createFileRoute, useLoaderData } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import type { Service } from '@/services/service.service'
import serviceService from '@/services/service.service'

export const Route = createFileRoute('/_layout/services/hair-cut/')({
  loader: async () => {
    const data = await serviceService.queryServices({
      sortDirection: 'desc',
      sortBy: 'price',
    })
    return data.data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useLoaderData({
    from: '/_layout/services/hair-cut/',
  })
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-4">
        <div className="w-1 h-8 bg-blue-500 mr-3"></div>
        <h1 className="text-2xl font-bold text-blue-900">CẮT TÓC</h1>
      </div>

      <p className="text-gray-600 mb-8">
        Trải nghiệm cắt tóc phong cách đẳng cấp dành riêng cho phái mạnh, vừa
        tiện lợi vừa thư giãn tại đây
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((service: Service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      <div className="w-full flex justify-center mt-10">
        <button className="bg-blue-100 hover:bg-blue-200 mx-auto text-xl py-5 px-15 cursor-pointer text-blue-900 font-bold rounded-md whitespace-nowrap">
          <Link to="/booking"> ĐẶT LỊCH NGAY</Link>
        </button>
      </div>
    </main>
  )
}

interface ServiceCardProps {
  service: Service
}
function ServiceCard({ service }: ServiceCardProps) {
  const stepCount = service.steps.length

  const steps = service.steps

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-2 h-14 capitalize">
        {service.serviceName}
      </h2>
      <div className="text-gray-600 mb-4 line-clamp-2 h-12 overflow-hidden">
        {service.description}
      </div>

      {stepCount === 0 ? (
        <div className="mb-4 flex-grow">
          <div className="rounded-lg overflow-hidden h-32">
            <img
              src="/api/placeholder/400/320"
              alt="No service steps available"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : stepCount === 1 ? (
        <div className="mb-4 flex-grow">
          <div className="rounded-lg overflow-hidden h-32">
            <img
              src={steps[0].stepImageUrl}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : stepCount === 2 ? (
        <div className="grid grid-cols-2 gap-2 mb-4 flex-grow">
          <div className="rounded-lg overflow-hidden h-32">
            <img
              src={steps[0].stepImageUrl}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden h-32">
            <img
              src={steps[1].stepImageUrl}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 mb-4 flex-grow">
          <div className="rounded-lg overflow-hidden">
            <img
              src={steps[0].stepImageUrl}
              className="w-full h-32 object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="rounded-lg overflow-hidden">
              <img
                src={steps[1].stepImageUrl}
                className="w-full h-14 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={steps[2].stepImageUrl}
                className="w-full h-14 object-cover"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-blue-500 text-blue-500 text-sm">
          {service.estimatedTime} phút
        </div>
        <Link
          to={`/services/hair-cut/$id`}
          params={{
            id: service.id + '',
          }}
          className="text-blue-500 flex items-center hover:underline"
        >
          Tìm hiểu thêm <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  )
}
