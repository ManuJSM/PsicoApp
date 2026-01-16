<template>
  <div
    class="bg-linear-to-br from-[#224c75] to-[#0d1520] rounded-2xl p-4 shadow-xl"
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
          {{ formatDuration(totalValue) }}
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
    <div class="relative flex-1 w-full mt-2">
      <!-- Tooltip -->
      <div
        v-if="activePoint !== null && showTooltip"
        class="absolute z-10 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm"
        :style="{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          transform: 'translate(-50%, -100%)',
        }"
      >
        <div class="font-bold">
          {{ formatDuration(dataPoints[activePoint].value) }}
        </div>
        <div class="text-gray-300 text-xs">
          {{ days[activePoint % days.length] }}
        </div>
      </div>

      <!-- Chart SVG -->
      <svg
        :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        class="relative z-0"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" :stop-color="chartColor" stop-opacity="0.5" />
            <stop offset="100%" :stop-color="chartColor" stop-opacity="0" />
          </linearGradient>

          <!-- Glow effect for active point -->
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Chart area -->
        <path :d="chartPath + areaPath" fill="url(#chartGradient)" />

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
          r="5"
          :class="[
            'cursor-pointer transition-all duration-200',
            activePoint === index ? 'animate-pulse r-7' : 'hover:r-7',
          ]"
          :style="activePoint === index ? { filter: 'url(#glow)' } : {}"
          @mouseenter="e => handlePointHover(e, index)"
          @mouseleave="clearActivePoint"
        />
      </svg>

      <!-- Days labels -->
      <div
        class="flex justify-between px-1 pt-3 text-[#9dabb9] text-xs font-bold uppercase mt-1"
      >
        <span v-for="(day, index) in days" :key="index" class="truncate">
          {{ day }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  // Interfaces
  interface DataPoint {
    x: number
    y: number
    value: number
  }

  interface TooltipPosition {
    x: number
    y: number
  }

  interface SleepChartProps {
    title?: string
    data: number[]
    labels?: string[]
    days?: string[]
    chartColor?: string
    previousPeriodData?: number[]
    showTooltip?: boolean
  }

  // Props con TypeScript
  const props = withDefaults(defineProps<SleepChartProps>(), {
    title: 'Duración del Sueño',
    labels: () => [],
    days: () => ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    chartColor: '#137fec',
    previousPeriodData: () => [],
    showTooltip: true,
  })

  // Refs
  const viewBoxWidth: number = 800
  const viewBoxHeight: number = 250 // Reducido para menos padding
  const activePoint = ref<number | null>(null)
  const tooltipPosition = ref<TooltipPosition>({ x: 0, y: 0 })

  // Calcular puntos del gráfico
  const dataPoints = computed<DataPoint[]>(() => {
    const maxValue = Math.max(...props.data)
    const minValue = Math.min(...props.data)
    const range = maxValue - minValue || 1 // evitar división por cero

    const spacing = viewBoxWidth / (props.data.length - 1 || 1)

    return props.data.map((value, index) => {
      // Normalizar el valor para el eje Y (invertido porque SVG Y=0 es arriba)
      const normalizedY = ((value - minValue) / range) * 180 // Reducido de 200 a 180
      const y = viewBoxHeight - 30 - normalizedY // Reducido margen inferior de 50 a 30

      return {
        x: index * spacing,
        y,
        value,
      }
    })
  })

  // Generar la línea del gráfico con curvas Bézier
  const chartPath = computed<string>(() => {
    if (dataPoints.value.length < 2) return ''

    let path = `M${dataPoints.value[0].x},${dataPoints.value[0].y}`

    for (let i = 1; i < dataPoints.value.length; i++) {
      const prev = dataPoints.value[i - 1]
      const curr = dataPoints.value[i]

      // Punto de control para crear curvas suaves
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

    const lastPoint = dataPoints.value[dataPoints.value.length - 1]
    const firstPoint = dataPoints.value[0]

    return ` L${lastPoint.x},${viewBoxHeight} L${firstPoint.x},${viewBoxHeight} Z`
  })

  // Calcular valor total (promedio en este caso)
  const totalValue = computed<number>(() => {
    if (props.data.length === 0) return 0
    const sum = props.data.reduce((a, b) => a + b, 0)
    return Math.round(sum / props.data.length)
  })

  // Calcular cambio porcentual
  const changePercent = computed<number>(() => {
    if (props.previousPeriodData.length === 0) return 0

    const currentAvg = totalValue.value
    const previousAvg =
      props.previousPeriodData.reduce((a, b) => a + b, 0) /
      props.previousPeriodData.length

    if (previousAvg === 0) return 0

    return ((currentAvg - previousAvg) / previousAvg) * 100
  })

  // Formatear duración
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Manejar hover en los puntos
  const handlePointHover = (event: MouseEvent, index: number): void => {
    activePoint.value = index

    if (!props.showTooltip) return

    // Obtener posición del mouse relativa al SVG
    const svgRect = (event.currentTarget as HTMLElement)
      .closest('svg')
      ?.getBoundingClientRect()

    if (svgRect) {
      // Calcular posición del tooltip relativa al contenedor del gráfico
      const containerRect = (event.currentTarget as HTMLElement)
        .closest('.relative')
        ?.getBoundingClientRect()

      if (containerRect) {
        tooltipPosition.value = {
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top,
        }
      }
    }
  }

  // Limpiar punto activo
  const clearActivePoint = (): void => {
    activePoint.value = null
  }
</script>

<style scoped>
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }
</style>
