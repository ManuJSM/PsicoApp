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
          {{ props.averageTimeAsleep }}
        </p>
        <span
          v-if="hasData && changePercent !== 0"
          :class="[
            'text-sm font-bold flex items-center gap-1',
            props.changePercent >= 0 ? 'text-[#0bda5b]' : 'text-[#ff6b6b]',
          ]"
        >
          <span class="material-symbols-outlined text-sm">
            {{ props.changePercent >= 0 ? 'trending_up' : 'trending_down' }}
          </span>
          {{ props.changePercent >= 0 ? '+' : ''
          }}{{ props.changePercent.toFixed(0) }}% vs. anterior
        </span>
        <span v-else-if="!hasData" class="text-sm text-[#9dabb9]">
          Sin datos
        </span>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative grow w-full mt-2">
      <svg
        :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        class="relative z-0"
        ref="svgElement"
      >
        <!-- Gradiente -->
        <defs>
          <linearGradient :id="gradientId" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" :stop-color="chartColor" stop-opacity="0.5" />
            <stop offset="100%" :stop-color="chartColor" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Chart area -->
        <path
          ref="chartArea"
          :d="chartPath + areaPath"
          :fill="`url(#${gradientId})`"
          class="chart-area"
          :style="{
            opacity: isAnimating ? 0 : 1,
            transition: isAnimating ? 'none' : 'opacity 0.2s ease-in-out',
          }"
        />

        <!-- Chart line -->
        <path
          ref="chartLine"
          :d="chartPath"
          fill="none"
          :stroke="chartColor"
          stroke-width="3"
          stroke-linecap="round"
          class="chart-line"
          :style="lineStyle"
        />

        <!-- Data points -->
        <g class="data-points">
          <circle
            v-for="(point, index) in dataPoints"
            :key="index"
            :cx="point.x"
            :cy="point.y"
            :fill="chartColor"
            r="0"
            ref="dataPointsRef"
          />
        </g>

        <!-- Empty points -->
        <g class="empty-points">
          <circle
            v-for="(period, index) in emptyPeriods"
            :key="'empty-' + index"
            :cx="getXPosition(index)"
            :cy="viewBoxHeight - 40"
            fill="#6b7280"
            r="0"
            opacity="0.3"
            ref="emptyPointsRef"
          />
        </g>

        <!-- LABELS - MÁS ARRIBA -->
        <g v-for="(label, index) in displayedLabels" :key="index">
          <text
            :x="getXPosition(index)"
            :y="viewBoxHeight - 30"
            text-anchor="middle"
            :class="{
              'first-label': index === 0,
              'last-label': index === displayedLabels.length - 1,
            }"
            fill="#9dabb9"
            font-size="20"
            font-weight="bold"
          >
            {{ label }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

  export interface SleepData {
    date: string
    value: number
  }

  export interface SleepLineChartProps {
    averageTimeAsleep: string
    changePercent?: number
    title?: string
    chartData: SleepData[]
    period: 'day' | 'month' | 'year' | 'week'
    chartColor?: string
    displayCount?: number
  }

  // Props
  const props = withDefaults(defineProps<SleepLineChartProps>(), {
    title: 'Tiempo Dormido',
    changePercent: 0,
    averageTimeAsleep: '2h',
    period: 'day',
    chartColor: '#935fe0',
    displayCount: 12,
  })

  // Refs
  const gradientId = ref('')
  const chartLine = ref<SVGPathElement | null>(null)
  const chartArea = ref<SVGPathElement | null>(null)
  const dataPointsRef = ref<SVGCircleElement[]>([])
  const emptyPointsRef = ref<SVGCircleElement[]>([])
  const svgElement = ref<SVGSVGElement | null>(null)

  const isAnimating = ref(true)
  const lineLength = ref(1000)

  // viewBox
  const viewBoxWidth = 1000
  const viewBoxHeight = 400
  const ANIMATION_DURATION = 1000

  // Labels según el período
  const periodLabels = computed(() => {
    if (props.period === 'day') {
      return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].slice(
        0,
        props.displayCount
      )
    } else if (props.period === 'month') {
      const months = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ]
      return months.slice(0, props.displayCount)
    } else if (props.period === 'week') {
      const weeks = []
      const maxWeeks = props.displayCount
      for (let i = 1; i <= maxWeeks; i++) {
        weeks.push(`S${i}`)
      }
      return weeks
    } else {
      // year
      const currentYear = new Date().getFullYear()
      const years = []
      for (let i = props.displayCount - 1; i >= 0; i--) {
        years.push((currentYear - i).toString())
      }
      return years
    }
  })

  // Función para posición X
  const getXPosition = (index: number): number => {
    const total = periodLabels.value.length
    if (total === 1) return viewBoxWidth / 2
    return (index / (total - 1)) * viewBoxWidth
  }

  // Verificar si hay datos
  const hasData = computed(() => {
    return props.chartData.length > 0
  })

  // Procesar datos agrupados por período
  const groupedData = computed(() => {
    const grouped = new Map<string, number[]>()

    props.chartData.forEach(item => {
      const periodKey = getPeriodKeyFromDate(item.date)
      if (periodKey) {
        if (!grouped.has(periodKey)) {
          grouped.set(periodKey, [])
        }
        grouped.get(periodKey)?.push(item.value)
      }
    })

    // Calcular promedio para cada período
    const averaged = new Map<string, number>()
    grouped.forEach((values, key) => {
      const sum = values.reduce((acc, val) => acc + val, 0)
      averaged.set(key, sum / values.length)
    })

    return averaged
  })

  // Obtener clave única para el período desde una fecha
  const getPeriodKeyFromDate = (dateStr: string): string | null => {
    const date = new Date(dateStr)

    if (props.period === 'day') {
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      return days[date.getDay()] as string
    }

    if (props.period === 'month') {
      const months = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ]
      return months[date.getMonth()] as string
    }

    if (props.period === 'week') {
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const firstDay = firstDayOfMonth.getDay()
      const offsetDate = date.getDate() + (firstDay === 0 ? 6 : firstDay - 1)
      const weekNumber = Math.floor(offsetDate / 7) + 1
      return `S${weekNumber}`
    }

    if (props.period === 'year') {
      return date.getFullYear().toString()
    }

    return null
  }

  // Obtener valor para un período específico
  const getValueForPeriod = (periodIndex: number): number | null => {
    const periodKey = periodLabels.value[periodIndex] as string
    return groupedData.value.get(periodKey) || null
  }

  // Verificar si hay datos para un período específico
  const hasDataForPeriod = (periodIndex: number): boolean => {
    return getValueForPeriod(periodIndex) !== null
  }

  // Obtener todos los valores válidos
  const validChartValues = computed(() => {
    return periodLabels.value
      .map((label, index) => ({
        index: index,
        value: getValueForPeriod(index),
      }))
      .filter(item => item.value !== null) as {
      index: number
      value: number
    }[]
  })

  // Calcular puntos del gráfico
  const dataPoints = computed(() => {
    const validData = validChartValues.value
    if (validData.length === 0) return []

    const values = validData.map(item => item.value)
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    const range = maxValue - minValue || 1

    return validData.map(item => {
      const normalizedY = ((item.value - minValue) / range) * 250
      const y = viewBoxHeight - 80 - normalizedY

      return {
        x: getXPosition(item.index),
        y,
        value: item.value,
        index: item.index,
      }
    })
  })

  // Obtener períodos sin datos
  const emptyPeriods = computed(() => {
    return periodLabels.value
      .map((label, index) => ({ label, index }))
      .filter(item => !hasDataForPeriod(item.index))
  })

  // Generar la línea del gráfico
  const chartPath = computed<string>(() => {
    const dp = dataPoints.value
    if (dp.length < 2) return ''

    const sortedPoints = [...dp].sort((a, b) => a.index - b.index)
    const first = sortedPoints[0] as { x: number; y: number }

    let path = `M${first.x},${first.y}`

    for (let i = 1; i < sortedPoints.length; i++) {
      const prev = sortedPoints[i - 1] as { x: number; y: number }
      const curr = sortedPoints[i] as { x: number; y: number }

      const dx = curr.x - prev.x
      const cp1x = prev.x + dx * 0.3
      const cp1y = prev.y
      const cp2x = curr.x - dx * 0.3
      const cp2y = curr.y

      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`
    }

    return path
  })

  // Ruta para el área sombreada
  const areaPath = computed<string>(() => {
    const dp = dataPoints.value
    if (dp.length === 0) return ''

    const sortedPoints = [...dp].sort((a, b) => a.index - b.index)
    const lastPoint = sortedPoints[sortedPoints.length - 1] as { x: number }
    const firstPoint = sortedPoints[0] as { x: number }

    return ` L${lastPoint.x},${viewBoxHeight - 60} L${firstPoint.x},${viewBoxHeight - 60} Z`
  })

  // Labels a mostrar
  const displayedLabels = computed(() => {
    return periodLabels.value.map(label => {
      if (props.period === 'month' && label.length > 3) {
        return label.substring(0, 3)
      }
      return label
    })
  })

  // CALCULAR LONGITUD DEL PATH
  const calculateLineLength = (): number => {
    if (!chartPath.value) return 1000

    try {
      const tempPath = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      )
      tempPath.setAttribute('d', chartPath.value)
      const length = tempPath.getTotalLength()
      return length > 0 ? length : 1000
    } catch (e) {
      console.error('Error calculating line length:', e)
      return 1000
    }
  }

  // Estilo dinámico para la línea
  const lineStyle = computed(() => ({
    strokeDasharray: lineLength.value,
    strokeDashoffset: isAnimating.value ? lineLength.value : 0,
    transition: isAnimating.value
      ? 'none'
      : `stroke-dashoffset ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  }))

  // Inicializar
  onMounted(() => {
    gradientId.value = `gradient-${Math.random().toString(36).substring(2, 9)}`
    startAnimation()
  })

  // Actualizar lineLength cuando cambie el chartPath
  watch(
    () => chartPath.value,
    () => {
      nextTick(() => {
        lineLength.value = calculateLineLength()
      })
    },
    { immediate: true }
  )

  // Reiniciar animación cuando cambian los datos
  watch(
    () => [props.chartData, props.period, props.displayCount],
    () => {
      if (hasData.value) {
        startAnimation()
      }
    }
  )

  // Función para iniciar la animación
  const startAnimation = async () => {
    isAnimating.value = true

    await nextTick()

    resetAnimation()

    setTimeout(() => {
      lineLength.value = calculateLineLength()

      if (chartLine.value) {
        chartLine.value.style.transition = `stroke-dashoffset ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
        chartLine.value.style.strokeDashoffset = '0'
      }

      if (chartArea.value) {
        chartArea.value.style.transition = `opacity ${ANIMATION_DURATION}ms ease-in-out`
        chartArea.value.style.opacity = '1'
      }

      dataPointsRef.value.forEach(point => {
        point.style.transition = `r ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
        point.setAttribute('r', '3')
      })

      emptyPointsRef.value.forEach(point => {
        point.style.transition = `r ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
        point.setAttribute('r', '2')
      })

      setTimeout(() => {
        isAnimating.value = false
      }, ANIMATION_DURATION)
    }, 50)
  }

  // Resetear animación
  const resetAnimation = () => {
    if (chartLine.value) {
      chartLine.value.style.strokeDashoffset = `${lineLength.value}`
      chartLine.value.style.transition = 'none'
    }

    if (chartArea.value) {
      chartArea.value.style.opacity = '0'
      chartArea.value.style.transition = 'none'
    }

    dataPointsRef.value.forEach(point => {
      point.setAttribute('r', '0')
      point.style.transition = 'none'
    })

    emptyPointsRef.value.forEach(point => {
      point.setAttribute('r', '0')
      point.style.transition = 'none'
    })
  }

  // Limpiar animaciones al desmontar
  onUnmounted(() => {
    if (chartLine.value) {
      chartLine.value.style.transition = 'none'
    }
  })
</script>

<style scoped>
  .first-label {
    text-anchor: start;
  }

  .last-label {
    text-anchor: end;
  }

  text {
    dominant-baseline: hanging;
    font-family: inherit;
  }
</style>
