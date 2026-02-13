export interface DateRange {
  start: Date
  end: Date
}
export const getWeekRange = (date: Date): DateRange => {
  const current = new Date(date)
  const day = current.getDay() // 0 = domingo, 1 = lunes...

  // Ajuste para que la semana empiece en lunes
  const diffToMonday = day === 0 ? -6 : 1 - day

  const start = new Date(current)
  start.setDate(current.getDate() + diffToMonday)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}
export function getYearRange(date: Date): DateRange {
  const year = date.getFullYear()

  const start = new Date(year, 0, 1)
  start.setHours(0, 0, 0, 0)

  const end = new Date(year, 11, 31)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export const getMonthRange = (date: Date): DateRange => {
  const year = date.getFullYear()
  const month = date.getMonth()

  const start = new Date(year, month, 1)
  start.setHours(0, 0, 0, 0)

  const end = new Date(year, month + 1, 0)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export const formatDay = (date: Date): string => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
const MONTHS_ES = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
]

export const formatDateRange = (range: DateRange): string => {
  const { start, end } = range

  const startDay = start.getDate()
  const endDay = end.getDate()
  const month = MONTHS_ES[end.getMonth()]
  const year = end.getFullYear()

  return `${startDay} — ${endDay} ${month}, ${year}`
}
