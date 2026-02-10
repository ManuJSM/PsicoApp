import type { SleepReg, SleepRegDto } from '@/types/sleepReg.types'
import { httpAuth } from '../http/httpAuth'
import { fromRegDtoToReg } from './sleep.mappers'
import type { RegCalendar } from '@/types/dashboardP.types'
export const formatDate = (date: Date): string => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}/${month}/${day}`
}
const regEndpoint = '/sleep/record'
const queryDate = (day: Date) => {
  return `?start=${formatDate(day)}&end=${formatDate(day)}`
}

export async function fetchDailyReg({
  userId,
  day,
}: {
  userId: number
  day: Date
}): Promise<SleepReg | null> {
  const regValues = await httpAuth<SleepRegDto[]>(
    `${regEndpoint}/${userId}${queryDate(day)}`
  )
  if (regValues.length === 0) {
    return null
  }
  return fromRegDtoToReg(regValues[0] as SleepRegDto)
}
const calendarEndpoint = '/sleep/calendar'

export async function fetchCalendar({
  userId = 2,
}: {
  userId?: number
}): Promise<RegCalendar[]> {
  const regValues = await httpAuth<RegCalendar[]>(
    `${calendarEndpoint}/${userId}`
  )
  return regValues
}
