// Función para calcular la duración en formato legible
const calculateDuration = (hours: number): string => {
  if (hours <= 0) return ''
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)
  return `${wholeHours}h ${minutes.toString().padStart(2, '0')}m`
}

// Función para calcular el porcentaje de duración
const calculateDurationPercentage = (hours: number, target: number): number => {
  if (hours <= 0) return 0
  return Math.min(Math.round((hours / target) * 100), 100)
}

// Función para calcular el porcentaje de calidad (0-5 a 0-100%)
const calculateQualityPercentage = (rating: number): number => {
  return Math.round((rating / 5) * 100)
}

// Función para obtener el icono según la calidad
const getQualityIcon = (percentage: number): string => {
  if (percentage >= 90) return 'sentiment_very_satisfied'
  if (percentage >= 80) return 'sentiment_satisfied_alt'
  if (percentage >= 70) return 'sentiment_satisfied'
  if (percentage >= 60) return 'sentiment_neutral'
  return 'sentiment_dissatisfied'
}

// Función para obtener el color según la calidad
const getQualityColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-blue-500'
  if (percentage >= 80) return 'text-green-500'
  if (percentage >= 70) return 'text-yellow-500'
  return 'text-red-500'
}

// Función para obtener el color del borde según la calidad
const getBorderColor = (percentage: number): string => {
  if (percentage >= 90) return 'border-green-500'
  if (percentage >= 80) return 'border-primary'
  if (percentage >= 70) return 'border-yellow-500'
  return 'border-red-500'
}

// Función para obtener el color de la barra de progreso
const getBgColor = (percentage: number): string => {
  if (percentage >= 100) return 'bg-green-500'
  if (percentage >= 90) return 'bg-primary'
  if (percentage >= 80) return 'bg-yellow-500'
  return 'bg-red-500'
}

export {
  calculateDuration,
  calculateDurationPercentage,
  calculateQualityPercentage,
  getQualityIcon,
  getQualityColor,
  getBorderColor,
  getBgColor,
}
