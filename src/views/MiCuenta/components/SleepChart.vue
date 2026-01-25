<template>
  <div
    class="dark:bg-card-dark border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-xl flex flex-col"
  >
    <!-- Header -->
    <div class="mb-3">
      <h3
        class="text-[#9dabb9] text-sm font-bold uppercase tracking-widest mb-1"
      >
        {{ title }}
      </h3>
      <div class="flex items-baseline gap-3">
        <p class="text-white text-4xl font-black leading-none">
          {{ formatDuration(averageTimeAsleep) }}
        </p>
        <span
          :class="[
            'text-sm font-bold flex items-center gap-1',
            changePercent >= 0 ? 'text-[#0bda5b]' : 'text-[#ff6b6b]',
          ]"
        >
          <span class="material-symbols-outlined text-sm">
            {{ changePercent >= 0 ? 'trending_up' : 'trending_down' }}
          </span>
          {{ changePercent >= 0 ? '+' : '' }}{{ changePercent.toFixed(0) }}% vs.
          pasada
        </span>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative grow w-full mt-2">
      <!-- Chart SVG -->
      <svg
        :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        class="relative z-0"
      >
        <!-- Gradiente único -->
        <defs>
          <linearGradient :id="gradientId" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" :stop-color="chartColor" stop-opacity="0.5" />
            <stop offset="100%" :stop-color="chartColor" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Chart area -->
        <path :d="chartPath + areaPath" :fill="`url(#${gradientId})`" />

        <!-- Chart line -->
        <path
          :d="chartPath"
          fill="none"
          :stroke="chartColor"
          stroke-width="3"
          stroke-linecap="round"
        />

        <!-- Data points -->
        <circle
          v-for="(point, index) in dataPoints"
          :key="index"
          :cx="point.x"
          :cy="point.y"
          :fill="chartColor"
          r="3"
        />
      </svg>
    </div>

    <!-- Days labels - MEJORADO -->
    <div class="w-full mt-3 overflow-hidden">
      <div
        class="flex justify-between items-center text-[#9dabb9] text-xs font-bold uppercase gap-1"
      >
        <div
          v-for="(day, index) in displayedDays"
          :key="index"
          class="flex-1 min-w-0"
        >
          <div class="text-center truncate" :title="originalDays[index]">
            {{ day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue'

  // Interfaces
  interface ChartDayData {
    day: string
    value: number // minutos dormidos
  }

  interface DataPoint {
    x: number
    y: number
    value: number
  }

  interface SleepLineChartProps {
    title?: string
    chartData: ChartDayData[]
    days?: string[]
    chartColor?: string
    previousPeriodData?: ChartDayData[]
  }

  // Props
  const props = withDefaults(defineProps<SleepLineChartProps>(), {
    title: 'Tiempo Dormido Semanal',
    days: () => ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    chartColor: '#137fec',
    previousPeriodData: () => [],
  })

  // Refs
  const gradientId = ref('')

  // Constantes
  const viewBoxWidth: number = 800
  const viewBoxHeight: number = 250

  // Inicializar ID único para el gradiente
  onMounted(() => {
    gradientId.value = `gradient-${Math.random().toString(36).substring(2, 9)}`
  })

  // Días originales para tooltip
  const originalDays = computed(() => props.days)

  // Días mostrados (abreviados si es necesario)
  const displayedDays = computed(() => {
    // Si hay muchos días o nombres largos, abreviar
    return props.days.map(day => {
      if (day.length > 3) {
        return day.substring(0, 3)
      }
      return day
    })
  })

  // Extraer solo los valores
  const chartValues = computed(() => {
    return props.chartData.map(day => day.value)
  })

  // Calcular puntos del gráfico
  const dataPoints = computed<DataPoint[]>(() => {
    const data = chartValues.value
    if (data.length === 0) return []

    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const range = maxValue - minValue || 1

    const spacing = viewBoxWidth / (data.length - 1 || 1)

    return data.map((value, index) => {
      const normalizedY = ((value - minValue) / range) * 180
      const y = viewBoxHeight - 60 - normalizedY // Más espacio para etiquetas

      return {
        x: index * spacing,
        y,
        value,
      }
    })
  })

  // Generar la línea del gráfico
  const chartPath = computed<string>(() => {
    const dp = dataPoints.value
    if (dp.length < 2) return ''
    const first = dp[0] as DataPoint

    let path = `M${first.x},${first.y}`

    for (let i = 1; i < dp.length; i++) {
      const prev = dp[i - 1] as DataPoint
      const curr = dp[i] as DataPoint

      const cp1x = prev.x + (curr.x - prev.x) / 3
      const cp1y = prev.y
      const cp2x = curr.x - (curr.x - prev.x) / 3
      const cp2y = curr.y

      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`
    }

    return path
  })

  // Ruta para el área sombreada
  const areaPath = computed<string>(() => {
    if (dataPoints.value.length === 0) return ''

    const lastPoint = dataPoints.value[dataPoints.value.length - 1] as DataPoint
    const firstPoint = dataPoints.value[0] as DataPoint

    return ` L${lastPoint.x},${viewBoxHeight - 40} L${firstPoint.x},${viewBoxHeight - 40} Z`
  })

  // Calcular promedio de tiempo dormido
  const averageTimeAsleep = computed<number>(() => {
    if (props.chartData.length === 0) return 0
    const total = props.chartData.reduce((sum, day) => sum + day.value, 0)
    return Math.round(total / props.chartData.length)
  })

  // Calcular cambio porcentual
  const changePercent = computed<number>(() => {
    if (props.previousPeriodData.length === 0) return 0

    const currentAvg = averageTimeAsleep.value

    const previousTotal = props.previousPeriodData.reduce(
      (sum, day) => sum + day.value,
      0
    )
    const previousAvg = Math.round(
      previousTotal / props.previousPeriodData.length
    )

    if (previousAvg === 0) return 0

    return ((currentAvg - previousAvg) / previousAvg) * 100
  })

  // Formatear duración
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) {
      return `${mins}m`
    } else if (mins === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${mins}m`
    }
  }
</script>

<style scoped>
  /* Asegurar que los días no se salgan */
  .day-cell {
    flex: 1 1 0;
    min-width: 0; /* IMPORTANTE: permite que el truncate funcione */
  }

  .day-label {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
