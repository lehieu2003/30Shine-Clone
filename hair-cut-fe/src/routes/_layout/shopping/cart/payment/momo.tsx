import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, CreditCard, Loader2, QrCode } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/formatters'
import apiClient from '@/lib/api'

export const Route = createFileRoute('/_layout/shopping/cart/payment/momo')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { getCartTotal, cart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  const handleGenerateQR = async () => {
    if (!phoneNumber.match(/^[0-9]{10}$/)) {
      toast.error('Số điện thoại không hợp lệ', {
        description: 'Vui lòng nhập số điện thoại 10 số',
      })
      return
    }

    setIsProcessing(true)

    try {
      const response = await apiClient.post('/api/payment/momo/qr/create', {
        amount: getCartTotal(),
        orderInfo: `Thanh toan don hang ${cart?.id}`,
        extraData: JSON.stringify({
          phoneNumber,
          cartId: cart?.id,
        }),
      })

      if (response.data.success && response.data.data.qrCodeUrl) {
        setQrCodeUrl(response.data.data.qrCodeUrl)
      } else {
        throw new Error('Failed to create QR payment request')
      }
    } catch (error) {
      console.error('QR Payment error:', error)
      toast.error('Tạo mã QR thất bại', {
        description: 'Vui lòng thử lại sau',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate({ to: '/shopping/cart/cart' })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại giỏ hàng
      </Button>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Thanh toán qua MoMo</CardTitle>
              <img
                src="/momo-logo.png"
                alt="MoMo"
                className="h-8"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png'
                }}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <Label>Số tiền thanh toán</Label>
                <div className="mt-2 text-2xl font-bold text-blue-600">
                  {formatPrice(getCartTotal())}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Số điện thoại MoMo</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại đã đăng ký MoMo"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  pattern="[0-9]{10}"
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Số điện thoại phải đã đăng ký và kích hoạt ví MoMo
                </p>
              </div>

              {qrCodeUrl ? (
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src={qrCodeUrl}
                    alt="MoMo QR Code"
                    className="w-64 h-64"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Quét mã QR bằng ứng dụng MoMo để thanh toán
                  </p>
                  <Button
                    onClick={() => (window.location.href = qrCodeUrl)}
                    className="w-full"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Thanh toán ngay
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleGenerateQR}
                  className="w-full"
                  disabled={isProcessing || !phoneNumber}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tạo mã QR...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" />
                      Tạo mã QR
                    </>
                  )}
                </Button>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Hướng dẫn thanh toán
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Nhập số điện thoại đã đăng ký ví MoMo</li>
                  <li>Nhấn "Tạo mã QR" để hiển thị mã thanh toán</li>
                  <li>Mở ứng dụng MoMo trên điện thoại</li>
                  <li>Chọn tính năng "Quét mã"</li>
                  <li>Quét mã QR và xác nhận thanh toán</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
