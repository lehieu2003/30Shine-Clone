// /src/routes/admin-services/components/edit/StepFormModal.tsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { stepSchema } from '@/types/service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/ui/image-uploader'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface StepFormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  title: string
  submitButtonText: string
  defaultValues?: any
  isSubmitting?: boolean
}

export function StepFormModal({
  isOpen,
  onOpenChange,
  onSubmit,
  title,
  submitButtonText,
  defaultValues,
  isSubmitting = false,
}: StepFormModalProps) {
  const form = useForm({
    resolver: zodResolver(stepSchema),
    defaultValues: defaultValues || {
      stepOrder: 1,
      stepTitle: '',
      stepDescription: '',
      stepImageUrl: '',
    },
  })

  // Update form values when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  const handleSubmit = (data: any) => {
    onSubmit(data)
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="stepOrder"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thứ tự bước</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stepTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề bước</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stepDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả bước</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stepImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh minh họa</FormLabel>
                  <FormControl>
                    <ImageUploader
                      imageUrl={field.value}
                      onChange={field.onChange}
                      id={`step-image-${isOpen ? 'edit' : 'add'}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
