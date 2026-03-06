import { DashboardViews } from '@/types/dashboard.types'
import {
  getWeekRange,
  type DateRange,
  getMonthRange,
  getYearRange,
  formatDateRange,
} from '@/utils/date.utils'
import type { Metrics } from '@/types/metrics.types'
import type { MetricCardProps } from '@/views/components/Metrics/MetricCard.vue'

export interface ViewConfig {
  dateRange: DateRange
  groupBy: 'day' | 'week' | 'month'
  title: string
  comparisonText: string
}

export const getViewConfig = (
  view: DashboardViews,
  selectedDate: Date
): ViewConfig => {
  switch (view) {
    case DashboardViews.SEMANAL:
      const dateRange = getWeekRange(selectedDate)
      return {
        dateRange,
        groupBy: 'day',
        title: 'Semana del ' + formatDateRange(dateRange),
        comparisonText: 'vs semana anterior',
      }
    case DashboardViews.MENSUAL:
      const monthRange = getMonthRange(selectedDate)
      return {
        dateRange: monthRange,
        groupBy: 'week',
        title: 'Mes del ' + formatDateRange(monthRange),
        comparisonText: 'vs mes anterior',
      }
    case DashboardViews.ANUAL:
      const yearRange = getYearRange(selectedDate)
      return {
        dateRange: yearRange,
        groupBy: 'month',
        title: 'Anio ' + yearRange.start.getFullYear(),
        comparisonText: 'vs Anio anterior',
      }
    default:
      throw new Error(`View ${view} not supported`)
  }
}
const formatTrend = (val: number) => (val > 0 ? `+${val}%` : `${val}%`)
export function getCardsValues(
  metrics: Metrics,
  comparison: string
): MetricCardProps[] {
  // Función auxiliar para determinar la dirección real
  const getDirection = (value: number, invert: boolean = false) => {
    if (value === 0) return 'stable'
    if (invert) return value > 0 ? 'down' : 'up' // Para latencia: más tiempo es peor
    return value > 0 ? 'up' : 'down'
  }

  return [
    {
      title: 'Tiempo en Cama',
      value: metrics.avgInBed.current.formatted,
      trend: {
        value: formatTrend(metrics.avgInBed.trendPercentaje),
        direction: getDirection(metrics.avgInBed.trendPercentaje, true),
        comparisonText: comparison,
      },
    },
    {
      title: 'Hora Media Sueño',
      value: metrics.avgSleep.current.formatted,
      trend: {
        value: formatTrend(metrics.avgSleep.trendPercentaje),
        direction: getDirection(metrics.avgSleep.trendPercentaje),
        comparisonText: comparison,
      },
    },
    {
      title: 'Eficiencia Media',
      value: metrics.avgEfficiency.current.formatted,
      trend: {
        value: formatTrend(metrics.avgEfficiency.trendPercentaje),
        direction: getDirection(metrics.avgEfficiency.trendPercentaje),
        comparisonText: comparison,
      },
    },
    {
      title: 'Latencia al Sueño',
      value: metrics.avgLatency.current.formatted,
      trend: {
        value: formatTrend(metrics.avgLatency.trendPercentaje),
        direction: getDirection(metrics.avgLatency.trendPercentaje, true),
        comparisonText: comparison,
      },
    },
  ]
}

export function getDonutSegments(
  avgAsleep: number,
  avgInBed: number,
  avgAwake: number
) {
  const segments = []

  if (avgAsleep > 0) {
    segments.push({ value: avgAsleep, color: '#D946EF', label: 'Asleep' })
  }
  if (avgInBed > 0) {
    segments.push({ value: avgInBed, color: '#F59E0B', label: 'InBed' })
  }
  if (avgAwake > 0) {
    segments.push({ value: avgAwake, color: '#4ADE80', label: 'Awake' })
  }

  return segments
}

export const calculateDuration = (hours: number): string => {
  if (hours <= 0) return ''
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)
  return `${wholeHours}h ${minutes.toString().padStart(2, '0')}m`
}

export const calculateDurationPercentage = (
  hours: number,
  target: number
): number => {
  if (hours <= 0) return 0
  return Math.min(Math.round((hours / target) * 100), 100)
}

export const calculateQualityPercentage = (rating: number): number => {
  return Math.round((rating / 5) * 100)
}

export const getQualityIcon = (percentage: number): string => {
  if (percentage >= 90) return 'sentiment_very_satisfied'
  if (percentage >= 80) return 'sentiment_satisfied_alt'
  if (percentage >= 70) return 'sentiment_satisfied'
  if (percentage >= 60) return 'sentiment_neutral'
  return 'sentiment_dissatisfied'
}

export const getQualityColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-blue-400'
  if (percentage >= 80) return 'text-green-400'
  if (percentage >= 70) return 'text-yellow-400'
  return 'text-red-400'
}

export const getBorderColor = (percentage: number): string => {
  if (percentage >= 90) return 'border-green-500'
  if (percentage >= 80) return 'border-primary'
  if (percentage >= 70) return 'border-yellow-500'
  return 'border-red-500'
}

export const getBgColor = (percentage: number): string => {
  if (percentage >= 100) return 'bg-green-500'
  if (percentage >= 90) return 'bg-primary'
  if (percentage >= 80) return 'bg-yellow-500'
  return 'bg-red-500'
}

export async function deleteAllArray<T>(array: T[]): Promise<void> {
  while (array.length > 0) {
    array.pop()
    await new Promise(resolve => setTimeout(resolve, 300))
  }
}
