import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Trash2, UploadIcon, XIcon } from 'lucide-react'
import { serviceSchema } from '@/types/service'
import { createService } from '@/lib/api/services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

interface AddServiceDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AddServiceDialog({
  isOpen,
  onOpenChange,
}: AddServiceDialogProps) {
  const queryClient = useQueryClient()
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  // Hard-coded category options
  const categoryOptions = [
    { id: 1, name: 'Cắt tóc' },
    { id: 2, name: 'Uốn tóc' },
    { id: 3, name: 'Nhuộm tóc' },
    { id: 4, name: 'Chăm sóc da' },
    { id: 5, name: 'Khác' },
  ]

  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: '',
      estimatedTime: 30,
      price: 0,
      description: '',
      bannerImageUrl: '',
      categoryId: 0,
      steps: [
        { stepOrder: 1, stepTitle: '', stepDescription: '', stepImageUrl: '' },
      ],
    },
  })

  // Set up field array for steps
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'steps',
  })

  const createServiceMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      onOpenChange(false)
      form.reset()
      setPreviewImage('')
    },
  })

  const onSubmit = (data: any) => {
    createServiceMutation.mutate(data)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      form.setValue('bannerImageUrl', data.url)
      setPreviewImage(data.url)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = async () => {
    const currentUrl = form.getValues('bannerImageUrl')
    if (!currentUrl) return

    try {
      setUploadingImage(true)

      // Extract the file path from the URL
      const filePath = currentUrl.split('/').pop()

      await fetch('/api/files/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      })

      form.setValue('bannerImageUrl', '')
      setPreviewImage('')
    } catch (error) {
      console.error('Error deleting image:', error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleStepImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const steps = form.getValues('steps')
      if (steps && steps[index]) {
        steps[index].stepImageUrl = data.url
        form.setValue('steps', steps)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Tên dịch vụ</FormLabel>
                  <FormControl>
                    <Input {...field} className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Danh mục</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={
                      field.value ? field.value.toString() : undefined
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn danh mục dịch vụ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimatedTime"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Thời gian (phút)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="col-span-3"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Giá (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="col-span-3"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bannerImageUrl"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-start gap-4">
                  <FormLabel className="text-right pt-2">Hình ảnh</FormLabel>
                  <div className="col-span-3 space-y-3">
                    <div className="flex flex-col gap-2">
                      {previewImage ? (
                        <div className="relative rounded-md overflow-hidden border border-gray-200">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full h-8 w-8"
                            onClick={handleRemoveImage}
                            disabled={uploadingImage}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                          <input
                            type="file"
                            id="image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploadingImage}
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center w-full h-full"
                          >
                            {uploadingImage ? (
                              <>
                                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                                <p className="text-sm text-gray-500 mt-2">
                                  Đang tải lên...
                                </p>
                              </>
                            ) : (
                              <>
                                <UploadIcon className="h-8 w-8 text-gray-400" />
                                <p className="text-sm text-gray-500 mt-2">
                                  Nhấn để tải lên ảnh
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  PNG, JPG (tối đa 5MB)
                                </p>
                              </>
                            )}
                          </label>
                        </div>
                      )}
                      <Input {...field} type="hidden" />
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-start gap-4">
                  <FormLabel className="text-right pt-2">Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="col-span-3" rows={4} />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />

            {/* Steps section */}
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right pt-2">
                <FormLabel>Các bước thực hiện</FormLabel>
              </div>
              <div className="col-span-3 space-y-3">
                {fields.map((field, index) => (
                  <Card key={field.id} className="overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Bước {index + 1}</h3>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name={`steps.${index}.stepTitle`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiêu đề</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Tiêu đề bước thực hiện"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`steps.${index}.stepDescription`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả chi tiết</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Mô tả chi tiết bước thực hiện"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`steps.${index}.stepImageUrl`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hình ảnh minh họa</FormLabel>
                            <div className="flex flex-col gap-2">
                              {field.value ? (
                                <div className="relative rounded-md overflow-hidden border border-gray-200">
                                  <img
                                    src={field.value}
                                    alt="Step preview"
                                    className="w-full h-32 object-cover"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 rounded-full h-7 w-7"
                                    onClick={() => {
                                      const steps = form.getValues('steps')
                                      steps[index].stepImageUrl = ''
                                      form.setValue('steps', steps)
                                    }}
                                    disabled={uploadingImage}
                                  >
                                    <XIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="border border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                  <input
                                    type="file"
                                    id={`step-image-upload-${index}`}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleStepImageUpload(e, index)
                                    }
                                    disabled={uploadingImage}
                                  />
                                  <label
                                    htmlFor={`step-image-upload-${index}`}
                                    className="cursor-pointer flex flex-col items-center w-full h-full"
                                  >
                                    {uploadingImage ? (
                                      <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                                    ) : (
                                      <>
                                        <UploadIcon className="h-6 w-6 text-gray-400" />
                                        <p className="text-xs text-gray-500 mt-1">
                                          Tải lên hình ảnh
                                        </p>
                                      </>
                                    )}
                                  </label>
                                </div>
                              )}
                              <Input {...field} type="hidden" />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <input
                        type="hidden"
                        {...form.register(`steps.${index}.stepOrder`)}
                        value={index + 1}
                      />
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    append({
                      stepOrder: fields.length + 1,
                      stepTitle: '',
                      stepDescription: '',
                      stepImageUrl: '',
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm bước thực hiện
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createServiceMutation.isPending || uploadingImage}
              >
                {createServiceMutation.isPending
                  ? 'Đang lưu...'
                  : 'Lưu dịch vụ'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
