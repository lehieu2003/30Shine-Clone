import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  CreditCard,
  Minus,
  Plus,
  Trash2,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/formatters'
import { Skeleton } from '@/components/ui/skeleton'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// import axios from 'axios'
import apiClient from '@/lib/api'

export const Route = createFileRoute('/_layout/shopping/cart/cart')({
  component: CartPage,
})

function CartPage() {
  const navigate = useNavigate()
  const {
    cart,
    isLoading,
    updateCartItem,
    removeFromCart,
    getCartTotal,
    clearCart,
  } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'momo'>('cod')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  if (isLoading) {
    return <CartSkeleton />
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
          <p className="text-muted-foreground mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Button asChild>
            <Link to="/shopping">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handlePayment = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmPayment = async () => {
    setIsProcessing(true)
    try {
      if (paymentMethod === 'cod') {
        // Create a unique order ID
        const orderId = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        const totalAmount = getCartTotal()

        // Call the COD payment API
        const response = await apiClient.post('/api/payment/cod', {
          orderId,
          amount: totalAmount,
          customerInfo: {
            items: cart.items.map((item) => ({
              productId: item.productId,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
            })),
            notes: 'Order placed through website',
          },
        })

        if (response.data.success) {
          await clearCart() // Clear the cart after successful order
          toast.success('Đặt hàng thành công!', {
            description: 'Bạn sẽ thanh toán khi nhận hàng',
          })
          // Redirect to shopping page after successful order
          setTimeout(() => {
            navigate({ to: '/shopping' })
          }, 1500) // Give user time to see the success message
        } else {
          throw new Error(response.data.message || 'Payment failed')
        }
      } else {
        // Redirect to MoMo payment page
        navigate({ to: '/shopping/cart/payment/momo' })
      }
    } catch (error) {
      console.error('Payment error:', error)
      const errorMessage =
        error instanceof Error
          ? (error as any)?.response?.data?.message || error.message
          : 'Vui lòng thử lại sau'
      toast.error('Có lỗi xảy ra', {
        description: errorMessage,
      })
    } finally {
      setIsProcessing(false)
      setShowConfirmDialog(false)
    }
  }

  return (
    <div className="container py-8">
      <Link
        to="/shopping"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Tiếp tục mua sắm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.product.imageUrl || '/placeholder.svg'}
                    alt={item.product.name}
                    className="h-24 w-24 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.product.brand}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateCartItem(item.productId, item.quantity - 1)
                            }
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            updateCartItem(item.productId, item.quantity + 1)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(
                        item.product.isDiscount
                          ? item.product.price
                          : item.product.listedPrice,
                      )}
                    </p>
                    {item.product.isDiscount && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(item.product.listedPrice)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Tổng đơn hàng</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">
                      {formatPrice(getCartTotal())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Phương thức thanh toán</h3>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as 'cod' | 'momo')
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label
                      htmlFor="cod"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Wallet className="h-4 w-4" />
                      Thanh toán khi nhận hàng (COD)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label
                      htmlFor="momo"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4" />
                      Thanh toán qua MoMo
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                className="w-full mt-6"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thanh toán</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn thanh toán bằng phương thức{' '}
              {paymentMethod === 'cod' ? 'tiền mặt khi nhận hàng' : 'MoMo'}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button onClick={handleConfirmPayment} disabled={isProcessing}>
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full mt-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
