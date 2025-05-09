import { createFileRoute } from '@tanstack/react-router'
import AdminBookings from '@/components/booking-management-page'

export const Route = createFileRoute('/admin/bookings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminBookings />
}
