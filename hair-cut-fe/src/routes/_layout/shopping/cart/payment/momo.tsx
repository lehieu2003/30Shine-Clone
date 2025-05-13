import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/formatters'
import apiClient from '@/lib/api'

export const Route = createFileRoute('/_layout/shopping/cart/payment/momo')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { getCartTotal, cart, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [requestId, setRequestId] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [checkingStatus, setCheckingStatus] = useState(false)

  const handleDirectPayment = async () => {
    setIsProcessing(true)

    try {
      // Generate a consistent orderId that can be tracked
      const newOrderId = `MOMO_${Date.now()}`
      setOrderId(newOrderId)
      setRequestId(newOrderId) // Using same ID for request and order for simplicity

      const response = await apiClient.post('/api/payment/momo/create', {
        orderId: newOrderId,
        amount: getCartTotal(),
        // orderInfo: `Thanh toan don hang ${cart?.id}`,
        orderInfo: 'pay with MoMo',
        extraData: JSON.stringify({
          cartId: cart?.id,
        }),
      })

      if (
        response.data.success &&
        response.data.data &&
        response.data.data.payUrl
      ) {
        // Store order details in localStorage before redirecting
        localStorage.setItem(
          'momoPayment',
          JSON.stringify({
            orderId: newOrderId,
            requestId: newOrderId,
            amount: getCartTotal(),
            timestamp: Date.now(),
          }),
        )

        // Redirect to MoMo payment page
        window.location.href = response.data.data.payUrl
      } else {
        throw new Error('Failed to create payment request')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Tạo yêu cầu thanh toán thất bại', {
        description:
          (error as any)?.response?.data?.message || 'Vui lòng thử lại sau',
      })
      setIsProcessing(false)
    }
  }

  // const checkPaymentStatus = async () => {
  //   if (!orderId || !requestId) return

  //   setCheckingStatus(true)
  //   try {
  //     const response = await apiClient.post('/api/payment/momo/check-status', {
  //       orderId,
  //       requestId,
  //     })

  //     console.log('Payment status:', response.data)

  //     if (response.data.success && response.data.data) {
  //       const resultCode = response.data.data.resultCode

  //       if (resultCode === 0) {
  //         setPaymentStatus('success')
  //         toast.success('Thanh toán thành công!', {
  //           description: 'Đơn hàng của bạn đã được thanh toán',
  //         })
  //         // Clear cart after successful payment
  //         clearCart()
  //         // Redirect to order confirmation after a short delay
  //         setTimeout(() => {
  //           navigate({ to: '/' })
  //         }, 3000)
  //       } else if (resultCode === 1001) {
  //         setPaymentStatus('pending')
  //         toast.info('Đang chờ thanh toán', {
  //           description: 'Vui lòng hoàn tất thanh toán trên ứng dụng MoMo',
  //         })
  //       } else {
  //         setPaymentStatus('failed')
  //         toast.error('Thanh toán thất bại', {
  //           description: response.data.data.message || 'Vui lòng thử lại sau',
  //         })
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error checking payment status:', error)
  //     toast.error('Không thể kiểm tra trạng thái thanh toán')
  //   } finally {
  //     setCheckingStatus(false)
  //   }
  // }

  useEffect(() => {
    const savedPayment = localStorage.getItem('momoPayment')
    if (savedPayment) {
      try {
        const paymentData = JSON.parse(savedPayment)
        // Only use saved data if it's recent (within last hour)
        if (Date.now() - paymentData.timestamp < 60 * 60 * 1000) {
          setOrderId(paymentData.orderId)
          setRequestId(paymentData.requestId)
        } else {
          // Clear old payment data
          localStorage.removeItem('momoPayment')
        }
      } catch (e) {
        console.error('Error parsing saved payment data', e)
        localStorage.removeItem('momoPayment')
      }
    }

    // let statusCheckInterval: any

    // if (orderId && requestId && !paymentStatus) {
    //   // Check immediately
    //   checkPaymentStatus()

    //   // Then check every 5 seconds
    //   statusCheckInterval = setInterval(checkPaymentStatus, 5000)
    // }

    // return () => {
    //   if (statusCheckInterval) clearInterval(statusCheckInterval)
    // }
  }, [orderId, requestId])

  // Handle payment status display
  const renderPaymentStatusMessage = () => {
    if (!paymentStatus) return null

    switch (paymentStatus) {
      case 'success':
        return (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
            <strong className="font-bold">Thanh toán thành công!</strong>
            <p>
              Đơn hàng của bạn đã được xác nhận. Đang chuyển hướng đến trang đơn
              hàng...
            </p>
          </div>
        )
      case 'pending':
        return (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mt-4">
            <strong className="font-bold">Đang chờ thanh toán</strong>
            <p>Vui lòng hoàn tất thanh toán trên ứng dụng MoMo của bạn</p>
          </div>
        )
      case 'failed':
        return (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
            <strong className="font-bold">Thanh toán thất bại</strong>
            <p>Vui lòng thử lại hoặc chọn phương thức thanh toán khác</p>
          </div>
        )
      default:
        return null
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

              {renderPaymentStatusMessage()}

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Bạn sẽ được chuyển đến trang thanh toán MoMo để hoàn tất giao
                  dịch
                </p>

                <Button
                  onClick={handleDirectPayment}
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Thanh toán bằng MoMo
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Hướng dẫn thanh toán
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>
                    Nhấn "Thanh toán bằng MoMo" để chuyển đến trang thanh toán
                  </li>
                  <li>Hoàn tất giao dịch trên trang thanh toán MoMo</li>
                  <li>Quay lại trang này để kiểm tra trạng thái thanh toán</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
