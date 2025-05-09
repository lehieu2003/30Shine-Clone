import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { Service } from '@/types/service'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/formatters'

interface ServiceSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  services: Array<Service>
  selectedServiceIds: Array<number>
  onConfirm: (selectedIds: Array<number>) => void
}

const ServiceSelectionModal: React.FC<ServiceSelectionModalProps> = ({
  isOpen,
  onClose,
  services,
  selectedServiceIds,
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [tempSelectedIds, setTempSelectedIds] =
    useState<Array<number>>(selectedServiceIds)

  useEffect(() => {
    if (isOpen) {
      setTempSelectedIds([...selectedServiceIds])
      setSearchQuery('')
    }
  }, [isOpen, selectedServiceIds])

  const filteredServices = services.filter((service) =>
    service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleService = (serviceId: number) => {
    if (tempSelectedIds.includes(serviceId)) {
      setTempSelectedIds(tempSelectedIds.filter((id) => id !== serviceId))
    } else {
      setTempSelectedIds([...tempSelectedIds, serviceId])
    }
  }

  const clearSelections = () => {
    setTempSelectedIds([])
  }

  const handleConfirm = () => {
    onConfirm(tempSelectedIds)
    onClose()
  }

  const getServiceById = (id: number) => {
    return services.find((service) => Number(service.id) == id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chọn dịch vụ</DialogTitle>
        </DialogHeader>

        {tempSelectedIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tempSelectedIds.map((id) => {
              const service = getServiceById(id)
              return service ? (
                <Badge
                  key={id}
                  variant="secondary"
                  className="flex items-center gap-1 pl-2 pr-1"
                >
                  {service.serviceName}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => toggleService(id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ) : null
            })}

            {tempSelectedIds.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={clearSelections}
              >
                Xóa tất cả
              </Button>
            )}
          </div>
        )}

        <Command className="rounded-lg border shadow-md">
          <CommandList>
            <CommandInput
              placeholder="Tìm kiếm dịch vụ..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>Không tìm thấy dịch vụ</CommandEmpty>
            <CommandGroup>
              {filteredServices.map((service) => (
                <CommandItem
                  key={service.id}
                  value={service.serviceName}
                  onSelect={() => toggleService(service.id)}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span>{service.serviceName}</span>
                    <span className="text-sm text-muted-foreground">
                      {service.estimatedTime} phút
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {formatPrice(service.price)}
                    </span>
                    <span
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-md border',
                        tempSelectedIds.includes(service.id)
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'opacity-50',
                      )}
                    >
                      {tempSelectedIds.includes(service.id) && (
                        <Check className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="text-sm">
            Đã chọn:{' '}
            <span className="font-medium">{tempSelectedIds.length}</span> dịch
            vụ
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleConfirm}>Xác nhận</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ServiceSelectionModal
