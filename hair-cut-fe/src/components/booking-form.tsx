import React, { useEffect, useRef, useState } from 'react'
import {
  Building,
  Calendar as CalendarIcon,
  Clock,
  PlusCircle,
  Scissors,
} from 'lucide-react'
import dayjs from 'dayjs'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import ServiceSelectionModal from './SelectServiceModal'
import type { BookingFormValues } from '@/hooks/useBookingForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatMinutes } from '@/lib/duration'
import serviceService from '@/services/service.service'
import { createBooking } from '@/lib/api/bookings'
import { formatDate } from '@/lib/formatters'
import useBookingForm from '@/hooks/useBookingForm'
import { useBranch } from '@/contexts/BranchContext'
import { branchEmployeeApi } from '@/lib/api/branchEmployee'

interface BookingFormProps {}

const BookingForm: React.FC<BookingFormProps> = () => {
  const form = useBookingForm()
  const { branches, fetchBranches } = useBranch()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    form.getValues().appointmentDatetime,
  )
  const navigate = useNavigate()
  const [timeSlots, setTimeSlots] = useState<Array<string>>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [loadingBranches, setLoadingBranches] = useState(false)
  const [employeesByBranchId, setEmployeesByBranchId] = useState<Array<any>>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const fetchBranchesRef = useRef(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null,
  )

  // Fetch branches only once when component mounts
  useEffect(() => {
    if (!fetchBranchesRef.current && branches.length === 0) {
      fetchBranchesRef.current = true

      const loadBranches = async () => {
        setLoadingBranches(true)
        try {
          await fetchBranches()
        } catch (error) {
          console.error('Failed to fetch branches:', error)
          toast.error('Không thể tải dữ liệu chi nhánh')
        } finally {
          setLoadingBranches(false)
        }
      }

      loadBranches()
    }
  }, [fetchBranches, branches.length])

  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate)
      setTimeSlots(slots)
      setSelectedTimeSlot(null)
    }
  }, [selectedDate])

  useEffect(() => {
    if (selectedDate && selectedTimeSlot) {
      const [hours, minutes] = selectedTimeSlot.split(':').map(Number)
      const dateTime = dayjs(selectedDate)
        .hour(hours)
        .minute(minutes)
        .second(0)
        .toDate()

      form.setValue('appointmentDatetime', dateTime)
    }
  }, [selectedDate, selectedTimeSlot, form])
  const { data } = useQuery({
    queryKey: ['services'],
    queryFn: () =>
      serviceService.queryServices({
        sortBy: 'createdAt',
        sortDirection: 'desc',
        page: 1,
        size: 10000,
      }),
    select: (d) => d.data.data,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (values: BookingFormValues) => {
      return createBooking({
        appointmentDate: dayjs(values.appointmentDatetime).toISOString(),
        phoneNumber: values.customerPhone,
        serviceIds: values.serviceIds,
        notes: values.notes,
        branchId: values.branchId,
        employeeId: selectedEmployeeId !== null ? selectedEmployeeId : 0,
      })
    },
    onSuccess: () => {
      form.reset()
      setSelectedDate(undefined)
      setSelectedTimeSlot(null)
      setTimeSlots([])
      toast.success('Đặt lịch thành công!', {
        description: `Bạn đã đặt lịch vào lúc ${dayjs(
          form.getValues().appointmentDatetime,
        ).format('HH:mm DD/MM/YYYY')}`,
      })
      navigate({ to: '/' })
    },
    onError: () => {
      toast.error('Đặt lịch thất bại', {
        description: 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau.',
      })
    },
  })
  const onSubmit = (values: BookingFormValues) => {
    if (!selectedTimeSlot) {
      toast.error('Vui lòng chọn giờ hẹn')
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
    })
  }

  const generateTimeSlots = (date: Date): Array<string> => {
    const slots = []
    const currentDate = dayjs()
    const selectedDay = dayjs(date)
    const isSameDay =
      currentDate.format('YYYY-MM-DD') === selectedDay.format('YYYY-MM-DD')

    let startMinutes = 7 * 60

    const endMinutes = 24 * 60

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
  }

  const handleServiceSelection = (serviceIds: Array<number>) => {
    form.setValue('serviceIds', serviceIds)
  }

  const getServiceById = (id: number) => {
    return data?.find((service) => service.id === id)
  }

  const calculateTotal = () => {
    let totalPrice = 0
    let totalDuration = 0

    form.getValues('serviceIds').forEach((serviceId) => {
      const service = getServiceById(serviceId)
      if (service) {
        totalPrice += Number(service.price)
        totalDuration += Number(service.estimatedTime)
      }
    })

    return { totalPrice, totalDuration }
  }

  const { totalPrice, totalDuration } = calculateTotal()

  // Fetch employees when branch is selected
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!selectedBranchId) return

      setLoadingEmployees(true)
      try {
        const response =
          await branchEmployeeApi.getEmployeesByBranchId(selectedBranchId)
        setEmployeesByBranchId(response.data.employees)
        console.log('Fetched employees:', response.data.employees)
      } catch (error) {
        console.error('Failed to fetch employees:', error)
        toast.error('Không thể tải dữ liệu nhân viên')
      } finally {
        setLoadingEmployees(false)
      }
    }

    fetchEmployees()
  }, [selectedBranchId])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Đặt Lịch Cắt Tóc
        </CardTitle>
        <CardDescription>
          Đặt lịch cắt tóc của bạn theo các bước bên dưới
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chi nhánh</FormLabel>
                  <Select
                    disabled={loadingBranches}
                    onValueChange={(value) => {
                      const branchId = Number(value)
                      field.onChange(branchId)
                      setSelectedBranchId(branchId)
                      setSelectedEmployeeId(null) // Reset employee selection when branch changes
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    value={field.value?.toString() || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn chi nhánh">
                          {field.value
                            ? branches.find(
                                (branch) => branch.id === field.value,
                              )?.name
                            : 'Chọn chi nhánh'}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.length > 0 ? (
                        branches.map((branch) => (
                          <SelectItem
                            key={branch.id}
                            value={branch.id.toString()}
                          >
                            <div className="flex items-center">
                              <Building className="mr-2 h-4 w-4" />
                              {branch.name}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-branches" disabled>
                          {loadingBranches
                            ? 'Đang tải chi nhánh...'
                            : 'Không có chi nhánh nào'}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add Employee Selection Field */}
            <FormItem>
              <FormLabel>Nhân viên</FormLabel>
              <Select
                disabled={
                  loadingEmployees ||
                  !selectedBranchId ||
                  employeesByBranchId.length === 0
                }
                value={
                  selectedEmployeeId !== null
                    ? selectedEmployeeId.toString()
                    : undefined
                }
                onValueChange={(value) => setSelectedEmployeeId(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loadingEmployees
                        ? 'Đang tải nhân viên...'
                        : !selectedBranchId
                          ? 'Vui lòng chọn chi nhánh trước'
                          : employeesByBranchId.length === 0
                            ? 'Không có nhân viên nào hoạt động tại chi nhánh này'
                            : 'Chọn nhân viên'
                    }
                  >
                    {selectedEmployeeId
                      ? selectedEmployeeId === 0
                        ? 'Bất kỳ nhân viên nào'
                        : employeesByBranchId.find(
                            (emp) => emp.employee?.id === selectedEmployeeId,
                          )?.employee?.fullName || 'Chọn nhân viên'
                      : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {employeesByBranchId.length > 0 ? (
                    employeesByBranchId.map((empData) => (
                      <SelectItem
                        key={empData.employee.id}
                        value={empData.employee.id.toString()}
                      >
                        {empData.employee.fullName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-employees" disabled>
                      {loadingEmployees
                        ? 'Đang tải nhân viên...'
                        : selectedBranchId
                          ? 'Không có nhân viên nào hoạt động tại chi nhánh này'
                          : 'Vui lòng chọn chi nhánh trước'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FormItem>

            <FormField
              control={form.control}
              name="serviceIds"
              render={() => (
                <FormItem>
                  <FormLabel>Dịch vụ</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full flex justify-between items-center h-10"
                        onClick={() => setIsServiceModalOpen(true)}
                      >
                        <span className="text-muted-foreground">
                          {form.getValues('serviceIds').length === 0
                            ? 'Chọn dịch vụ'
                            : `${form.getValues('serviceIds').length} dịch vụ đã chọn`}
                        </span>
                        <PlusCircle className="h-4 w-4" />
                      </Button>

                      {form.getValues('serviceIds').length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {form.getValues('serviceIds').map((serviceId) => {
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appointmentDatetime"
              render={() => (
                <FormItem className="flex flex-col">
                  <FormLabel>Chọn ngày và giờ</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ghi chú thêm về nhu cầu của bạn..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.getValues('serviceIds').length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="summary">
                  <AccordionTrigger className="font-medium">
                    Thông tin đặt lịch
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b">
                        <span>Chi nhánh:</span>
                        <span>
                          {form.getValues('branchId')
                            ? branches.find(
                                (branch) =>
                                  branch.id === form.getValues('branchId'),
                              )?.name || 'Chưa chọn'
                            : 'Chưa chọn'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span>Nhân viên:</span>
                        <span>
                          {selectedEmployeeId
                            ? selectedEmployeeId === 0
                              ? 'Bất kỳ nhân viên nào'
                              : employeesByBranchId.find(
                                  (emp) =>
                                    emp.employee?.id === selectedEmployeeId,
                                )?.employee?.fullName || 'Chưa chọn'
                            : 'Chưa chọn'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span>Dịch vụ đã chọn:</span>
                        <span>
                          {form.getValues('serviceIds').length} dịch vụ
                        </span>
                      </div>
                      {form.getValues('serviceIds').map((serviceId) => {
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-blue-900 hover:bg-blue-800"
          onClick={form.handleSubmit(onSubmit)}
          disabled={
            isPending ||
            form.getValues('serviceIds').length === 0 ||
            !selectedTimeSlot
          }
        >
          {isPending ? 'Đang xử lý...' : 'Đặt lịch ngay'}
        </Button>
      </CardFooter>

      <ServiceSelectionModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        services={(data as any) || []}
        selectedServiceIds={form.getValues('serviceIds')}
        onConfirm={handleServiceSelection}
      />
    </Card>
  )
}

export default BookingForm
