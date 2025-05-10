import { createFileRoute } from '@tanstack/react-router'
import ProductManagementPage from '@/components/product-management-page'

export const Route = createFileRoute('/admin/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProductManagementPage />
}
