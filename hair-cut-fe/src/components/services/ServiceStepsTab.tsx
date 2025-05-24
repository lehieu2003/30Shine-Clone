import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit, GripVertical, Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { StepFormModal } from '../StepFormModal'
import type { DragEndEvent } from '@dnd-kit/core'
import type { Service, Step } from '@/types/service'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  createStep,
  deleteStep,
  updateStep,
  updateStepOrder,
} from '@/lib/api/step'

const TOAST_MESSAGES = {
  updateSuccess: {
    title: 'Cập nhật thành công',
    description: 'Các bước thực hiện đã được cập nhật.',
  },
  updateError: {
    title: 'Cập nhật thất bại',
    description: 'Đã xảy ra lỗi khi cập nhật các bước.',
  },
  deleteSuccess: {
    title: 'Xóa bước thành công',
    description: 'Bước thực hiện đã được xóa.',
  },
  deleteError: {
    title: 'Xóa bước thất bại',
    description: 'Đã xảy ra lỗi khi xóa bước.',
  },
  savePositionSuccess: {
    title: 'Lưu vị trí thành công',
    description: 'Thứ tự các bước đã được cập nhật.',
  },
  savePositionError: {
    title: 'Lưu vị trí thất bại',
    description: 'Đã xảy ra lỗi khi lưu thứ tự các bước.',
  },
}

