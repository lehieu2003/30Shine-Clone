export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  const parts = []
  if (hours > 0) parts.push(`${hours} giờ`)
  if (mins > 0) parts.push(`${mins} phút`)

  return parts.join(' ')
}
