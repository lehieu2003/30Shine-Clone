import { createFileRoute } from '@tanstack/react-router'
import { AdminServicesPage } from '@/components/services/AdminServicesPage'

export const Route = createFileRoute('/admin/services/')({
  component: AdminServicesPage,
})
