import jsPDF from 'jspdf'
import dayjs from 'dayjs'
import { formatDate, formatPrice } from '@/lib/formatters'

// Function to setup fonts for PDF with Vietnamese support
const setupPDFDocument = (pdf: jsPDF) => {
  // Add custom font Roboto
  pdf.addFont('/fonts/Roboto-Regular.ttf', 'Roboto', 'normal')
  pdf.addFont('/fonts/Roboto-Bold.ttf', 'Roboto', 'bold')
  pdf.addFont('/fonts/Roboto-Italic.ttf', 'Roboto', 'italic')
  pdf.addFont('/fonts/Roboto-BoldItalic.ttf', 'Roboto', 'bolditalic')

  pdf.setFont('Roboto', 'normal')
  pdf.setFontSize(12)
}

// Types for booking data
interface BookingUser {
  id: number
  fullName: string
  phone: string
  role: string
}

interface BookingService {
  id: number
  bookingId: number
  serviceId: number
  serviceName: string
  price: number
}

interface Booking {
  id: number
  customerId: number
  customer: BookingUser
  employeeId: number | null
  employee: BookingUser | null
  appointmentDate: string
  status: string
  totalPrice: number
  notes: string
  createdAt: string
  updatedAt: string
  services: Array<BookingService>
}

interface ExportParams {
  keyword?: string
  status?: string
  employeeId?: number
  dateFrom?: string
  dateTo?: string
}

interface Employee {
  id: number
  fullName: string
  [key: string]: any
}

// Helper function to get status display text
const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận'
    case 'confirmed':
      return 'Đã xác nhận'
    case 'cancelled':
      return 'Đã hủy'
    case 'in_progress':
      return 'Đang thực hiện'
    case 'completed':
      return 'Hoàn thành'
    case 'success':
      return 'Thành công'
    default:
      return status
  }
}

// Helper function to add header and footer to PDF
const addHeaderFooter = (
  pdf: jsPDF,
  pageNumber: number,
  totalPages: number,
): void => {
  const pageHeight = pdf.internal.pageSize.height
  const pageWidth = pdf.internal.pageSize.width

  // Header line
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.5)
  pdf.line(20, 15, pageWidth - 20, 15)

  // Footer
  pdf.setFontSize(8)
  pdf.setFont('Roboto', 'italic')
  pdf.text(
    `Trang ${pageNumber} / ${totalPages}`,
    pageWidth - 40,
    pageHeight - 10,
  )
  pdf.text(
    `Xuất bởi hệ thống Hair Cut Management - ${dayjs().format('DD/MM/YYYY HH:mm')}`,
    20,
    pageHeight - 10,
  )

  // Footer line
  pdf.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15)
}

