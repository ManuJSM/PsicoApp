import type { SleepReg, SleepRegDto } from '@/types/sleepReg.types'
import { httpAuth } from '../http/httpAuth'
import { fromRegDtoToReg } from './sleep.mappers'
const formatDate = (date: Date): string => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}/${month}/${day}`
}
const endpoint = '/sleepRegs'
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
    `${endpoint}/${userId}${queryDate(day)}`
  )
  if (regValues.length === 0) {
    return null
  }
  return fromRegDtoToReg(regValues[0] as SleepRegDto)
}
