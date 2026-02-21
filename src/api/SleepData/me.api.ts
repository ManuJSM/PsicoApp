import type { SleepReg, SleepRegDto } from '@/types/sleepReg.types'
import type { RegCalendar } from '@/types/metrics.types'
import { httpAuth } from '../http/httpAuth'
import { fromRegDtoToReg } from './sleep.mappers'
import { formatDate } from './sleepReg.api'

const queryDate = (day: Date) => {
  return `?start=${formatDate(day)}&end=${formatDate(day)}`
}

const regEndpoint = '/me/sleep/record'
export async function fetchMeDailyReg({
  day,
}: {
  day: Date
}): Promise<SleepReg | null> {
  const regValues = await httpAuth<SleepRegDto[]>(
    `${regEndpoint}${queryDate(day)}`
  )
  if (regValues.length === 0) {
    return null
  }
  return fromRegDtoToReg(regValues[0] as SleepRegDto)
}

export async function createReg(registro: SleepReg): Promise<SleepReg> {
  const regValue = await httpAuth<SleepRegDto>(`${regEndpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registro),
  })
  return fromRegDtoToReg(regValue)
}

export async function updateReg(registro: SleepReg): Promise<SleepReg> {
  const regValue = await httpAuth<SleepRegDto>(`${regEndpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registro),
  })
  return fromRegDtoToReg(regValue)
}

const calendarEndpoint = '/me/sleep/calendar'
export async function fetchMeCalendar(): Promise<RegCalendar[]> {
  const regValues = await httpAuth<RegCalendar[]>(`${calendarEndpoint}`)
  return regValues
}
