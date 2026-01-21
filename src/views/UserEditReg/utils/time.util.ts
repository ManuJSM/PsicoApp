/**
 * Formats a duration in minutes into a human-readable string
 * @param minutes - Total minutes to format
 * @returns Formatted duration string (e.g., "2h 30m", "45m", "1h")
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins.toString().padStart(2, '0')}m`
}

/**
 * Extracts hours and minutes from a Date object
 * @param date - Date object to extract time from
 * @returns Object with hours and minutes
 */
export const extractTime = (
  date: Date
): { hours: number; minutes: number } => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
})

export default {
  formatDuration,
  extractTime,
}
// Formatear hora
export const formatTime = (date: Date) => {
  if (!date) return '--:--'
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`
}
