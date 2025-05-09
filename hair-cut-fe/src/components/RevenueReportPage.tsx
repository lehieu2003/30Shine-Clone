import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import type { RevenueFilter } from '@/lib/api/reports'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMonthlyRevenue, getRevenueByService } from '@/lib/api/reports'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchUsers } from '@/lib/api/users'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState('monthly')
  const currentYear = new Date().getFullYear()
  const [filters, setFilters] = useState<RevenueFilter>({ year: currentYear })
  const [filterType, setFilterType] = useState<'year' | 'dateRange'>('year')

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => fetchUsers({ role: ['barber' as any], size: 100000 }),
    select: (data) => data.data,
  })

  const { data: monthlyData = [], isLoading: isLoadingMonthly } = useQuery({
    queryKey: ['monthlyRevenue', filters],
    queryFn: () => getMonthlyRevenue(filters),
  })

  const { data: serviceData = [], isLoading: isLoadingService } = useQuery({
    queryKey: ['serviceRevenue', filters],
    queryFn: () => getRevenueByService(filters),
  })

  const handleYearChange = (year: string) => {
    setFilters({ year: parseInt(year), employeeId: filters.employeeId })
  }

  const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
    setFilters({
      ...filters,
      [field]: value,
      year: undefined,
    })
  }

  const handleEmployeeChange = (employeeId: string) => {
    setFilters({
      ...filters,
      employeeId: employeeId ? parseInt(employeeId) : undefined,
    })
  }

  const handleFilterTypeChange = (type: 'year' | 'dateRange') => {
    setFilterType(type)
    if (type === 'year') {
      setFilters({ year: currentYear, employeeId: filters.employeeId })
    } else {
      const today = new Date()
      const lastMonth = new Date()
      lastMonth.setMonth(today.getMonth() - 1)

      setFilters({
        from: lastMonth.toISOString().split('T')[0],
        to: today.toISOString().split('T')[0],
        employeeId: filters.employeeId,
        year: undefined,
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const monthlyChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: monthlyData.map((item) => item.month),
    },
    colors: ['#4F46E5'],
    title: {
      text: 'Doanh thu tháng',
      align: 'left',
    },
    tooltip: {
      y: {
        formatter: (val) => formatCurrency(val),
      },
    },
  }

  const monthlyChartSeries = [
    {
      name: 'Doanh thu',
      data: monthlyData.map((item) => item.total),
    },
  ]

  const serviceChartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: serviceData.map((item) => item.service),
    colors: ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'],
    title: {
      text: 'Doanh thu theo dịch vụ',
      align: 'left',
    },
    legend: {
      position: 'bottom',
    },
    tooltip: {
      y: {
        formatter: (val) => formatCurrency(val),
      },
    },
  }

  const serviceChartSeries = serviceData.map((item) => item.total)

  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i)

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bộ lọc báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Loại thời gian</Label>
              <Select
                value={filterType}
                onValueChange={(value) =>
                  handleFilterTypeChange(value as 'year' | 'dateRange')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kiểu lọc" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Theo năm</SelectItem>
                  <SelectItem value="dateRange">Khoảng thời gian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterType === 'year' && (
              <div className="space-y-2">
                <Label>Năm</Label>
                <Select
                  value={filters.year?.toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn năm" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterType === 'dateRange' && (
              <>
                <div className="space-y-2">
                  <Label>Từ ngày</Label>
                  <Input
                    type="date"
                    value={filters.from}
                    onChange={(e) =>
                      handleDateRangeChange('from', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Đến ngày</Label>
                  <Input
                    type="date"
                    value={filters.to}
                    onChange={(e) =>
                      handleDateRangeChange('to', e.target.value)
                    }
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Nhân viên</Label>
              <Select
                value={filters.employeeId?.toString() || ''}
                onValueChange={handleEmployeeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tất cả nhân viên</SelectItem>
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
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="monthly">Doanh thu theo tháng</TabsTrigger>
          <TabsTrigger value="service">Doanh thu theo dịch vụ</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Biểu đồ doanh thu theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMonthly ? (
                <div className="flex justify-center items-center h-[350px]">
                  Loading...
                </div>
              ) : (
                <Chart
                  options={monthlyChartOptions}
                  series={monthlyChartSeries}
                  type="bar"
                  height={350}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bảng chi tiết doanh thu theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMonthly ? (
                <div className="flex justify-center items-center h-[200px]">
                  Loading...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tháng</TableHead>
                      <TableHead>Số lượng dịch vụ</TableHead>
                      <TableHead className="text-right">Doanh thu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyData.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell>{item.count}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-medium">
                      <TableCell>Tổng cộng</TableCell>
                      <TableCell>
                        {monthlyData.reduce((sum, item) => sum + item.count, 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          monthlyData.reduce(
                            (sum, item) => sum + item.total,
                            0,
                          ),
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Biểu đồ doanh thu theo dịch vụ</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingService ? (
                <div className="flex justify-center items-center h-[350px]">
                  Loading...
                </div>
              ) : (
                <Chart
                  options={serviceChartOptions}
                  series={serviceChartSeries}
                  type="pie"
                  height={350}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bảng chi tiết doanh thu theo dịch vụ</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingService ? (
                <div className="flex justify-center items-center h-[200px]">
                  Loading...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead className="text-right">Doanh thu</TableHead>
                      <TableHead className="text-right">Tỷ lệ (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceData.map((item) => {
                      const totalRevenue = serviceData.reduce(
                        (sum, i) => sum + i.total,
                        0,
                      )
                      const percentage =
                        totalRevenue > 0
                          ? ((item.total / totalRevenue) * 100).toFixed(2)
                          : '0.00'

                      return (
                        <TableRow key={item.service}>
                          <TableCell>{item.service}</TableCell>
                          <TableCell>{item.count}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.total)}
                          </TableCell>
                          <TableCell className="text-right">
                            {percentage}%
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow className="font-medium">
                      <TableCell>Tổng cộng</TableCell>
                      <TableCell>
                        {serviceData.reduce((sum, item) => sum + item.count, 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          serviceData.reduce(
                            (sum, item) => sum + item.total,
                            0,
                          ),
                        )}
                      </TableCell>
                      <TableCell className="text-right">100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
