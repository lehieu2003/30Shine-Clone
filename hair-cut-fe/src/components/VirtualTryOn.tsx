import React, { useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'
import {
  Move,
  RotateCcw,
  RotateCw,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Hair images from local hairstyles folder
const HAIR_STYLES = [
  {
    id: 1,
    name: 'Classic Style',
    url: '/images/hairstyles/download.jpg',
  },
  {
    id: 2,
    name: 'Modern Cut',
    url: '/images/hairstyles/download (1).jpg',
  },
  {
    id: 3,
    name: 'Trendy Look',
    url: '/images/hairstyles/download (2).jpg',
  },
  {
    id: 4,
    name: 'Stylish Hair',
    url: '/images/hairstyles/download (3).jpg',
  },
]

export default function VirtualTryOn() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [selectedHair, setSelectedHair] = useState<number | null>(null)
  const [currentHairObject, setCurrentHairObject] =
    useState<fabric.Image | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUsingDefaultImage, setIsUsingDefaultImage] = useState<boolean>(true)

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 600,
        backgroundColor: '#f8f9fa',
      })

      setCanvas(fabricCanvas)

      // Load default head image
      loadDefaultImage(fabricCanvas)

      return () => {
        fabricCanvas.dispose()
      }
    }
  }, [])

  const loadDefaultImage = (canvasInstance: fabric.Canvas) => {
    fabric.Image.fromURL('/images/head_madacan.jpg').then((img) => {
      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = canvasInstance.getWidth()
      const canvasHeight = canvasInstance.getHeight()
      const imgWidth = img.width
      const imgHeight = img.height

      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight)

      img.set({
        scaleX: scale,
        scaleY: scale,
        left: (canvasWidth - imgWidth * scale) / 2,
        top: (canvasHeight - imgHeight * scale) / 2,
        selectable: false,
        evented: false,
      })

      canvasInstance.backgroundImage = img
      canvasInstance.renderAll()
      setIsUsingDefaultImage(true)
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && canvas) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setUploadedImage(imageUrl)

        fabric.Image.fromURL(imageUrl).then((img) => {
          // Scale image to fit canvas while maintaining aspect ratio
          const canvasWidth = canvas.getWidth()
          const canvasHeight = canvas.getHeight()
          const imgWidth = img.width
          const imgHeight = img.height

          const scale = Math.min(
            canvasWidth / imgWidth,
            canvasHeight / imgHeight,
          )

          img.set({
            scaleX: scale,
            scaleY: scale,
            left: (canvasWidth - imgWidth * scale) / 2,
            top: (canvasHeight - imgHeight * scale) / 2,
            selectable: false,
            evented: false,
          })

          canvas.backgroundImage = img
          canvas.renderAll()
          setIsUsingDefaultImage(false)
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHairSelection = (hairStyle: (typeof HAIR_STYLES)[0]) => {
    if (!canvas) return

    setSelectedHair(hairStyle.id)

    // Remove current hair if exists
    if (currentHairObject) {
      canvas.remove(currentHairObject)
    }

    fabric.Image.fromURL(hairStyle.url).then((img) => {
      // Set initial properties for the hair image
      img.set({
        left: canvas.getWidth() / 2 - 100,
        top: canvas.getHeight() / 4,
        scaleX: 0.8,
        scaleY: 0.8,
        transparentCorners: false,
        cornerColor: '#2563eb',
        cornerStyle: 'circle',
        borderColor: '#2563eb',
        borderScaleFactor: 2,
      })

      canvas.add(img)
      canvas.setActiveObject(img)
      setCurrentHairObject(img)
      canvas.renderAll()
    })
  }

  const handleReset = () => {
    if (canvas && currentHairObject) {
      canvas.remove(currentHairObject)
      setCurrentHairObject(null)
      setSelectedHair(null)
      canvas.renderAll()
    }
  }

  const handleResetToDefault = () => {
    if (canvas) {
      // Remove current hair if exists
      if (currentHairObject) {
        canvas.remove(currentHairObject)
        setCurrentHairObject(null)
        setSelectedHair(null)
      }

      // Reset to default image
      setUploadedImage(null)
      loadDefaultImage(canvas)
    }
  }

  const handleRotateLeft = () => {
    if (currentHairObject) {
      const currentAngle = currentHairObject.angle || 0
      currentHairObject.set('angle', currentAngle - 15)
      canvas?.renderAll()
    }
  }

  const handleRotateRight = () => {
    if (currentHairObject) {
      const currentAngle = currentHairObject.angle || 0
      currentHairObject.set('angle', currentAngle + 15)
      canvas?.renderAll()
    }
  }

  const handleScaleUp = () => {
    if (currentHairObject) {
      const currentScale = currentHairObject.scaleX || 1
      const newScale = Math.min(currentScale + 0.1, 3)
      currentHairObject.set({
        scaleX: newScale,
        scaleY: newScale,
      })
      canvas?.renderAll()
    }
  }

  const handleScaleDown = () => {
    if (currentHairObject) {
      const currentScale = currentHairObject.scaleX || 1
      const newScale = Math.max(currentScale - 0.1, 0.1)
      currentHairObject.set({
        scaleX: newScale,
        scaleY: newScale,
      })
      canvas?.renderAll()
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* Upload Section */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Tải ảnh chân dung
            </h3>
            <div className="space-y-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-900 hover:bg-blue-800"
                type="button"
              >
                <Upload className="w-4 h-4 mr-2" />
                Chọn ảnh
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadedImage && (
                <div className="text-sm text-green-600">
                  ✓ Ảnh đã được tải lên thành công
                </div>
              )}
              {uploadedImage && (
                <Button
                  onClick={handleResetToDefault}
                  variant="outline"
                  className="w-full mt-2"
                >
                  Về ảnh mặc định
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hair Styles Selection */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Chọn kiểu tóc
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {HAIR_STYLES.map((hair) => (
                <div
                  key={hair.id}
                  className={cn(
                    'cursor-pointer rounded-lg border-2 p-2 transition-all',
                    selectedHair === hair.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300',
                  )}
                  onClick={() => handleHairSelection(hair)}
                >
                  <img
                    src={hair.url}
                    alt={hair.name}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                  <p className="text-xs text-center font-medium">{hair.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        {currentHairObject && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Điều chỉnh
              </h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handleRotateLeft}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Xoay trái
                  </Button>
                  <Button
                    onClick={handleRotateRight}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCw className="w-4 h-4 mr-1" />
                    Xoay phải
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleScaleDown}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <ZoomOut className="w-4 h-4 mr-1" />
                    Nhỏ hơn
                  </Button>
                  <Button
                    onClick={handleScaleUp}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <ZoomIn className="w-4 h-4 mr-1" />
                    Lớn hơn
                  </Button>
                </div>
                <Button
                  onClick={handleReset}
                  variant="destructive"
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Xóa kiểu tóc
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Canvas Section */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardContent className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Khu vực thử nghiệm
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <canvas ref={canvasRef} className="border rounded" />
              </div>
            </div>
            {!uploadedImage && isUsingDefaultImage && (
              <div className="text-center text-blue-600 mt-4">
                <p className="text-sm">
                  📸 Đang sử dụng ảnh mẫu. Tải ảnh của bạn hoặc chọn kiểu tóc để
                  thử nghiệm!
                </p>
              </div>
            )}
            {!uploadedImage && !isUsingDefaultImage && (
              <div className="text-center text-gray-500 mt-4">
                <Move className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Tải ảnh lên để bắt đầu thử kiểu tóc</p>
              </div>
            )}
            {uploadedImage && !currentHairObject && (
              <div className="text-center text-gray-500 mt-4">
                <p>Chọn một kiểu tóc từ danh sách bên trái</p>
              </div>
            )}
            {currentHairObject && (
              <div className="text-center text-blue-600 mt-4">
                <p className="text-sm">
                  💡 Kéo thả để di chuyển, kéo góc để thay đổi kích thước
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
