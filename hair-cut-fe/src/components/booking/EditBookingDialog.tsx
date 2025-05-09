import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { Calendar as CalendarIcon, Clock, PlusCircle } from 'lucide-react'

import ServiceSelectionModal from '../SelectServiceModal'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { formatMinutes } from '@/lib/duration'

const editBookingSchema = z.object({
  appointmentDatetime: z.date(),
  employeeId: z.string(),
  status: z.string(),
  notes: z.string().optional(),
  serviceIds: z
    .array(z.number().int().positive())
    .min(1, 'Phải chọn ít nhất một dịch vụ'),
})

type EditBookingFormValues = z.infer<typeof editBookingSchema>

export type EditBookingProps = {
  isOpen: boolean
  onClose: () => void
  booking: any
  bookingDetail: any
  employees: Array<any>
  onUpdateBooking: (data: any) => void
  services: Array<any>
}

export const EditBookingDialog = ({
  isOpen,
  onClose,
  booking,
  bookingDetail,
  employees,
  onUpdateBooking,
  services,
}: EditBookingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)

  const form = useForm<EditBookingFormValues>({
    resolver: zodResolver(editBookingSchema),
    defaultValues: {
      appointmentDatetime: new Date(),
      employeeId: '',
      status: 'pending',
      notes: '',
      serviceIds: [],
    },
  })

  const { control, setValue, handleSubmit, watch } = form

  const serviceIds = watch('serviceIds')

  const STANDARD_TIME_SLOTS = useMemo(() => {
    const slots = []
    const startMinutes = 7 * 60
    const endMinutes = 24 * 60

    for (let minutes = startMinutes; minutes < endMinutes; minutes += 20) {
      const hour = Math.floor(minutes / 60)
      const minute = minutes % 60
      slots.push(
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      )
    }
    return slots
  }, [])

  // Calculate available time slots based on selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate) return []

    const currentDate = dayjs()
    const selectedDay = dayjs(selectedDate)
    const isSameDay =
      currentDate.format('YYYY-MM-DD') === selectedDay.format('YYYY-MM-DD')

    // If it's not today, return all standard slots
    if (!isSameDay) {
      return STANDARD_TIME_SLOTS
    }

    // If it's today, filter out past times
    const currentHour = currentDate.hour()
    const currentMinute = currentDate.minute()
    const currentTotalMinutes = currentHour * 60 + currentMinute
    const startMinutes = Math.ceil((currentTotalMinutes + 40) / 20) * 20

    return STANDARD_TIME_SLOTS.filter((timeSlot) => {
      const [hours, minutes] = timeSlot.split(':').map(Number)
      const slotMinutes = hours * 60 + minutes
      return slotMinutes >= startMinutes
    })
  }, [selectedDate, STANDARD_TIME_SLOTS])

  useEffect(() => {
    if (isOpen && booking) {
      const bookingDate = dayjs(booking.appointmentDate).toDate()
      setSelectedDate(bookingDate)
      setSelectedTimeSlot(dayjs(booking.appointmentDate).format('HH:mm'))

      form.reset({
        appointmentDatetime: bookingDate,
        employeeId: booking.employeeId?.toString() || '',
        status: booking.status,
        notes: booking.notes || '',
        serviceIds:
          bookingDetail?.services?.map((s: any) => s.service.id) || [],
      })
    }
  }, [isOpen, booking, bookingDetail, form])

  useEffect(() => {
    if (selectedDate && selectedTimeSlot) {
      const [hours, minutes] = selectedTimeSlot.split(':').map(Number)
      const dateTime = dayjs(selectedDate)
        .hour(hours)
        .minute(minutes)
        .second(0)
        .toDate()

      setValue('appointmentDatetime', dateTime)
    }
  }, [selectedDate, selectedTimeSlot, setValue])

  const handleServiceSelection = (serviceIds: Array<number>) => {
    setValue('serviceIds', serviceIds)
  }

  const getServiceById = (id: number) => {
    return services.find((service) => service.id === id)
  }

  // Memoize the price and duration calculation
  const bookingSummary = useMemo(() => {
    let totalPrice = 0
    let totalDuration = 0

    serviceIds.forEach((serviceId) => {
      const service = getServiceById(serviceId)
      if (service) {
        totalPrice += Number(service.price)
        totalDuration += Number(service.estimatedTime)
      }
    })

    return { totalPrice, totalDuration }
  }, [serviceIds, services])

  const onSubmit = (data: EditBookingFormValues) => {
    const updateData = {
      appointmentDate: dayjs(data.appointmentDatetime).toISOString(),
      employeeId: data.employeeId === '0' ? null : Number(data.employeeId),
      status: data.status,
      notes: data.notes,
      serviceIds: data.serviceIds,
    }
    onUpdateBooking(updateData)
    onClose()
  }

  if (!booking) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa lịch hẹn #{booking.id}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Phần chọn ngày giờ giống form create */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="datetime" className="text-right pt-2">
              Ngày và giờ
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !selectedDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? formatDate(selectedDate) : 'Chọn ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < dayjs().startOf('day').toDate()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select
                disabled={!selectedDate || timeSlots.length === 0}
                value={selectedTimeSlot || ''}
                onValueChange={setSelectedTimeSlot}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn giờ">
                    {selectedTimeSlot ? (
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {selectedTimeSlot}
                      </div>
                    ) : (
                      'Chọn giờ'
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((timeSlot) => (
                      <SelectItem key={timeSlot} value={timeSlot}>
                        {timeSlot}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-slots" disabled>
                      Không có giờ trống
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Phần chọn dịch vụ sử dụng ServiceSelectionModal */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="services" className="text-right pt-2">
              Dịch vụ
            </Label>
            <div className="col-span-3 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full flex justify-between items-center h-10"
                onClick={() => setIsServiceModalOpen(true)}
              >
                <span className="text-muted-foreground">
                  {serviceIds.length === 0
                    ? 'Chọn dịch vụ'
                    : `${serviceIds.length} dịch vụ đã chọn`}
                </span>
                <PlusCircle className="h-4 w-4" />
              </Button>

              {serviceIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {serviceIds.map((serviceId) => {
                    const service = getServiceById(serviceId)
                    return service ? (
                      <Badge key={serviceId} variant="secondary">
                        {service.serviceName}
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Nhân viên
            </Label>
            <div className="col-span-3">
              <Controller
                name="employeeId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Chưa phân công</SelectItem>
                      {employees.map((employee) => (
                        <SelectItem
                          key={employee.id}
                          value={employee.id.toString()}
                        >
                          {employee.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Trạng thái
            </Label>
            <div className="col-span-3">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xác nhận</SelectItem>
                      <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                      <SelectItem value="in_progress">
                        Đang thực hiện
                      </SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="success">Thành công</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">
              Ghi chú
            </Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="notes"
                  className="col-span-3"
                  rows={3}
                  {...field}
                />
              )}
            />
          </div>

          {/* Tổng kết thông tin đặt lịch */}
          {serviceIds.length > 0 && (
            <div className="col-span-full">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="summary">
                  <AccordionTrigger className="font-medium">
                    Thông tin đặt lịch
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b">
                        <span>Dịch vụ đã chọn:</span>
                        <span>{serviceIds.length} dịch vụ</span>
                      </div>
                      {serviceIds.map((serviceId) => {
                        const service = getServiceById(serviceId)
                        return service ? (
                          <div
                            key={serviceId}
                            className="flex justify-between text-sm pl-2"
                          >
                            <span>{service.serviceName}</span>
                            <span>{service.price.toLocaleString()}đ</span>
                          </div>
                        ) : null
                      })}
                      <div className="flex justify-between py-1 border-b">
                        <span>Thời gian dự kiến:</span>
                        <span>
                          {formatMinutes(bookingSummary.totalDuration)}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold pt-1">
                        <span>Tổng tiền:</span>
                        <span>
                          {bookingSummary.totalPrice.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={serviceIds.length === 0 || !selectedTimeSlot}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <ServiceSelectionModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        services={(services as any) || []}
        selectedServiceIds={serviceIds}
        onConfirm={handleServiceSelection}
      />
    </Dialog>
  )
}
