import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Service } from '@/types/service'
import { deleteService } from '@/lib/api/services'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteServiceDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  service: Service | null
}

export function DeleteServiceDialog({
  isOpen,
  onOpenChange,
  service,
}: DeleteServiceDialogProps) {
  const queryClient = useQueryClient()

  const deleteServiceMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      onOpenChange(false)
    },
  })

  const handleConfirmDelete = () => {
    if (!service) return
    deleteServiceMutation.mutate(service.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa dịch vụ</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-700">
            Bạn có chắc chắn muốn xóa dịch vụ{' '}
            <span className="font-semibold">{service?.serviceName}</span>?
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteServiceMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={deleteServiceMutation.isPending}
          >
            {deleteServiceMutation.isPending ? 'Đang xóa...' : 'Xóa dịch vụ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
