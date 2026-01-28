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
          v-if="hasPreviousPeriodData && hasData"
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
        <span v-else-if="!hasData" class="text-sm text-[#9dabb9]">
          Sin datos
        </span>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative grow w-full mt-2">
      <!-- Estado sin datos -->
      <div
        v-if="!hasData"
        class="absolute inset-0 flex flex-col items-center justify-center text-[#9dabb9] min-h-[180px]"
      >
        <span class="material-symbols-outlined text-4xl mb-2 opacity-50">
          show_chart
        </span>
        <p class="text-sm font-medium">No hay datos disponibles</p>
      </div>

      <!-- Chart SVG -->
      <svg
        v-else
        :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        class="relative z-0"
        ref="svgElement"
      >
        <!-- Gradiente único -->
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

        <!-- Chart line con animación de dibujado -->
        <path
          ref="chartLine"
          :d="chartPath"
          fill="none"
          :stroke="chartColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-dasharray="1000"
          stroke-dashoffset="1000"
          class="chart-line"
        />

        <!-- Data points (solo para días con datos) -->
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

        <!-- Puntos vacíos para días sin datos -->
        <g class="empty-points">
          <circle
            v-for="(day, index) in emptyDays"
            :key="'empty-' + index"
            :cx="getDayXPosition(index)"
            :cy="viewBoxHeight - 60"
            fill="#6b7280"
            r="0"
            opacity="0.3"
            ref="emptyPointsRef"
          />
        </g>
      </svg>
    </div>

    <!-- Days labels -->
    <div class="w-full mt-3 overflow-hidden">
      <div
        class="flex justify-between items-center text-[#9dabb9] text-xs font-bold uppercase gap-1"
      >
        <div
          v-for="(day, index) in displayedDaysWithData"
          :key="index"
          class="flex-1 min-w-0"
        >
          <div
            class="text-center truncate"
            :title="originalDays[index]"
            :class="{
              'opacity-100': hasDataForDay(index),
              'opacity-40': !hasDataForDay(index),
            }"
          >
            {{ day }}
            <div
              v-if="!hasDataForDay(index)"
              class="text-[10px] text-[#6b7280] font-normal normal-case"
            >
              sin datos
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

  // Interfaces
  interface ChartDayData {
    day: string
    value: number // minutos dormidos
  }

  interface DataPoint {
    x: number
    y: number
    value: number
    dayIndex: number
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
  const svgElement = ref<SVGSVGElement | null>(null)
  const chartLine = ref<SVGPathElement | null>(null)
  const chartArea = ref<SVGPathElement | null>(null)
  const dataPointsRef = ref<SVGCircleElement[]>([])
  const emptyPointsRef = ref<SVGCircleElement[]>([])
  const isAnimating = ref(true)

  // Constantes
  const viewBoxWidth: number = 800
  const viewBoxHeight: number = 250
  const ANIMATION_DURATION = 1000 // 1 segundo

  // Inicializar ID único para el gradiente
  onMounted(() => {
    gradientId.value = `gradient-${Math.random().toString(36).substring(2, 9)}`
    startAnimation()
  })

  // Reiniciar animación cuando cambian los datos
  watch(
    () => props.chartData,
    () => {
      if (hasData.value) {
        startAnimation()
      }
    }
  )

  // Función para iniciar la animación simultánea
  const startAnimation = async () => {
    isAnimating.value = true

    // Esperar al siguiente ciclo de renderizado
    await nextTick()

    // Resetear todos los elementos a su estado inicial
    resetAnimation()

    // Iniciar TODAS las animaciones al mismo tiempo
    setTimeout(() => {
      animateLine()
      animateArea()
      animateDataPoints()
      animateEmptyPoints()

      // Marcar como completado después de la duración de la animación
      setTimeout(() => {
        isAnimating.value = false
      }, ANIMATION_DURATION)
    }, 50)
  }

  // Resetear animación
  const resetAnimation = () => {
    if (chartLine.value) {
      chartLine.value.style.strokeDashoffset = '1000'
      chartLine.value.style.transition = 'none'
    }

    if (chartArea.value) {
      chartArea.value.style.opacity = '0'
      chartArea.value.style.transition = 'none'
    }

    // Resetear puntos de datos
    dataPointsRef.value.forEach(point => {
      point.setAttribute('r', '0')
      point.style.transition = 'none'
    })

    // Resetear puntos vacíos
    emptyPointsRef.value.forEach(point => {
      point.setAttribute('r', '0')
      point.style.transition = 'none'
    })
  }

  // Animar la línea
  const animateLine = () => {
    if (chartLine.value) {
      chartLine.value.style.transition = `stroke-dashoffset ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
      chartLine.value.style.strokeDashoffset = '0'
    }
  }

  // Animar el área
  const animateArea = () => {
    if (chartArea.value) {
      chartArea.value.style.transition = `opacity ${ANIMATION_DURATION}ms ease-in-out`
      chartArea.value.style.opacity = '1'
    }
  }

  // Animar puntos de datos
  const animateDataPoints = () => {
    dataPointsRef.value.forEach(point => {
      point.style.transition = `r ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
      point.setAttribute('r', '3')
    })
  }

  // Animar puntos vacíos
  const animateEmptyPoints = () => {
    emptyPointsRef.value.forEach(point => {
      point.style.transition = `r ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
      point.setAttribute('r', '2')
    })
  }

  // Limpiar animaciones al desmontar
  onUnmounted(() => {
    if (chartLine.value) {
      chartLine.value.style.transition = 'none'
    }
  })

  // Días originales para tooltip
  const originalDays = computed(() => props.days)

  // Días mostrados (abreviados si es necesario)
  const displayedDays = computed(() => {
    return props.days.map(day => {
      if (day.length > 3) {
        return day.substring(0, 3)
      }
      return day
    })
  })

  // Verificar si hay datos
  const hasData = computed(() => {
    return props.chartData.length > 0
  })

  // Mapear datos por día
  const dataByDay = computed(() => {
    const map = new Map<string, number>()
    props.chartData.forEach(item => {
      map.set(item.day, item.value)
    })
    return map
  })

  // Obtener valor para un día específico
  const getValueForDay = (dayIndex: number): number | null => {
    const dayName = props.days[dayIndex] as string
    return dataByDay.value.get(dayName) || null
  }

  // Verificar si hay datos para un día específico
  const hasDataForDay = (dayIndex: number): boolean => {
    return getValueForDay(dayIndex) !== null
  }

  // Obtener todos los valores válidos (excluyendo días sin datos)
  const validChartValues = computed(() => {
    return props.days
      .map((day, index) => ({
        dayIndex: index,
        value: getValueForDay(index),
      }))
      .filter(item => item.value !== null) as {
      dayIndex: number
      value: number
    }[]
  })

  // Calcular puntos del gráfico (solo para días con datos)
  const dataPoints = computed<DataPoint[]>(() => {
    const validData = validChartValues.value
    if (validData.length === 0) return []

    const values = validData.map(item => item.value)
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    const range = maxValue - minValue || 1

    // Calcular posición X basada en el día de la semana
    const getXPosition = (dayIndex: number) => {
      const totalDays = props.days.length
      const spacing = viewBoxWidth / (totalDays - 1)
      return dayIndex * spacing
    }

    return validData.map(item => {
      const normalizedY = ((item.value - minValue) / range) * 180
      const y = viewBoxHeight - 60 - normalizedY

      return {
        x: getXPosition(item.dayIndex),
        y,
        value: item.value,
        dayIndex: item.dayIndex,
      }
    })
  })

  // Obtener días sin datos
  const emptyDays = computed(() => {
    return props.days
      .map((day, index) => ({ day, index }))
      .filter(item => !hasDataForDay(item.index))
  })

  // Función para obtener posición X de un día
  const getDayXPosition = (dayIndex: number): number => {
    const totalDays = props.days.length
    const spacing = viewBoxWidth / (totalDays - 1)
    return dayIndex * spacing
  }

  // Generar la línea del gráfico
  const chartPath = computed<string>(() => {
    const dp = dataPoints.value
    if (dp.length < 2) return ''

    // Ordenar puntos por día de la semana
    const sortedPoints = [...dp].sort((a, b) => a.dayIndex - b.dayIndex)
    const first = sortedPoints[0] as DataPoint

    let path = `M${first.x},${first.y}`

    for (let i = 1; i < sortedPoints.length; i++) {
      const prev = sortedPoints[i - 1] as DataPoint
      const curr = sortedPoints[i] as DataPoint

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
    const dp = dataPoints.value
    if (dp.length === 0) return ''

    const sortedPoints = [...dp].sort((a, b) => a.dayIndex - b.dayIndex)
    const lastPoint = sortedPoints[sortedPoints.length - 1] as DataPoint
    const firstPoint = sortedPoints[0] as DataPoint

    return ` L${lastPoint.x},${viewBoxHeight - 40} L${firstPoint.x},${viewBoxHeight - 40} Z`
  })

  // Días mostrados con indicación de datos
  const displayedDaysWithData = computed(() => {
    return displayedDays.value
  })

  // Calcular promedio de tiempo dormido (solo días con datos)
  const averageTimeAsleep = computed<number>(() => {
    const validData = validChartValues.value
    if (validData.length === 0) return 0
    const total = validData.reduce((sum, item) => sum + item.value, 0)
    return Math.round(total / validData.length)
  })

  // Verificar si hay datos del periodo anterior
  const hasPreviousPeriodData = computed(() => {
    return props.previousPeriodData.length > 0
  })

  // Calcular cambio porcentual
  const changePercent = computed<number>(() => {
    if (!hasPreviousPeriodData.value || !hasData.value) return 0

    const currentAvg = averageTimeAsleep.value

    // Calcular promedio del periodo anterior
    const previousMap = new Map<string, number>()
    props.previousPeriodData.forEach(item => {
      previousMap.set(item.day, item.value)
    })

    const previousValidData = props.days
      .map((day, index) => ({
        dayIndex: index,
        value: previousMap.get(day) || null,
      }))
      .filter(item => item.value !== null) as {
      dayIndex: number
      value: number
    }[]

    if (previousValidData.length === 0) return 0

    const previousTotal = previousValidData.reduce(
      (sum, item) => sum + item.value,
      0
    )
    const previousAvg = Math.round(previousTotal / previousValidData.length)

    if (previousAvg === 0) return 0

    return ((currentAvg - previousAvg) / previousAvg) * 100
  })

  // Formatear duración
  const formatDuration = (minutes: number): string => {
    if (minutes === 0) return '0m'

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

  /* Estilos para la animación del gráfico */
  .chart-line {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }
</style>
