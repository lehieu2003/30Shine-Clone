import { createFileRoute } from '@tanstack/react-router'
import { ServiceEditPage } from '@/components/services/ServiceEditPage'

export const Route = createFileRoute('/admin/services/$id/edit')({
  component: ServiceEditPage,
})
