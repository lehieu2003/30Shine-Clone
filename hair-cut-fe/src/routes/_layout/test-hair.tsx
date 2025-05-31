import { createFileRoute } from '@tanstack/react-router'
import VirtualTryOn from '@/components/VirtualTryOn'

export const Route = createFileRoute('/_layout/test-hair')({
  component: VirtualTryOnPage,
})

function VirtualTryOnPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Thử Kiểu Tóc Online
          </h1>
          <p className="text-gray-600">
            Tải ảnh của bạn lên và thử các kiểu tóc khác nhau bằng cách kéo thả
          </p>
        </div>
        <div className="min-h-[600px]">
          <VirtualTryOn />
        </div>
      </div>
    </div>
  )
}
