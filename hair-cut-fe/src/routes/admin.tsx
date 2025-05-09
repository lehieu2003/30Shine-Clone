import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import React from 'react'
import AdminLayout from '@/components/admin-layout'
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  React.useEffect(() => {
    if (!user || user.role === 'customer') {
      toast.error('Bạn không có quyền truy cập vào trang này')
      navigate({
        to: '/',
      })
    }
  }, [user, navigate])
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
