import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import dayjs from 'dayjs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const createUserSchema = z.object({
  fullName: z.string().min(1, { message: 'Họ tên không được để trống' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu tối thiểu 6 ký tự' }),
  phone: z
    .string()
    .min(8, { message: 'Số điện thoại không hợp lệ' })
    .max(15, { message: 'Số điện thoại không hợp lệ' }),
  role: z.enum(['admin', 'receptionist', 'barber', 'customer'], {
    message: 'Vui lòng chọn vai trò hợp lệ',
  }),
  gender: z.boolean().nullable(),
  address: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  CCCD: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  availabilityStatus: z.enum(['available', 'unavailable']).optional(),
})

const updateUserSchema = createUserSchema.extend({
  password: z
    .string()
    .transform((val) => {
      const trimmed = val.trim()
      return trimmed === '' ? undefined : trimmed
    })
    .refine(
      (val) => {
        if (!val) return true
        return val.length >= 6
      },
      {
        message: 'Mật khẩu tối thiểu 6 ký tự',
      },
    )
    .optional(),
})

export function CreateUserModal({
  isOpen,
  onClose,
  onSubmit,
  type,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  type: 'customer' | 'employee'
}) {
  const RESOURCE_DISPLAY = type == 'employee' ? 'Nhân viên' : 'Khách hàng'

  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role: type == 'customer' ? 'customer' : 'barber',
      gender: null,
      address: '',
      birthDate: undefined,
      CCCD: '',
      status: 'active',
      availabilityStatus: 'available',
    },
  })

  const handleSubmit = (data: any) => {
    onSubmit(data)
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm {RESOURCE_DISPLAY} mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo {RESOURCE_DISPLAY} mới trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <Select
                      disabled={type === 'customer'}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="receptionist">Lễ tân</SelectItem>
                        <SelectItem value="barber">Thợ cắt tóc</SelectItem>
                        {type == 'customer' && (
                          <SelectItem value="customer">Khách hàng</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === 'true') field.onChange(true)
                        else if (value === 'false') field.onChange(false)
                        else field.onChange(null)
                      }}
                      value={
                        field.value === true
                          ? 'true'
                          : field.value === false
                            ? 'false'
                            : 'null'
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Nam</SelectItem>
                        <SelectItem value="false">Nữ</SelectItem>
                        <SelectItem value="null">Chưa xác định</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="CCCD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CCCD</FormLabel>
                    <FormControl>
                      <Input placeholder="Số căn cước công dân" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày sinh</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'DD/MM/YYYY')
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">
                          Không hoạt động
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('role') !== 'customer' && (
                <FormField
                  control={form.control}
                  name="availabilityStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái làm việc</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Sẵn sàng</SelectItem>
                          <SelectItem value="unavailable">Bận</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">Thêm {RESOURCE_DISPLAY}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function EditUserModal({
  isOpen,
  onClose,
  onSubmit,
  type,

  user,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  type: 'customer' | 'employee'

  user: any
}) {
  const RESOURCE_DISPLAY = type == 'employee' ? 'Nhân viên' : 'Khách hàng'
  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      password: '',
      phone: user?.phone || '',
      role: user?.role || 'customer',
      gender: user?.gender,
      address: user?.address || '',
      birthDate: user?.birthDate ? new Date(user.birthDate) : undefined,
      CCCD: user?.CCCD || '',
      status: user?.status || 'active',
      availabilityStatus: user?.availabilityStatus || 'available',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
        role: user.role || 'customer',
        gender: user.gender,
        address: user.address || '',
        birthDate: dayjs(user.birthDate).isValid()
          ? new Date(user.birthDate)
          : undefined,
        CCCD: user.CCCD || '',
        status: user.status || 'active',
        availabilityStatus: user.availabilityStatus || 'available',
      })
    }
  }, [user, form])

  const handleSubmit = (data: any) => {
    if (!data.password) {
      delete data.password
    }
    onSubmit(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa {RESOURCE_DISPLAY}</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin {RESOURCE_DISPLAY} #{user?.id}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mật khẩu (để trống nếu không thay đổi)
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="receptionist">Lễ tân</SelectItem>
                        <SelectItem value="barber">Thợ cắt tóc</SelectItem>
                        <SelectItem value="customer">Khách hàng</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === 'true') field.onChange(true)
                        else if (value === 'false') field.onChange(false)
                        else field.onChange(null)
                      }}
                      value={
                        field.value === true
                          ? 'true'
                          : field.value === false
                            ? 'false'
                            : 'null'
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Nam</SelectItem>
                        <SelectItem value="false">Nữ</SelectItem>
                        <SelectItem value="null">Chưa xác định</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="CCCD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CCCD</FormLabel>
                    <FormControl>
                      <Input placeholder="Số căn cước công dân" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày sinh</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              dayjs(field.value).format('DD/MM/YYYY')
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">
                          Không hoạt động
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('role') === 'barber' && (
                <FormField
                  control={form.control}
                  name="availabilityStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái làm việc</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || 'available'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Sẵn sàng</SelectItem>
                          <SelectItem value="unavailable">Bận</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">Cập nhật</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function ViewUserModal({
  isOpen,
  onClose,
  user,
  type,
}: {
  isOpen: boolean
  onClose: () => void
  user: any
  type: 'customer' | 'employee'
}) {
  if (!user) return null
  const RESOURCE_DISPLAY = type == 'employee' ? 'Nhân viên' : 'Khách hàng'
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thông tin {RESOURCE_DISPLAY}</DialogTitle>
          <DialogDescription>
            Chi tiết về {RESOURCE_DISPLAY} #{user.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Họ tên</p>
            <p className="text-sm font-semibold">{user.fullName}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-sm font-semibold">{user.email}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
            <p className="text-sm font-semibold">{user.phone}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Vai trò</p>
            <p className="text-sm font-semibold">
              {user.role === 'admin'
                ? 'Admin'
                : user.role === 'receptionist'
                  ? 'Lễ tân'
                  : user.role === 'barber'
                    ? 'Thợ cắt tóc'
                    : 'Khách hàng'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Giới tính</p>
            <p className="text-sm font-semibold">
              {user.gender === true
                ? 'Nam'
                : user.gender === false
                  ? 'Nữ'
                  : 'Chưa xác định'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
            <p className="text-sm font-semibold">
              {user.birthDate && dayjs(user.birthDate).isValid()
                ? dayjs(user.birthDate).format('DD/MM/YYYY')
                : 'Chưa có thông tin'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">CCCD</p>
            <p className="text-sm font-semibold">
              {user.CCCD || 'Chưa có thông tin'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Trạng thái</p>
            <p className="text-sm font-semibold">
              {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </p>
          </div>

          {user.role === 'barber' && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Trạng thái làm việc
              </p>
              <p className="text-sm font-semibold">
                {user.availabilityStatus === 'available' ? 'Sẵn sàng' : 'Bận'}
              </p>
            </div>
          )}

          <div className="col-span-2 space-y-1">
            <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
            <p className="text-sm font-semibold">
              {user.address || 'Chưa có thông tin'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
            <p className="text-sm font-semibold">
              {dayjs(user.createdAt).isValid()
                ? dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')
                : 'Chưa có thông tin'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">
              Cập nhật lần cuối
            </p>
            <p className="text-sm font-semibold">
              {dayjs(user.updatedAt).isValid()
                ? dayjs(user.updatedAt).format('DD/MM/YYYY HH:mm')
                : 'Chưa có thông tin'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  type,
}: any) {
  const RESOURCE_DISPLAY = type == 'employee' ? 'Nhân viên' : 'Khách hàng'
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function useDebounce(value: any, delay: any) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
