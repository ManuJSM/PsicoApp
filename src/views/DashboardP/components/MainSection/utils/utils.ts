function getQualityEficiency(quality: number): 'green' | 'yellow' | 'red' {
  if (quality >= 80) return 'green'
  if (quality >= 60) return 'yellow'
  return 'red'
}
const colorStatCard: Record<string, Record<string, string>> = {
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-400',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-500',
    text: 'text-green-700 dark:text-green-400',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-500',
    text: 'text-blue-700 dark:text-blue-400',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-500',
    text: 'text-red-700 dark:text-red-400',
  },
} as const

export { getQualityEficiency, colorStatCard }
