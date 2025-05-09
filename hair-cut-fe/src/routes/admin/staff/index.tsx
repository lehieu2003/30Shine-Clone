import { createFileRoute } from '@tanstack/react-router'
import UsersPage from '@/components/users'

export const Route = createFileRoute('/admin/staff/')({
  component: () => <UsersPage type="employee" />,
})
