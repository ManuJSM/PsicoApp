export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins.toString().padStart(2, '0')}m`
}

export const extractTime = (
  date: Date
): { hours: number; minutes: number } => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
})

export const formatTime = (date: Date): string => {
  if (!date) return '--:--'
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`
}
