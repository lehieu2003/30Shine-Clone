// /src/routes/admin-services/components/FiltersBar.tsx
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface FiltersBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSortChange: (value: string) => void
}

export function FiltersBar({
  searchQuery,
  onSearchChange,
  onSortChange,
}: FiltersBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex gap-2">
        <div className="flex items-center w-72">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-gray-600 text-sm">Sắp xếp theo:</span>
        <select
          className="border rounded-md px-2 py-1 text-sm"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp đến cao</option>
          <option value="price_desc">Giá: Cao đến thấp</option>
          <option value="time_asc">Thời gian: Ngắn đến dài</option>
        </select>
      </div>
    </div>
  )
}
