import { createFileRoute } from '@tanstack/react-router'
import { ReportsPage } from '@/components/RevenueReportPage'

export const Route = createFileRoute('/admin/report/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ReportsPage />
}
