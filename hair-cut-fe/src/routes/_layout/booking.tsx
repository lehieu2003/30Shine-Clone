import { createFileRoute } from '@tanstack/react-router'

import BookingForm from '@/components/booking-form'

export const Route = createFileRoute('/_layout/booking')({
  component: BookingPage,
})

export default function BookingPage() {
  return (
    <div className="container mx-auto py-8">
      <BookingForm />
    </div>
  )
}
