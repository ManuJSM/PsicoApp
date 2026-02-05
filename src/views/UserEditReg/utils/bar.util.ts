// Calcular ancho del intervalo para la barra
import type { Interval } from '@/types/sleepReg.types'
export const getIntervalWidth = (
  interval: Interval,
  totalTimeInBedMinutes: number
): number => {
  if (totalTimeInBedMinutes === 0) return 0
  const intervalMinutes = interval.hours * 60 + interval.minutes
  const percentage = (intervalMinutes / totalTimeInBedMinutes) * 100
  return Math.max(2, percentage) // Mínimo 2% para que sea visible
}
