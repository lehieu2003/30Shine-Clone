import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  User,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatDateTime } from '@/lib/formatters'

export const Route = createFileRoute('/_layout/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editedUser, setEditedUser] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    address: (user as any)?.address || '',
    CCCD: (user as any)?.CCCD || '',
  })

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
          <p className="text-muted-foreground">
            Vui lòng đăng nhập để xem thông tin cá nhân.
          </p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Call API to update user profile
      // const response = await userApi.updateProfile(editedUser)

      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Cập nhật thông tin thành công!')
      setIsEditing(false)
      refreshUser()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin')
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditedUser({
      fullName: user.fullName || '',
      email: user.email || '',
      address: (user as any)?.address || '',
      CCCD: (user as any)?.CCCD || '',
    })
    setIsEditing(false)
  }

  const getUserInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      manager: 'bg-blue-100 text-blue-800 border-blue-200',
      receptionist: 'bg-green-100 text-green-800 border-green-200',
      barber: 'bg-purple-100 text-purple-800 border-purple-200',
      customer: 'bg-gray-100 text-gray-800 border-gray-200',
    }

    const roleLabels = {
      admin: 'Quản trị viên',
      manager: 'Quản lý',
      receptionist: 'Lễ tân',
      barber: 'Thợ cắt tóc',
      customer: 'Khách hàng',
    }

    const colorClass =
      roleColors[role as keyof typeof roleColors] || roleColors.customer
    const label = roleLabels[role as keyof typeof roleLabels] || 'Khách hàng'

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}
      >
        {label}
      </span>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Thông tin cá nhân</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin tài khoản và cài đặt cá nhân của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Avatar and Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-lg">
                      {getUserInitials(user.fullName || user.phone)}
                    </AvatarFallback>
                  </Avatar>

                  <h2 className="text-xl font-semibold mb-1">
                    {user.fullName || 'Chưa cập nhật tên'}
                  </h2>

                  <p className="text-muted-foreground mb-3">{user.phone}</p>

                  <div className="mb-4">
                    {getRoleBadge(user.role || 'customer')}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                    disabled={isEditing}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa thông tin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Thông tin chi tiết</CardTitle>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isLoading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Đang lưu...' : 'Lưu'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Họ và tên
                      </Label>
                      {isEditing ? (
                        <Input
                          id="fullName"
                          value={editedUser.fullName}
                          onChange={(e) =>
                            setEditedUser((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }))
                          }
                          placeholder="Nhập họ và tên"
                        />
                      ) : (
                        <p className="py-2 px-3 bg-muted rounded-md">
                          {user.fullName || 'Chưa cập nhật'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Số điện thoại
                      </Label>
                      <p className="py-2 px-3 bg-muted rounded-md text-muted-foreground">
                        {user.phone} (Không thể thay đổi)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedUser.email}
                          onChange={(e) =>
                            setEditedUser((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="Nhập địa chỉ email"
                        />
                      ) : (
                        <p className="py-2 px-3 bg-muted rounded-md">
                          {user.email || 'Chưa cập nhật'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cccd" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        CCCD
                      </Label>
                      {isEditing ? (
                        <Input
                          id="cccd"
                          value={editedUser.CCCD}
                          onChange={(e) =>
                            setEditedUser((prev) => ({
                              ...prev,
                              CCCD: e.target.value,
                            }))
                          }
                          placeholder="Nhập số CCCD"
                        />
                      ) : (
                        <p className="py-2 px-3 bg-muted rounded-md">
                          {(user as any)?.CCCD || 'Chưa cập nhật'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label
                      htmlFor="address"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Địa chỉ
                    </Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editedUser.address}
                        onChange={(e) =>
                          setEditedUser((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Nhập địa chỉ"
                      />
                    ) : (
                      <p className="py-2 px-3 bg-muted rounded-md">
                        {(user as any)?.address || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Thông tin tài khoản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Vai trò
                      </Label>
                      <div className="py-2 px-3 bg-muted rounded-md">
                        {getRoleBadge(user.role || 'customer')}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Ngày tạo tài khoản
                      </Label>
                      <p className="py-2 px-3 bg-muted rounded-md">
                        {user.createdAt
                          ? formatDateTime(user.createdAt)
                          : 'Không xác định'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Lịch sử đặt lịch</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Xem tất cả các lịch hẹn đã đặt tại salon
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/my-bookings">Xem lịch sử</a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Bảo mật</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Quản lý mật khẩu và cài đặt bảo mật
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Đổi mật khẩu
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Đổi mật khẩu</DialogTitle>
                        <DialogDescription>
                          Tính năng này sẽ được triển khai trong phiên bản tiếp
                          theo.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Đóng</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
