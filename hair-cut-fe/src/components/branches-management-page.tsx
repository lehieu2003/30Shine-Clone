import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Mail,
  Map,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react'

import type { Branch, BranchFormData } from '@/types/branch'
import branchApi from '@/lib/api/branch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// Form validation schema
const branchFormSchema = z.object({
  name: z.string().min(1, 'Tên chi nhánh là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  phone: z.string().optional(),
  email: z
    .string()
    .email('Định dạng email không hợp lệ')
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional(),
  description: z
    .string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional(),
  imageUrl: z
    .string()
    .transform((val) => (val === '' ? null : val))
    .nullable()
    .optional(),
  isActive: z.boolean().default(true),
})

export function AdminBranchesPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  // Form setup
  const form = useForm({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      description: '',
      imageUrl: '',
      isActive: true,
    },
  })

  // Reset form when mode changes
  useEffect(() => {
    if (formMode === 'create') {
      form.reset({
        name: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        imageUrl: '',
        isActive: true,
      })
    } else if (selectedBranch) {
      form.reset({
        name: selectedBranch.name,
        address: selectedBranch.address,
        phone: selectedBranch.phone || '',
        email: selectedBranch.email || '',
        description: selectedBranch.description || '',
        imageUrl: selectedBranch.imageUrl || '',
        isActive: selectedBranch.isActive,
      })
    }
  }, [formMode, selectedBranch, form])

  // Fetch branches
  const {
    data: branchesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['branches', currentPage, searchQuery, sortBy, sortDirection],
    queryFn: async () => {
      return branchApi.getBranches({
        keyword: searchQuery || undefined,
        page: currentPage,
        size: 6, // pageSize
        sortBy,
        sortDirection,
      })
    },
  })

  // Create branch mutation
  const createBranchMutation = useMutation({
    mutationFn: (data: BranchFormData) => branchApi.createBranch(data),
    onSuccess: () => {
      toast.success('Chi nhánh đã được tạo thành công')
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      setIsFormOpen(false)
    },
    onError: (error) => {
      toast.error(`Lỗi khi tạo chi nhánh: ${error.message}`)
    },
  })

  // Update branch mutation
  const updateBranchMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BranchFormData> }) =>
      branchApi.updateBranch(id, data),
    onSuccess: () => {
      toast.success('Chi nhánh đã được cập nhật thành công')
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      setIsFormOpen(false)
    },
    onError: (error) => {
      toast.error(`Lỗi khi cập nhật chi nhánh: ${error.message}`)
    },
  })

  // Delete branch mutation
  const deleteBranchMutation = useMutation({
    mutationFn: (id: number) => branchApi.deleteBranch(id),
    onSuccess: () => {
      toast.success('Chi nhánh đã được xóa thành công')
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      setIsDeleteDialogOpen(false)
    },
    onError: (error) => {
      toast.error(`Lỗi khi xóa chi nhánh: ${error.message}`)
    },
  })

  // Handle form submission
  const onSubmit = (data: any) => {
    if (formMode === 'create') {
      createBranchMutation.mutate(data)
    } else if (selectedBranch) {
      updateBranchMutation.mutate({ id: selectedBranch.id, data })
    }
  }

  // Handle creating a new branch
  const handleAddBranch = () => {
    setFormMode('create')
    setSelectedBranch(null)
    setIsFormOpen(true)
  }

  // Handle editing a branch
  const handleEditBranch = (branch: Branch) => {
    setFormMode('edit')
    setSelectedBranch(branch)
    setIsFormOpen(true)
  }

  // Handle deleting a branch
  const handleDeleteClick = (branch: Branch) => {
    setSelectedBranch(branch)
    setIsDeleteDialogOpen(true)
  }

  // Confirm branch deletion
  const confirmDelete = () => {
    if (selectedBranch) {
      deleteBranchMutation.mutate(selectedBranch.id)
    }
  }

  // Calculate pagination values
  const branches = branchesData?.data || []
  const totalItems = branchesData?.meta.total || 0
  const pageSize = 6
  const totalPages = Math.ceil(totalItems / pageSize)

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('')
    setCurrentPage(1)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý Chi nhánh
          </h1>
          <p className="text-gray-600">
            Quản lý tất cả các chi nhánh của hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            onClick={handleAddBranch}
          >
            <Plus size={16} />
            Thêm Chi nhánh
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => refetch()}
          >
            <RefreshCcw size={16} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Tìm kiếm theo tên, địa chỉ, số điện thoại..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>

          <Button variant="outline" onClick={resetFilters}>
            <X size={16} className="mr-2" />
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      {/* Branches List */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold w-[50px]">ID</TableHead>
                  <TableHead className="font-semibold">Tên chi nhánh</TableHead>
                  <TableHead className="font-semibold">Địa chỉ</TableHead>
                  <TableHead className="font-semibold">Liên hệ</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-right">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : branches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Không tìm thấy chi nhánh nào
                    </TableCell>
                  </TableRow>
                ) : (
                  branches.map((branch) => (
                    <TableRow key={branch.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        #{branch.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{branch.name}</div>
                        {branch.description && (
                          <div className="text-sm text-gray-500 truncate max-w-[300px]">
                            {branch.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1">
                          <Map className="h-4 w-4 text-gray-500 mt-0.5" />
                          <span>{branch.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {branch.phone && (
                          <div className="flex items-center gap-1 mb-1">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{branch.phone}</span>
                          </div>
                        )}
                        {branch.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{branch.email}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            branch.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {branch.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditBranch(branch)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(branch)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-500">
                Hiển thị {(currentPage - 1) * pageSize + 1} đến{' '}
                {Math.min(currentPage * pageSize, totalItems)} của {totalItems}{' '}
                chi nhánh
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Dynamic pagination buttons */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber

                  if (currentPage > totalPages - 3 && totalPages > 5) {
                    pageNumber = totalPages - 4 + i
                  } else if (currentPage > 3 && totalPages > 5) {
                    pageNumber = currentPage - 2 + i
                  } else {
                    pageNumber = i + 1
                  }

                  if (pageNumber > 0 && pageNumber <= totalPages) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    )
                  }
                  return null
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2 flex items-center">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Branch Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create'
                ? 'Thêm Chi nhánh Mới'
                : 'Chỉnh sửa Chi nhánh'}
            </DialogTitle>
            <DialogDescription>
              {formMode === 'create'
                ? 'Nhập thông tin để tạo chi nhánh mới.'
                : 'Cập nhật thông tin chi nhánh.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên chi nhánh</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên chi nhánh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ chi nhánh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
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
                        <Input
                          placeholder="Nhập email liên hệ"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả chi nhánh"
                        className="min-h-[100px]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh đại diện (URL)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập URL hình ảnh chi nhánh"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập URL hình ảnh đại diện cho chi nhánh.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Trạng thái hoạt động
                      </FormLabel>
                      <FormDescription>
                        Chi nhánh có đang hoạt động không?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createBranchMutation.isPending ||
                    updateBranchMutation.isPending
                  }
                >
                  {createBranchMutation.isPending ||
                  updateBranchMutation.isPending
                    ? 'Đang xử lý...'
                    : formMode === 'create'
                      ? 'Tạo chi nhánh'
                      : 'Cập nhật'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa chi nhánh</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa chi nhánh "{selectedBranch?.name}"? Hành
              động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteBranchMutation.isPending}
            >
              {deleteBranchMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default AdminBranchesPage
