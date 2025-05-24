import { createFileRoute } from '@tanstack/react-router'
import AdminBranchesPage from '@/components/branches-management-page'

export const Route = createFileRoute('/admin/branches/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminBranchesPage />
}
