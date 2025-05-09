import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ServiceInfoTab } from './ServiceInfoTab'
import { ServiceStepsTab } from './ServiceStepsTab'
import type { Service } from '@/types/service'
import { getServiceById } from '@/lib/api/services'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

export function ServiceEditPage() {
  const { id } = useParams({ from: '/admin/services/$id/edit' })
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('info')

  const {
    data: service,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceById(id),
    select: (data) => {
      const steps = data.steps
      return {
        ...data,
        steps: steps.sort((a: any, b: any) => a.stepOrder - b.stepOrder),
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin dịch vụ...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không thể tải thông tin dịch vụ
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message || 'Đã xảy ra lỗi khi tải dữ liệu.'}
          </p>
          <Button onClick={() => navigate({ to: '/admin/services' })}>
            Quay lại danh sách dịch vụ
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Chỉnh sửa dịch vụ
          </h1>
          <p className="text-gray-600">
            #{id} - {service?.serviceName}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/admin/services' })}
        >
          Quay lại danh sách
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full">
            <TabsList className="h-14 w-full">
              <TabsTrigger value="info" className="px-4">
                Thông tin cơ bản
              </TabsTrigger>
              <TabsTrigger value="steps" className="px-4 ">
                Các bước thực hiện
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="info">
              <ServiceInfoTab service={service as Service} serviceId={id} />
            </TabsContent>

            <TabsContent value="steps">
              <ServiceStepsTab service={service as Service} serviceId={id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
