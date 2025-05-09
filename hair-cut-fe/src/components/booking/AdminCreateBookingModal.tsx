import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import { CalendarIcon, Clock, PlusCircle, Search, X } from 'lucide-react'
import dayjs from 'dayjs'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Label } from '../ui/label'
import ServiceSelectionModal from '../SelectServiceModal'
import useBookingForm from '@/hooks/useBookingForm'
import { createBooking } from '@/lib/api/bookings'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatMinutes } from '@/lib/duration'
import { formatDate } from '@/lib/formatters'
import { fetchUsers } from '@/lib/api/users'

const ServiceBadges = React.memo(
  ({
    serviceIds,
    getServiceById,
  }: {
    serviceIds: Array<number>
    getServiceById: (id: number) => any
  }) => {
    if (serviceIds.length === 0) return null

    return (
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
    )
  },
)

const BookingSummary = React.memo(
  ({
    serviceIds,
    getServiceById,
    totalPrice,
    totalDuration,
  }: {
    serviceIds: Array<number>
    getServiceById: (id: number) => any
    totalPrice: number
    totalDuration: number
  }) => {
    if (serviceIds.length === 0) return null

    return (
      <div className="border rounded-md p-3">
        <h4 className="font-medium mb-2">Thông tin đặt lịch</h4>
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
            <span>{formatMinutes(totalDuration)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-1">
            <span>Tổng tiền:</span>
            <span>{totalPrice.toLocaleString()}đ</span>
          </div>
        </div>
      </div>
    )
  },
)

const TimeSlotSelector = React.memo(
  ({
    selectedDate,
    timeSlots,
    selectedTimeSlot,
    setSelectedTimeSlot,
  }: {
    selectedDate: Date | undefined
    timeSlots: Array<string>
    selectedTimeSlot: string | null
    setSelectedTimeSlot: (value: string | null) => void
  }) => {
    return (
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
        <SelectContent>
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
    )
  },
)

const CustomerSelector = React.memo(
  ({
    field,
    isCustomerOpen,
    setIsCustomerOpen,
    searchCustomer,
    handleSearchInputChange,
    customerResults,
    isNewCustomer,
    handleSelectCustomer,
    handleSelectNewPhone,
  }: {
    field: any
    isCustomerOpen: boolean
    setIsCustomerOpen: (value: boolean) => void
    searchCustomer: string
    handleSearchInputChange: (value: string) => void
    customerResults: Array<any>
    isNewCustomer: boolean
    handleSelectCustomer: (customer: any) => void
    handleSelectNewPhone: () => void
  }) => {
    return (
      <FormItem className="flex flex-col">
        <FormLabel>Khách hàng</FormLabel>
        <Popover open={isCustomerOpen} onOpenChange={setIsCustomerOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  'w-full justify-between',
                  !field.value && 'text-muted-foreground',
                )}
              >
                {field.value
                  ? isNewCustomer
                    ? `${field.value} (Khách mới)`
                    : field.value
                  : 'Nhập hoặc chọn SĐT khách hàng'}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0">
            <Command>
              <CommandInput
                placeholder="Tìm khách hàng theo SĐT hoặc tên..."
                value={searchCustomer}
                onValueChange={handleSearchInputChange}
              />
              <CommandList>
                {isNewCustomer && (
                  <CommandGroup heading="Tạo mới">
                    <CommandItem
                      key="new-customer"
                      value={`new-${searchCustomer}`}
                      onSelect={handleSelectNewPhone}
                    >
                      <div className="flex flex-col">
                        <span>{searchCustomer}</span>
                        <span className="text-xs text-green-600 font-medium">
                          + Thêm khách hàng mới
                        </span>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                )}

                <CommandGroup heading="Khách hàng hiện có">
                  {customerResults.length > 0 ? (
                    customerResults.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        value={customer.phone}
                        onSelect={() => handleSelectCustomer(customer)}
                      >
                        <div className="flex flex-col">
                          <span>{customer.phone}</span>
                          <span className="text-xs text-muted-foreground">
                            {customer.fullName}
                          </span>
                        </div>
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled>
                      Không tìm thấy khách hàng
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )
  },
)

interface AdminCreateBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  services: Array<any>
  employees: Array<any>
}

const AdminCreateBookingModal: React.FC<AdminCreateBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  services,
  employees,
}) => {
  const form = useBookingForm()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    form.getValues().appointmentDatetime,
  )
  const [timeSlots, setTimeSlots] = useState<Array<string>>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [searchCustomer, setSearchCustomer] = useState('')
  const [customerResults, setCustomerResults] = useState<Array<any>>([])
  const [isCustomerOpen, setIsCustomerOpen] = useState(false)
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const servicesRef = useRef(services)
  useEffect(() => {
    servicesRef.current = services
  }, [services])

  const getServiceById = useCallback((id: number) => {
    return Array.isArray(servicesRef.current)
      ? servicesRef.current.find((service) => service.id === id)
      : null
  }, [])

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () =>
      fetchUsers({
        role: ['customer' as any],
      }),
    select: (d) => d.data,
  })

  const handleSearchInputChange = useCallback(
    (value: string) => {
      setSearchCustomer(value)

      startTransition(() => {
        if (!value) {
          setIsNewCustomer(false)
          setCustomerResults(customers || [])
          return
        }

        if (customers) {
          const filtered = customers.filter(
            (customer) =>
              customer.phone.includes(value) ||
              customer.fullName.toLowerCase().includes(value.toLowerCase()),
          )
          setCustomerResults(filtered)

          const isPhoneNumber = /^\d+$/.test(value) && value.length >= 9
          const customerExists = filtered.some((c) => c.phone === value)
          setIsNewCustomer(isPhoneNumber && !customerExists)
        }
      })
    },
    [customers],
  )

  const handleSelectCustomer = useCallback(
    (customer: any) => {
      if (!customer) return

      form.setValue('customerPhone', customer.phone)
      setSearchCustomer(customer.phone)
      setIsCustomerOpen(false)
      setIsNewCustomer(false)
    },
    [form],
  )

  const handleSelectNewPhone = useCallback(() => {
    form.setValue('customerPhone', searchCustomer)
    setIsCustomerOpen(false)
    setIsNewCustomer(true)
  }, [form, searchCustomer])

  const generateTimeSlots = useCallback((date: Date): Array<string> => {
    const slots = []
    const currentDate = dayjs()
    const selectedDay = dayjs(date)
    const isSameDay =
      currentDate.format('YYYY-MM-DD') === selectedDay.format('YYYY-MM-DD')

    let startMinutes = 7 * 60
    const endMinutes = 22 * 60

    if (isSameDay) {
      const currentHour = currentDate.hour()
      const currentMinute = currentDate.minute()
      const currentTotalMinutes = currentHour * 60 + currentMinute
      startMinutes = Math.ceil((currentTotalMinutes + 40) / 20) * 20
    }

    for (let minutes = startMinutes; minutes < endMinutes; minutes += 20) {
      const hour = Math.floor(minutes / 60)
      const minute = minutes % 60
      slots.push(
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      )
    }

    return slots
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate)
      setTimeSlots(slots)
      setSelectedTimeSlot(null)
    }
  }, [selectedDate, generateTimeSlots])

  useEffect(() => {
    if (selectedDate && selectedTimeSlot) {
      const [hours, minutes] = selectedTimeSlot.split(':').map(Number)
      const dateTime = dayjs(selectedDate)
        .hour(hours)
        .minute(minutes)
        .second(0)
        .toDate()

      form.setValue('appointmentDatetime', dateTime, { shouldValidate: true })
    }
  }, [selectedDate, selectedTimeSlot, form])

  useEffect(() => {
    if (!isOpen) {
      form.reset()
      setSelectedDate(undefined)
      setSelectedTimeSlot(null)
      setTimeSlots([])
      setSearchCustomer('')
      setIsNewCustomer(false)
    }
  }, [isOpen])

  const handleServiceSelection = useCallback(
    (serviceIds: Array<number>) => {
      form.setValue('serviceIds', serviceIds, { shouldValidate: true })
    },
    [form],
  )

  const totalValues = useMemo(() => {
    let totalPrice = 0
    let totalDuration = 0

    const currentServiceIds = form.getValues().serviceIds

    if (Array.isArray(currentServiceIds)) {
      currentServiceIds.forEach((serviceId) => {
        const service = getServiceById(serviceId)
        if (service) {
          totalPrice += Number(service.price)
          totalDuration += Number(service.estimatedTime)
        }
      })
    }

    return { totalPrice, totalDuration }
  }, [form, getServiceById])

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: (values: any) => {
      return createBooking({
        appointmentDate: dayjs(values.appointmentDatetime).toISOString(),
        phoneNumber: values.customerPhone,
        serviceIds: values.serviceIds || [],
        notes: values.notes,
        employeeId: values.employeeId || null,
      })
    },
    onSuccess: () => {
      toast.success('Tạo lịch hẹn thành công!', {
        description: `Đã tạo lịch hẹn vào lúc ${dayjs(
          form.getValues().appointmentDatetime,
        ).format('HH:mm DD/MM/YYYY')}`,
      })
      onSuccess()
      onClose()
    },
    onError: () => {
      toast.error('Tạo lịch hẹn thất bại', {
        description: 'Có lỗi xảy ra khi tạo lịch hẹn. Vui lòng thử lại sau.',
      })
    },
  })

  const onSubmit = useCallback(
    (values: any) => {
      if (!selectedTimeSlot) {
        toast.error('Vui lòng chọn giờ hẹn')
        return
      }

      if (!values.customerPhone) {
        toast.error('Vui lòng chọn hoặc nhập số điện thoại khách hàng')
        return
      }

      if (!values.serviceIds || values.serviceIds.length === 0) {
        toast.error('Vui lòng chọn ít nhất một dịch vụ')
        return
      }

      const [hours, minutes] = selectedTimeSlot.split(':').map(Number)
      const dateTime = dayjs(selectedDate)
        .hour(hours)
        .minute(minutes)
        .second(0)
        .toDate()

      mutate({
        ...values,
        appointmentDatetime: dateTime,
        isNewCustomer: isNewCustomer,
      })
    },
    [selectedTimeSlot, selectedDate, isNewCustomer, mutate],
  )

  const { setValue, watch } = form
  const serviceIds = watch('serviceIds')
  const customerPhone = watch('customerPhone')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo lịch hẹn mới</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <CustomerSelector
                  field={field}
                  isCustomerOpen={isCustomerOpen}
                  setIsCustomerOpen={setIsCustomerOpen}
                  searchCustomer={searchCustomer}
                  handleSearchInputChange={handleSearchInputChange}
                  customerResults={customerResults}
                  isNewCustomer={isNewCustomer}
                  handleSelectCustomer={handleSelectCustomer}
                  handleSelectNewPhone={handleSelectNewPhone}
                />
              )}
            />
            <ServiceSelectionModal
              isOpen={isServiceModalOpen}
              onClose={() => setIsServiceModalOpen(false)}
              services={(services as any) || []}
              selectedServiceIds={serviceIds}
              onConfirm={handleServiceSelection}
            />
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhân viên phụ trách</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          className="w-full"
                          placeholder="Chọn nhân viên"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentDatetime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Chọn ngày và giờ</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !selectedDate && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate
                              ? formatDate(selectedDate)
                              : 'Chọn ngày'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) =>
                            date < dayjs().startOf('day').toDate()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <TimeSlotSelector
                      selectedDate={selectedDate}
                      timeSlots={timeSlots}
                      selectedTimeSlot={selectedTimeSlot}
                      setSelectedTimeSlot={setSelectedTimeSlot}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="services" className="text-right pt-2 mb-1">
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

                <ServiceBadges
                  serviceIds={serviceIds}
                  getServiceById={getServiceById}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ghi chú thêm về lịch hẹn..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <BookingSummary
              serviceIds={serviceIds}
              getServiceById={getServiceById}
              totalPrice={totalValues.totalPrice}
              totalDuration={totalValues.totalDuration}
            />
          </form>
        </Form>

        <DialogFooter className="flex justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={form.handleSubmit(onSubmit)}
            disabled={
              isMutating ||
              serviceIds.length === 0 ||
              !selectedTimeSlot ||
              !customerPhone
            }
          >
            {isMutating ? 'Đang xử lý...' : 'Tạo lịch hẹn'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(AdminCreateBookingModal)
