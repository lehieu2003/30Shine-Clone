// /src/components/ui/image-uploader.tsx
import { useState } from 'react'
import { ImageIcon, Loader2, UploadIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  imageUrl: string
  onChange: (url: string) => void
  id?: string
}

export function ImageUploader({
  imageUrl,
  onChange,
  id = 'image-upload',
}: ImageUploaderProps) {
  const [uploadingImage, setUploadingImage] = useState(false)

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
      onChange(data.url)
      //   toast('Tải ảnh thành công', {
      //     description: 'Hình ảnh đã được tải lên.',
      //   })
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
    if (!imageUrl) return

    try {
      setUploadingImage(true)

      // Extract the file path from the URL
      const filePath = imageUrl.split('/').pop()

      //   await fetch('/api/files/delete', {
      //     method: 'DELETE',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ filePath }),
      //   })

      onChange('')
      //   toast('Xóa ảnh thành công', {
      //     description: 'Hình ảnh đã được xóa.',
      //   })
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
    <div className="space-y-3">
      {imageUrl ? (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              size="icon"
              className="rounded-full h-8 w-8 bg-white hover:bg-white/90"
              onClick={() => {
                document.getElementById(id)?.click()
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
            id={id}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploadingImage}
          />
          <label
            htmlFor={id}
            className="cursor-pointer flex flex-col items-center w-full h-full py-6"
          >
            {uploadingImage ? (
              <>
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <p className="text-sm text-gray-500 mt-2">Đang tải lên...</p>
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
    </div>
  )
}
