// /src/utils/formatters.ts
import dayjs from 'dayjs'

// Format price to VND
export function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price)
}

// Format date
export function formatDate(dateString: string | Date) {
  return dayjs(dateString).format('DD/MM/YYYY')
}

export function formatDateTime(dateString: string | Date) {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm')
}

export const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  } else {
    return value.toString()
  }
}
