export enum DashboardViews {
  DIARIA = 'Vista Diaria',
  SEMANAL = 'Vista Semanal',
  MENSUAL = 'Vista Mensual',
  ANUAL = 'Vista Anual',
}

export type RegCalendar = {
  fecha: string
  notification: boolean
}

export type Metric = {
  current: { raw: number; formatted: string; unit: 'minutes' }
  previous: { raw: number; formatted: string; unit: 'minutes' }
  trend: 'up' | 'down' | 'stable'
  trendPercentaje: number
}

export type Metrics = {
  period: {
    type: string
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
