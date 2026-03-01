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
        value: `${Math.abs(metrics.avgInBed.trendPercentaje)}%`,
        direction: getDirection(metrics.avgInBed.trendPercentaje),
        comparisonText: comparison,
      },
    },
    {
      title: 'Hora Media Sueño',
      value: metrics.avgSleep.current.formatted,
      trend: {
        value: `${Math.abs(metrics.avgSleep.trendPercentaje)}%`,
        direction: getDirection(metrics.avgSleep.trendPercentaje),
        comparisonText: comparison,
      },
    },
    {
      title: 'Eficiencia Media',
      value: metrics.avgEfficiency.current.formatted,
      trend: {
        value: `${Math.abs(metrics.avgEfficiency.trendPercentaje)}%`,
        direction: getDirection(metrics.avgEfficiency.trendPercentaje),
        comparisonText: comparison,
      },
    },
    {
      title: 'Latencia al Sueño',
      value: metrics.avgLatency.current.formatted,
      trend: {
        value: `${Math.abs(metrics.avgLatency.trendPercentaje)}%`,
        // Aquí invertimos: si el porcentaje es positivo (tardas más), la dirección es 'down' (mal)
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
