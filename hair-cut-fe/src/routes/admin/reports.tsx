import { createFileRoute } from '@tanstack/react-router'
import { ReportsPage } from '@/components/RevenueReportPage'

export const Route = createFileRoute('/admin/reports')({
  component: ReportsPage,
})
