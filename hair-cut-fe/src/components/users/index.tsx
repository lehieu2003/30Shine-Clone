import React, { useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Trash2,
  User,
  UserCheck,
  UserPlus,
  UserX,
} from 'lucide-react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  ConfirmDialog,
  CreateUserModal,
  EditUserModal,
  ViewUserModal,
  useDebounce,
} from './components'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  createUser,
  deleteUser,
  fetchUsers,
  toggleActiveStatus,
  updateUser,
} from '@/lib/api/users'
import { Input } from '@/components/ui/input'

type Role = 'admin' | 'receptionist' | 'barber' | 'customer'
type UserStatus = 'active' | 'inactive'

type UserType = {
  id: number
  password: string
  email: string
  phone: string
  role: Role
  fullName: string
  gender: boolean | null
  address: string | null
  birthDate: string | null
  CCCD: string | null
  status: UserStatus
  createdAt: string
  updatedAt: string
}
interface UsersPageProps {
  type: 'employee' | 'customer'
}
export default function UsersPage({ type }: UsersPageProps) {
  const RESOURCE_DISPLAY = type == 'employee' ? 'Nhân viên' : 'Khách hàng'
  const [currentPage, setCurrentPage] = useState(1)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    title: string
    message: string
    onConfirm: () => void
  } | null>(null)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearchInput = useDebounce(searchInput, 500)

  const [searchParams, setSearchParams] = useState({
    keyword: '',
    role: '',
    status: '',
  })

  useEffect(() => {
    setSearchParams((prev) => ({ ...prev, keyword: debouncedSearchInput }))
  }, [debouncedSearchInput])
  const pageSize = 30
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['users', currentPage, pageSize, ...Object.values(searchParams)],
    queryFn: async () => {
      console.log(searchParams)
      const initialRole =
        type == 'customer' ? ['customer'] : ['admin', 'receptionist', 'barber']
      const res = await fetchUsers({
        keyword: searchParams.keyword,
        page: currentPage,
        size: pageSize,
        role:
          searchParams.role && searchParams.role != '0'
            ? (searchParams.role as any)
            : initialRole,

        status:
          searchParams.status && searchParams.status != '0'
            ? (searchParams.status as any)
            : undefined,
      })
      return res
    },
  })

  console.log('Nhân viên', data)

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'admin':
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Admin
          </Badge>
        )
      case 'receptionist':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Lễ tân
          </Badge>
        )
      case 'barber':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Thợ cắt tóc
          </Badge>
        )
      case 'customer':
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Khách hàng
          </Badge>
        )
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  // Get status badge
  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Hoạt động
          </Badge>
        )
      case 'inactive':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Không hoạt động
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Handle search and filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    // No need to update searchParams here as it's handled by useEffect with debounce
  }

  const handleRoleChange = (value: string) => {
    setSearchParams({ ...searchParams, role: value })
    setCurrentPage(1) // Reset to first page on filter change
  }

  const handleStatusChange = (value: string) => {
    setSearchParams({ ...searchParams, status: value })
    setCurrentPage(1) // Reset to first page on filter change
  }

  // Handle view user details
  const handleViewUser = (user: UserType) => {
    setCurrentUser(user)
    setIsViewDialogOpen(true)
  }

  // Handle edit user
  const handleEditUser = (user: UserType) => {
    setCurrentUser(user)
    setIsEditDialogOpen(true)
  }

  const createUserMutate = useMutation({
    mutationFn: async (d: any) => {
      return await createUser({
        ...d,
      })
    },
    onSuccess: () => {
      refetch()
      setIsAddDialogOpen(false)
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi tạo người dùng')
    },
  })
  const updateUserMutate = useMutation({
    mutationFn: async (d: any) => {
      return await updateUser(currentUser!.id, {
        ...d,
      })
    },
    onSuccess: () => {
      refetch()
      setIsEditDialogOpen(false)
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật người dùng')
    },
  })
  const deleteUserMutate = useMutation({
    mutationFn: async (userId: number) => {
      return await deleteUser(userId)
    },
    onSuccess: () => {
      refetch()
      setIsConfirmDialogOpen(false)
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái người dùng')
    },
  })
  // Handle add new user
  const handleAddUser = () => {
    setIsAddDialogOpen(true)
  }

  // Handle save new user
  const handleSaveNewUser = (userData: any) => {
    createUserMutate.mutate(userData)
  }

  // Handle update user
  const handleUpdateUser = (userData: any) => {
    if (!currentUser) return
    updateUserMutate.mutate(userData)
  }

  // Handle update user status
  const handleUpdateStatus = (user: UserType, newStatus: UserStatus) => {
    setCurrentUser(user)
    setConfirmAction({
      title: 'Xóa' + RESOURCE_DISPLAY,
      message: `Bạn có chắc chắn muốn xóa ${RESOURCE_DISPLAY} ${user.fullName}?`,
      onConfirm: () => {
        deleteUserMutate.mutate(user.id)
      },
    })
    setIsConfirmDialogOpen(true)
  }
  const toggleActiveMutate = useMutation({
    mutationFn: async (userId: number) => {
      return await toggleActiveStatus(userId)
    },
    onSuccess: () => {
      refetch()
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái người dùng')
    },
  })

  // Calculate pagination
  const totalPages = Math.ceil((data?.total || 0) / pageSize)

  // Reset filters
  const resetFilters = () => {
    setSearchInput('')
    setSearchParams({
      keyword: '',
      role: '',
      status: '',
    })
    setCurrentPage(1)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý {RESOURCE_DISPLAY}
          </h1>
          <p className="text-gray-600">
            Quản lý tất cả {RESOURCE_DISPLAY} trong hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={handleAddUser}
          >
            <UserPlus size={16} />
            Thêm {RESOURCE_DISPLAY}
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={resetFilters}
          >
            <RefreshCcw size={16} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                className="pl-9"
                value={searchInput}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-700 font-medium">Lọc:</span>
          </div>

          {/* Role Filter */}
          {type == 'employee' && (
            <div className="flex-1 min-w-[200px]">
              <Select
                value={searchParams.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tất cả vai trò</SelectItem>

                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="receptionist">Lễ tân</SelectItem>
                  <SelectItem value="barber">Thợ cắt tóc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Status Filter */}
          <div className="flex-1 min-w-[200px]">
            <Select
              value={searchParams.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giới tính
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-red-500"
                  >
                    Có lỗi xảy ra khi tải dữ liệu
                  </td>
                </tr>
              ) : (data?.data.length || 0) > 0 ? (
                data?.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.gender === true
                        ? 'Nam'
                        : user.gender === false
                          ? 'Nữ'
                          : 'Chưa xác định'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleUpdateStatus(user, 'inactive')}
                          >
                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                            Xóa {RESOURCE_DISPLAY}
                          </DropdownMenuItem>
                          {user.status === 'active' ? (
                            <DropdownMenuItem
                              onClick={() => toggleActiveMutate.mutate(user.id)}
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Vô hiệu hóa
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => toggleActiveMutate.mutate(user.id)}
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Kích hoạt
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy {RESOURCE_DISPLAY} nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {data?.data.length ? (currentPage - 1) * pageSize + 1 : 0}-
            {Math.min(currentPage * pageSize, data?.total || 0)} của{' '}
            {data?.total || 0} {RESOURCE_DISPLAY}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Generate page numbers */}
            {totalPages <= 5 ? (
              // Show all pages if 5 or fewer
              Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))
            ) : (
              // Show pagination with ellipsis for many pages
              <>
                {/* First page */}
                <Button
                  variant={currentPage === 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </Button>

                {/* Ellipsis or adjacent pages */}
                {currentPage > 3 && (
                  <span className="flex items-center justify-center px-2">
                    ...
                  </span>
                )}

                {/* Pages around current */}
                {Array.from({ length: Math.min(3, totalPages - 2) }, (_, i) => {
                  let pageNum
                  if (currentPage <= 2) {
                    pageNum = i + 2 // Show 2,3,4 when current is 1 or 2
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 3 + i // Show n-3,n-2,n-1 when current is n or n-1
                  } else {
                    pageNum = currentPage - 1 + i // Show current-1, current, current+1
                  }

                  if (pageNum > 1 && pageNum < totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  }
                  return null
                }).filter(Boolean)}

                {/* Ellipsis */}
                {currentPage < totalPages - 2 && (
                  <span className="flex items-center justify-center px-2">
                    ...
                  </span>
                )}

                {/* Last page */}
                <Button
                  variant={currentPage === totalPages ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateUserModal
        type={type}
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleSaveNewUser}
      />

      <EditUserModal
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setCurrentUser(null)
        }}
        onSubmit={handleUpdateUser}
        user={currentUser}
        type={type}
      />

      <ViewUserModal
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false)
          setCurrentUser(null)
        }}
        type={type}
        user={currentUser}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
        onConfirm={() => {
          if (confirmAction?.onConfirm) {
            confirmAction.onConfirm()
          }
          setIsConfirmDialogOpen(false)
        }}
        type={type}
      />
    </div>
  )
}
