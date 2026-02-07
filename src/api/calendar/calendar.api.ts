import type { RegCalendar } from '@/types/dashboardP.types'
import { httpAuth } from '../http/httpAuth'

const endpoint = '/calendar'

export async function fetchCalendar({
  userId = 2,
}: {
  userId?: number
}): Promise<RegCalendar[]> {
  const regValues = await httpAuth<RegCalendar[]>(`${endpoint}/${userId}`)
  return regValues
}
