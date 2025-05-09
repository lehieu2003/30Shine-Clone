import { createFileRoute } from '@tanstack/react-router'
import UsersPage from '@/components/users'

export const Route = createFileRoute('/admin/customers/')({
  component: () => <UsersPage type="customer" />,
})
