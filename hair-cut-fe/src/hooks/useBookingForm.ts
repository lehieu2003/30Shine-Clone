import { z } from 'zod'
import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

export const bookingFormSchema = z.object({
  customerPhone: z.string().regex(/^\d{10,11}$/, {
    message: 'Số điện thoại phải có 10 hoặc 11 chữ số',
  }),
  serviceIds: z.array(z.number()).min(1, {
    message: 'Vui lòng chọn ít nhất một dịch vụ',
  }),
  appointmentDatetime: z.date().refine((date) => dayjs(date).isAfter(dayjs()), {
    message: 'Thời gian đặt lịch phải lớn hơn thời gian hiện tại',
  }),
  notes: z.string().optional(),
  employeeId: z.number().optional(),
  customerId: z.number().optional(),
  branchId: z.number({
    required_error: 'Vui lòng chọn chi nhánh',
  }),
})

export type BookingFormValues = z.infer<typeof bookingFormSchema>
export default function useBookingForm(
  defaultValues: Partial<BookingFormValues> = {},
) {
  const { user } = useAuth()
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerPhone: '',
      appointmentDatetime: dayjs().add(2, 'hour').toDate(),
      branchId: undefined, // Make sure branchId is properly initialized
      serviceIds: [],
      ...defaultValues,
    },
  })
  const searchParams = new URLSearchParams(window.location.search)
  const phoneNumber = searchParams.get('phoneNumber')
  const initialServiceIds = searchParams.getAll('serviceIds')
  React.useEffect(() => {
    if (initialServiceIds.length > 0) {
      form.setValue(
        'serviceIds',
        initialServiceIds
          .map((id) => parseInt(id, 10))
          .filter((id) => !isNaN(id)),
      )
    }
  }, [initialServiceIds, form])

  React.useEffect(() => {
    if (user) {
      form.setValue('customerPhone', user.phone)
    }
    if (phoneNumber) {
      form.setValue('customerPhone', phoneNumber)
    }
  }, [user, form, phoneNumber])
  return form
}
