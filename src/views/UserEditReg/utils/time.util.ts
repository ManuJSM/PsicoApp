/**
 * Formats a Date object into a 12-hour time string with AM/PM
 * @param date - Date object to format
 * @returns Formatted time string (e.g., "02:30 PM")
 */
export const formatTime12Hour = (date: Date): string => {
  const h = date.getHours()
  const m = date.getMinutes()
  const amPm = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${amPm}`
}

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
 * Formats an interval object into a duration string
 * @param interval - Object containing hours and minutes
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export const formatIntervalDuration = (interval: {
  hours: number
  minutes: number
}): string => {
  const totalMinutes = interval.hours * 60 + interval.minutes
  return formatDuration(totalMinutes)
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
  formatTime12Hour,
  formatDuration,
  formatIntervalDuration,
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
