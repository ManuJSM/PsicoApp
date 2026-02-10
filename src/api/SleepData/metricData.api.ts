import { httpAuth } from '../http/httpAuth'
import { formatDate } from './sleepReg.api'
import type { Metrics } from '@/types/dashboardP.types'

const regEndpoint = '/sleep/metrics'
const queryDate = (start: Date, end: Date) => {
  return `?start=${formatDate(start)}&end=${formatDate(end)}`
}

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
