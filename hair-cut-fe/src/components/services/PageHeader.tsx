import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  onAddService: () => void
}

export function PageHeader({ onAddService }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Dịch vụ</h1>
        <p className="text-gray-600">Quản lý tất cả các dịch vụ của salon</p>
      </div>
      <Button
        onClick={onAddService}
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
      >
        <Plus size={16} />
        Thêm dịch vụ mới
      </Button>
    </div>
  )
}
