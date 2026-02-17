export type RegCalendar = {
  fecha: string
  notification: boolean
}

export type Metric = {
  current: { raw: number; formatted: string; unit: string }
  previous: { raw: number; formatted: string; unit: string }
  trend: 'up' | 'down' | 'stable'
  trendPercentaje: number
}

export type Metrics = {
  period: {
    start: string
    end: string
    label: string
  }
  avgSleep: Metric
  avgAwake: Metric
  avgLatency: Metric
  avgInBed: Metric
  avgEfficiency: Metric
}

export enum CharGroup {
  DAY = 'day',
  WEEK = 'week',
  YEAR = 'year',
}
export enum CharDataType {
  ASLEEP = 'sleep',
  EFFIC = 'efficiency',
  INBED = 'inbed',
  AWAKE = 'awake',
  LATENCY = 'latency',
}

export interface CharPoint {
  date: string
  value: number
}

export interface CharData {
  period: CharGroup
  data: CharPoint[]
}