function SortableTableRow({
  step,
  onEdit,
  onDelete,
}: {
  step: Step
  onEdit: (step: Step) => void
  onDelete: (step: Step) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.stepOrder.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleEdit = useCallback(() => onEdit(step), [step, onEdit])
  const handleDelete = useCallback(() => onDelete(step), [step, onDelete])

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'bg-gray-50' : ''}`}
    >
      <td className="w-10 pr-0 border-b p-4">
        <div className="cursor-grab" {...attributes} {...listeners}>
          <GripVertical size={16} className="text-gray-400" />
        </div>
      </td>
      <td className="text-center font-medium border-b p-4">{step.stepOrder}</td>
      <td className="border-b p-4">{step.stepTitle}</td>
      <td className="max-w-xs truncate border-b p-4">{step.stepDescription}</td>
      <td className="border-b p-4">
        {step.stepImageUrl && (
          <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={step.stepImageUrl}
              alt={step.stepTitle}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </td>
      <td className="text-right border-b p-4">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0"
          >
            <Edit size={16} className="text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0"
          >
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

interface ServiceStepsTabProps {
  service: Service
  serviceId: string
}

interface ModalState {
  isAddOpen: boolean
  isEditOpen: boolean
  isDeleteOpen: boolean
  currentStep: Step | null
}

export function ServiceStepsTab({ service, serviceId }: ServiceStepsTabProps) {
  const queryClient = useQueryClient()
  const [steps, setSteps] = useState<Array<Step>>([])
  const [modalState, setModalState] = useState<ModalState>({
    isAddOpen: false,
    isEditOpen: false,
    isDeleteOpen: false,
    currentStep: null,
  })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    if (service.steps?.length) {
      setSteps(service.steps)
      setHasUnsavedChanges(false)
    } else {
      setSteps([])
    }
  }, [service])

  const serviceQueryKeys = useMemo(
    () => ({
      services: ['services'],
      service: ['service', serviceId],
    }),
    [serviceId],
  )

  const invalidateServiceQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: serviceQueryKeys.services })
    queryClient.invalidateQueries({ queryKey: serviceQueryKeys.service })
  }, [queryClient, serviceQueryKeys])

  const createStepMutation = useMutation({
    mutationFn: createStep,
    onSuccess: () => {
      invalidateServiceQueries()
      toast(TOAST_MESSAGES.updateSuccess.title, {
        description: TOAST_MESSAGES.updateSuccess.description,
      })
    },
    onError: (error) => {
      toast(TOAST_MESSAGES.updateError.title, {
        description: error.message || TOAST_MESSAGES.updateError.description,
      })
    },
  })

  const updateStepMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      await updateStep(String(id), payload)
    },
    onSuccess: () => {
      invalidateServiceQueries()
      toast(TOAST_MESSAGES.updateSuccess.title, {
        description: TOAST_MESSAGES.updateSuccess.description,
      })
    },
    onError: (error) => {
      toast(TOAST_MESSAGES.updateError.title, {
        description: error.message || TOAST_MESSAGES.updateError.description,
      })
    },
  })

  const updateStepOrderMutation = useMutation({
    mutationFn: updateStepOrder,
    onSuccess: () => {
      invalidateServiceQueries()
      setHasUnsavedChanges(false)
      setIsSaving(false)
      toast(TOAST_MESSAGES.savePositionSuccess.title, {
        description: TOAST_MESSAGES.savePositionSuccess.description,
      })
    },
    onError: (error) => {
      setIsSaving(false)
      toast(TOAST_MESSAGES.savePositionError.title, {
        description:
          error.message || TOAST_MESSAGES.savePositionError.description,
      })
    },
  })

  const deleteStepMutation = useMutation({
    mutationFn: async (stepId: number) => {
      await deleteStep(String(stepId))
    },
    onSuccess: () => {
      invalidateServiceQueries()
      toast(TOAST_MESSAGES.deleteSuccess.title, {
        description: TOAST_MESSAGES.deleteSuccess.description,
      })
    },
    onError: (error) => {
      toast(TOAST_MESSAGES.deleteError.title, {
        description: error.message || TOAST_MESSAGES.deleteError.description,
      })
    },
  })

  const openAddDialog = useCallback(() => {
    setModalState((prev) => ({ ...prev, isAddOpen: true }))
  }, [])

  const openEditDialog = useCallback((step: Step) => {
    setModalState((prev) => ({
      ...prev,
      isEditOpen: true,
      currentStep: step,
    }))
  }, [])

  const openDeleteDialog = useCallback((step: Step) => {
    setModalState((prev) => ({
      ...prev,
      isDeleteOpen: true,
      currentStep: step,
    }))
  }, [])

  const closeAllDialogs = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isAddOpen: false,
      isEditOpen: false,
      isDeleteOpen: false,
    }))
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    setSteps((items) => {
      const oldIndex = items.findIndex(
        (item) => item.stepOrder.toString() === active.id.toString(),
      )
      const newIndex = items.findIndex(
        (item) => item.stepOrder.toString() === over.id.toString(),
      )

      const reorderedItems = arrayMove(items, oldIndex, newIndex)
      const updatedItems = reorderedItems.map((step, index) => ({
        ...step,
        stepOrder: index + 1,
      }))

      setHasUnsavedChanges(true)
      return updatedItems
    })
  }, [])

  const handleSavePositions = useCallback(async () => {
    if (!steps.length) return

    try {
      setIsSaving(true)
      const payload = steps
        .filter((step) => step.id)
        .map((step) => ({
          stepId: step.id!,
          order: step.stepOrder,
        }))

      updateStepOrderMutation.mutate(payload)
    } catch (error: any) {
      setIsSaving(false)
      toast(TOAST_MESSAGES.savePositionError.title, {
        description:
          error.message || TOAST_MESSAGES.savePositionError.description,
      })
    }
  }, [steps, updateStepOrderMutation])

  const handleResetPositions = useCallback(() => {
    setSteps(service.steps || [])
    setHasUnsavedChanges(false)
  }, [service.steps])

  const handleAddStep = useCallback(
    (data: any) => {
      createStepMutation.mutate({
        serviceId: Number(serviceId),
        stepName: data.stepTitle,
        description: data.stepDescription,
        imageUrl: data.stepImageUrl,
      })
      closeAllDialogs()
    },
    [serviceId, createStepMutation, closeAllDialogs],
  )

  const handleEditStep = useCallback(
    (data: any) => {
      const { currentStep } = modalState

      if (!currentStep?.id) return

      updateStepMutation.mutate({
        id: currentStep.id,
        payload: {
          stepId: currentStep.id,
          stepName: data.stepTitle,
          description: data.stepDescription,
          imageUrl: data.stepImageUrl,
        },
      })
      closeAllDialogs()
    },
    [modalState, updateStepMutation, closeAllDialogs],
  )

  const handleDeleteStep = useCallback(() => {
    const { currentStep } = modalState

    if (!currentStep?.id) return

    deleteStepMutation.mutate(currentStep.id)
    closeAllDialogs()
  }, [modalState, deleteStepMutation, closeAllDialogs])

  const newStepDefaultValues = useMemo(
    () => ({
      stepOrder: steps.length + 1,
      stepTitle: '',
      stepDescription: '',
      stepImageUrl: '',
    }),
    [steps.length],
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Các bước thực hiện dịch vụ</h3>
        <div className="flex gap-3">
          {hasUnsavedChanges && (
            <>
              <Button
                onClick={handleResetPositions}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save size={16} />
                Khôi phục vị trí
              </Button>
              <Button
                onClick={handleSavePositions}
                variant="outline"
                className="flex items-center gap-2"
                disabled={isSaving}
              >
                <Save size={16} />
                {isSaving ? 'Đang lưu...' : 'Lưu vị trí'}
              </Button>
            </>
          )}
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <Plus size={16} />
            Thêm bước mới
          </Button>
        </div>
      </div>

      {steps.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">
            Chưa có bước thực hiện nào được thêm
          </p>
          <Button
            variant="outline"
            onClick={openAddDialog}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            Thêm bước đầu tiên
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-10 text-left p-4 font-medium"></th>
                  <th className="w-16 text-center p-4 font-medium">STT</th>
                  <th className="text-left p-4 font-medium">Tiêu đề</th>
                  <th className="text-left p-4 font-medium">Mô tả</th>
                  <th className="text-left p-4 font-medium">Hình ảnh</th>
                  <th className="w-24 text-right p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <SortableContext
                  items={steps.map((step) => step.stepOrder.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  {steps.map((step) => (
                    <SortableTableRow
                      key={`step-${step.id}-${step.stepOrder}`}
                      step={step}
                      onEdit={openEditDialog}
                      onDelete={openDeleteDialog}
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
        </div>
      )}

      {/* Add Step Modal */}
      <StepFormModal
        isOpen={modalState.isAddOpen}
        onOpenChange={(open) =>
          setModalState((prev) => ({ ...prev, isAddOpen: open }))
        }
        onSubmit={handleAddStep}
        title="Thêm bước thực hiện mới"
        submitButtonText="Thêm bước"
        defaultValues={newStepDefaultValues}
        isSubmitting={createStepMutation.isPending}
      />

      {/* Edit Step Modal */}
      <StepFormModal
        isOpen={modalState.isEditOpen}
        onOpenChange={(open) =>
          setModalState((prev) => ({ ...prev, isEditOpen: open }))
        }
        onSubmit={handleEditStep}
        title="Chỉnh sửa bước thực hiện"
        submitButtonText="Cập nhật"
        defaultValues={modalState.currentStep}
        isSubmitting={updateStepMutation.isPending}
      />

      {/* Delete Step Confirmation */}
      <AlertDialog
        open={modalState.isDeleteOpen}
        onOpenChange={(open) =>
          setModalState((prev) => ({ ...prev, isDeleteOpen: open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bước</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bước "
              {modalState.currentStep?.stepTitle}"? Hành động này không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStep}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa bước
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
