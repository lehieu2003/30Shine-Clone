import { createFileRoute } from '@tanstack/react-router'
import UserBookingHistory from '@/components/user-booking-history'

export const Route = createFileRoute('/_layout/my-bookings')({
  component: MyBookingsPage,
})

export default function MyBookingsPage() {
  return <UserBookingHistory />
}
