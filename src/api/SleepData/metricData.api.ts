import { httpAuth } from '../http/httpAuth'
import { formatDate } from './sleepReg.api'
import type { CharData, Metrics } from '@/types/dashboardP.types'

const regEndpoint = '/sleep/metrics'
const queryDate = (start: Date, end: Date) => {
  return `?start=${formatDate(start)}&end=${formatDate(end)}`
}
const queryType = (type: string, groupBy: string) => {
  return `&type=${type}&groupBy=${groupBy}`
}
const chartEndpoint = '/sleep/ChartData'

export async function fetchMetrics({
  userId,
  start,
  end,
}: {
  userId: number
  start: Date
  end: Date
}): Promise<Metrics> {
  const metrics = await httpAuth<Metrics>(
    `${regEndpoint}/${userId}${queryDate(start, end)}`
  )
  return metrics
}

export async function fetchSleepData({
  userId,
  start,
  end,
  type,
  groupBy,
}: {
  userId: number
  start: Date
  end: Date
  type: string
  groupBy: string
}): Promise<CharData> {
  const data = await httpAuth<CharData>(
    `${chartEndpoint}/${userId}/${queryDate(start, end)}${queryType(type, groupBy)}`
  )

  return data
}
