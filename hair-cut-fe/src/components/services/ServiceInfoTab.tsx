// /src/routes/admin-services/components/edit/ServiceInfoTab.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ImageIcon, Loader2, UploadIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { Service } from '@/types/service'
import { serviceInfoSchema } from '@/types/service'
import { updateService } from '@/lib/api/services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface ServiceInfoTabProps {
  service: Service
  serviceId: string
}

export function ServiceInfoTab({ service, serviceId }: ServiceInfoTabProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const form = useForm({
    resolver: zodResolver(serviceInfoSchema),
    defaultValues: {
      serviceName: '',
      estimatedTime: 30,
      price: 0,
      description: '',
      bannerImageUrl: '',
    },
  })

  // Update form values when service data is loaded
  useEffect(() => {
    form.reset({
      serviceName: service.serviceName,
      estimatedTime: service.estimatedTime,
      price: service.price,
      description: service.description,
      bannerImageUrl: service.bannerImageUrl,
    })
    setPreviewImage(service.bannerImageUrl)
  }, [service, form])
  const updateServiceMutation = useMutation({
    mutationFn: (data: any) => updateService(serviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['service', serviceId] })
      toast('Cập nhật thành công', {
        description: 'Thông tin dịch vụ đã được cập nhật.',
      })
      navigate({
        to: '/admin/services',
        replace: true,
      })
    },
    onError: (error) => {
      toast('Cập nhật thất bại', {
        description: error.message || 'Đã xảy ra lỗi khi cập nhật dịch vụ.',
      })
    },
  })

  const onSubmit = (data: any) => {
    updateServiceMutation.mutate(data)
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
      toast('Tải ảnh thành công', {
        description: 'Hình ảnh đã được tải lên.',
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast('Tải ảnh thất bại', {
        description: 'Đã xảy ra lỗi khi tải lên hình ảnh.',
      })
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
      toast('Xóa ảnh thành công', {
        description: 'Hình ảnh đã được xóa.',
      })
    } catch (error) {
      console.error('Error deleting image:', error)
      toast('Xóa ảnh thất bại', {
        description: 'Đã xảy ra lỗi khi xóa hình ảnh.',
      })
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="serviceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên dịch vụ</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="estimatedTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian (phút)</FormLabel>
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá (VND)</FormLabel>
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
          </div>

          <FormField
            control={form.control}
            name="bannerImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh</FormLabel>
                <Input {...field} type="hidden" />
                <div className="space-y-4">
                  {previewImage ? (
                    <div className="relative rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          type="button"
                          size="icon"
                          className="rounded-full h-8 w-8 bg-white hover:bg-white/90"
                          onClick={() => {
                            // Open file input
                            document
                              .getElementById('image-upload-edit')
                              ?.click()
                          }}
                          disabled={uploadingImage}
                        >
                          <ImageIcon className="h-4 w-4 text-gray-700" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="rounded-full h-8 w-8"
                          onClick={handleRemoveImage}
                          disabled={uploadingImage}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="image-upload-edit"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="image-upload-edit"
                        className="cursor-pointer flex flex-col items-center w-full h-full py-10"
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
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/admin/services' })}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={updateServiceMutation.isPending || uploadingImage}
            >
              {updateServiceMutation.isPending
                ? 'Đang cập nhật...'
                : 'Cập nhật dịch vụ'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