// Export bookings to PDF with enhanced features
export const exportBookingsToPDF = async (
  bookings: Array<Booking>,
  filters: ExportParams = {},
  employees: Array<Employee> = [],
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new jsPDF('l', 'mm', 'a4') // landscape orientation

      // Calculate total pages (rough estimate)
      const rowsPerPage = 15
      const totalPages = Math.ceil(bookings.length / rowsPerPage) || 1
      let currentPage = 1

      // Setup fonts for Vietnamese support
      setupPDFDocument(pdf)

      // Add header/footer
      addHeaderFooter(pdf, currentPage, totalPages)

      // Title
      pdf.setFontSize(20)
      pdf.setFont('Roboto', 'bold')
      pdf.text('BÁO CÁO LỊCH HẸN', 20, 25)

      // Subtitle
      pdf.setFontSize(12)
      pdf.setFont('Roboto', 'normal') // Changed from arial
      pdf.text(`Tổng số lịch hẹn: ${bookings.length}`, 20, 35)
      pdf.text(`Xuất ngày: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 20, 42)

      // Filter information
      let yPosition = 52
      if (
        Object.keys(filters).some((key) => filters[key as keyof ExportParams])
      ) {
        pdf.setFontSize(12)
        pdf.setFont('Roboto', 'bold') // Changed from times
        pdf.text('Bộ lọc áp dụng:', 20, yPosition)
        pdf.setFont('Roboto', 'normal') // Changed from times
        yPosition += 8

        pdf.setFontSize(10)
        if (filters.keyword) {
          pdf.text(`• Từ khóa: ${filters.keyword}`, 25, yPosition)
          yPosition += 6
        }
        if (filters.status && filters.status !== 'all') {
          pdf.text(
            `• Trạng thái: ${getStatusText(filters.status)}`,
            25,
            yPosition,
          )
          yPosition += 6
        }
        if (filters.employeeId) {
          const employee = employees.find(
            (emp) => emp.id === filters.employeeId,
          )
          pdf.text(`• Nhân viên: ${employee?.fullName || 'N/A'}`, 25, yPosition)
          yPosition += 6
        }
        if (filters.dateFrom) {
          pdf.text(`• Từ ngày: ${formatDate(filters.dateFrom)}`, 25, yPosition)
          yPosition += 6
        }
        if (filters.dateTo) {
          pdf.text(`• Đến ngày: ${formatDate(filters.dateTo)}`, 25, yPosition)
          yPosition += 6
        }
      }

      yPosition += 10

      // Table header
      pdf.setFontSize(10)
      pdf.setFont('Roboto', 'bold') // Changed from times

      const startY = yPosition
      const rowHeight = 8
      const colWidths = [15, 40, 30, 20, 35, 35, 25, 20, 35]
      const headers = [
        'ID',
        'Khách hàng',
        'Ngày hẹn',
        'Giờ',
        'Nhân viên',
        'Dịch vụ',
        'Tổng tiền',
        'Trạng thái',
        'Ghi chú',
      ]

      let xPosition = 20
      headers.forEach((header, index) => {
        pdf.setFillColor(240, 240, 240)
        pdf.rect(xPosition, startY, colWidths[index], rowHeight, 'F')
        pdf.rect(xPosition, startY, colWidths[index], rowHeight)
        pdf.text(header, xPosition + 2, startY + 5)
        xPosition += colWidths[index]
      })

      // Table content
      pdf.setFont('Roboto', 'normal') // Changed from times
      let currentY = startY + rowHeight

      bookings.forEach((booking) => {
        // Check if we need a new page
        if (currentY > 180) {
          currentPage++
          pdf.addPage()
          addHeaderFooter(pdf, currentPage, totalPages)
          currentY = 30

          // Redraw header on new page
          pdf.setFont('Roboto', 'bold') // Changed from times
          let xPos = 20
          headers.forEach((header, headerIndex) => {
            pdf.setFillColor(240, 240, 240)
            pdf.rect(xPos, currentY, colWidths[headerIndex], rowHeight, 'F')
            pdf.rect(xPos, currentY, colWidths[headerIndex], rowHeight)
            pdf.text(header, xPos + 2, currentY + 5)
            xPos += colWidths[headerIndex]
          })
          currentY += rowHeight
          pdf.setFont('Roboto', 'normal') // Changed from times
        }

        // Row data
        const rowData = [
          `#${booking.id}`,
          booking.customer.fullName,
          formatDate(booking.appointmentDate),
          dayjs(booking.appointmentDate).format('HH:mm'),
          booking.employee?.fullName || 'Chưa phân công',
          booking.services.map((s) => s.serviceName).join(', '),
          formatPrice(booking.totalPrice),
          getStatusText(booking.status),
          booking.notes || '',
        ]

        xPosition = 20
        rowData.forEach((data, colIndex) => {
          // Draw cell border
          pdf.rect(xPosition, currentY, colWidths[colIndex], rowHeight)

          // Truncate text if too long
          let text = data.toString()
          const maxLength = colIndex === 5 ? 30 : colIndex === 8 ? 25 : 15
          if (text.length > maxLength) {
            text = text.substring(0, maxLength - 3) + '...'
          }

          pdf.text(text, xPosition + 2, currentY + 5)
          xPosition += colWidths[colIndex]
        })

        currentY += rowHeight
      })

      // Summary section
      currentY += 15
      if (currentY > 160) {
        currentPage++
        pdf.addPage()
        addHeaderFooter(pdf, currentPage, totalPages)
        currentY = 30
      }

      pdf.setFont('Roboto', 'bold') // Changed from times
      pdf.setFontSize(14)
      pdf.text('TỔNG KẾT:', 20, currentY)
      pdf.setFont('Roboto', 'normal') // Changed from times
      pdf.setFontSize(12)
      currentY += 10

      const totalRevenue = bookings.reduce(
        (sum, booking) => sum + booking.totalPrice,
        0,
      )
      pdf.text(`• Tổng số lịch hẹn: ${bookings.length}`, 25, currentY)
      currentY += 8
      pdf.text(`• Tổng doanh thu: ${formatPrice(totalRevenue)}`, 25, currentY)
      currentY += 8

      // Status breakdown
      const statusCounts = bookings.reduce(
        (acc, booking) => {
          acc[booking.status] = (acc[booking.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      pdf.text('• Thống kê theo trạng thái:', 25, currentY)
      currentY += 6
      Object.entries(statusCounts).forEach(([status, count]) => {
        pdf.text(`  - ${getStatusText(status)}: ${count}`, 30, currentY)
        currentY += 6
      })

      // Generate filename
      const dateString = dayjs().format('YYYY-MM-DD_HH-mm')
      const filename = `bao-cao-lich-hen_${dateString}.pdf`

      // Save the PDF
      pdf.save(filename)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

// Export single booking to PDF with enhanced layout
export const exportSingleBookingToPDF = (
  booking: Booking,
  bookingDetail: any, // Consider defining a more specific type for bookingDetail if possible
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4') // portrait orientation

      // Determine the source for services and total price
      const servicesToRender: Array<BookingService> = // Changed BookingService[] to Array<BookingService>
        bookingDetail &&
        Array.isArray(bookingDetail.services) &&
        bookingDetail.services.length > 0
          ? bookingDetail.services
          : booking.services

      const totalPriceToRender: number =
        bookingDetail && typeof bookingDetail.totalPrice === 'number'
          ? bookingDetail.totalPrice
          : booking.totalPrice

      // Setup fonts for Vietnamese support
      setupPDFDocument(pdf)

      // Add header/footer
      addHeaderFooter(pdf, 1, 1)

      // Header
      pdf.setFontSize(22)
      pdf.setFont('Roboto', 'bold') // Changed from arial
      pdf.text('CHI TIẾT LỊCH HẸN', 20, 30)

      pdf.setFontSize(14)
      pdf.setFont('Roboto', 'normal') // Changed from arial
      pdf.text(`Mã lịch hẹn: #${booking.id}`, 20, 42)
      pdf.text(`Ngày xuất: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 20, 50)

      let yPos = 65

      // Customer information section
      pdf.setFontSize(16)
      pdf.setFont('Roboto', 'bold')
      pdf.setFillColor(245, 245, 245)
      pdf.rect(20, yPos - 5, 170, 8, 'F')
      pdf.text('THÔNG TIN KHÁCH HÀNG', 22, yPos)
      pdf.setFont('Roboto', 'normal')
      pdf.setFontSize(12)
      yPos += 15

      pdf.text(`Họ tên: ${booking.customer.fullName}`, 25, yPos)
      yPos += 8
      pdf.text(`Số điện thoại: ${booking.customer.phone}`, 25, yPos)
      yPos += 20

      // Appointment information section
      pdf.setFontSize(16)
      pdf.setFont('Roboto', 'bold') // Changed from times
      pdf.setFillColor(245, 245, 245)
      pdf.rect(20, yPos - 5, 170, 8, 'F')
      pdf.text('THÔNG TIN LỊCH HẸN', 22, yPos)
      pdf.setFont('Roboto', 'normal') // Changed from times
      pdf.setFontSize(12)
      yPos += 15

      pdf.text(`Ngày hẹn: ${formatDate(booking.appointmentDate)}`, 25, yPos)
      yPos += 8
      pdf.text(
        `Giờ hẹn: ${dayjs(booking.appointmentDate).format('HH:mm')}`,
        25,
        yPos,
      )
      yPos += 8
      pdf.text(
        `Nhân viên: ${booking.employee?.fullName || 'Chưa phân công'}`,
        25,
        yPos,
      )
      yPos += 8
      pdf.text(`Trạng thái: ${getStatusText(booking.status)}`, 25, yPos)
      yPos += 20

      // Services section
      pdf.setFontSize(16)
      pdf.setFont('Roboto', 'bold') // Changed from times
      pdf.setFillColor(245, 245, 245)
      pdf.rect(20, yPos - 5, 170, 8, 'F')
      pdf.text('DỊCH VỤ ĐƯỢC CHỌN', 22, yPos)
      pdf.setFont('Roboto', 'normal') // Changed from times
      pdf.setFontSize(12)
      yPos += 15

      // Services table
      const serviceTableHeaders = ['STT', 'Tên dịch vụ', 'Giá tiền']
      const serviceColWidths = [20, 100, 50]

      // Service table header
      pdf.setFont('Roboto', 'bold') // Changed from times
      let xPos = 25
      serviceTableHeaders.forEach((header, index) => {
        pdf.setFillColor(230, 230, 230)
        pdf.rect(xPos, yPos, serviceColWidths[index], 8, 'F')
        pdf.rect(xPos, yPos, serviceColWidths[index], 8)
        pdf.text(header, xPos + 2, yPos + 5)
        xPos += serviceColWidths[index]
      })
      yPos += 8

      // Service table content
      pdf.setFont('Roboto', 'normal') // Changed from times
      servicesToRender.forEach((service, index) => {
        // Use servicesToRender
        xPos = 25

        // Robustly access service name and price
        const s = service as any // Treat service as any for flexible property access
        const serviceNameForPdf = String(
          s.serviceName || s.name || s.service_name || '',
        )
        const priceForPdf = Number(
          s.price ?? s.cost ?? s.service_price ?? s.amount ?? 0,
        )

        const serviceData = [
          (index + 1).toString(),
          serviceNameForPdf, // Use resolved service name
          formatPrice(priceForPdf), // Use resolved price
        ]

        serviceData.forEach((data, colIndex) => {
          // Ensure text data is a string and not null/undefined
          const text = String(data || '').trim()
          pdf.rect(xPos, yPos, serviceColWidths[colIndex], 8)
          if (text) {
            pdf.text(text, xPos + 2, yPos + 5)
          }
          xPos += serviceColWidths[colIndex]
        })
        yPos += 8
      })

      // Total
      yPos += 10
      pdf.setFont('Roboto', 'bold') // Changed from times
      pdf.setFontSize(14)
      pdf.text(`TỔNG TIỀN: ${formatPrice(totalPriceToRender)}`, 25, yPos) // Use totalPriceToRender

      // Notes section
      if (booking.notes) {
        yPos += 20
        pdf.setFontSize(16)
        pdf.setFont('Roboto', 'bold') // Changed from times
        pdf.setFillColor(245, 245, 245)
        pdf.rect(20, yPos - 5, 170, 8, 'F')
        pdf.text('GHI CHÚ', 22, yPos)
        pdf.setFont('Roboto', 'normal') // Changed from times
        pdf.setFontSize(12)
        yPos += 15

        // Handle long notes by splitting into lines
        const noteLines = pdf.splitTextToSize(booking.notes, 160)
        noteLines.forEach((line: string) => {
          pdf.text(line, 25, yPos)
          yPos += 6
        })
      }

      // Timestamps
      yPos += 25
      pdf.setFontSize(10)
      pdf.setFont('Roboto', 'italic') // Changed from times
      pdf.text(`Tạo lúc: ${formatDate(booking.createdAt)}`, 25, yPos)
      yPos += 6
      pdf.text(`Cập nhật lúc: ${formatDate(booking.updatedAt)}`, 25, yPos)

      // Generate filename
      const filename = `lich-hen-${booking.id}_${dayjs().format('YYYY-MM-DD')}.pdf`

      // Save the PDF
      pdf.save(filename)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

// Preview PDF before export (returns blob URL for preview)
export const previewBookingsPDF = async (
  bookings: Array<Booking>,
  filters: ExportParams = {},
  employees: Array<Employee> = [],
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new jsPDF('l', 'mm', 'a4')

      // Similar implementation as exportBookingsToPDF but return blob URL
      // Note: This is a simplified version - you can expand it with the full implementation
      setupPDFDocument(pdf) // Ensures Roboto is set up
      pdf.setFontSize(20)
      pdf.setFont('Roboto', 'bold') // Ensure Roboto bold for title
      pdf.text('BÁO CÁO LỊCH HẸN - PREVIEW', 20, 25)

      pdf.setFont('Roboto', 'normal') // Changed from helvetica
      pdf.setFontSize(12)
      pdf.text(`Tổng số lịch hẹn: ${bookings.length}`, 20, 40)
      pdf.text('Preview mode - chọn xuất để có báo cáo đầy đủ', 20, 50)

      const pdfBlob = pdf.output('blob')
      const blobUrl = URL.createObjectURL(pdfBlob)
      resolve(blobUrl)
    } catch (error) {
      reject(error)
    }
  })
}
