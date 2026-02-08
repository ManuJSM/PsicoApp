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
          }}{{ props.changePercent.toFixed(0) }}% vs. pasada
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

        <!-- Puntos vacíos para periodos sin datos -->
        <g class="empty-points">
          <circle
            v-for="(period, index) in emptyPeriods"
            :key="'empty-' + index"
            :cx="getPeriodXPosition(index)"
            :cy="viewBoxHeight - 60"
            fill="#6b7280"
            r="0"
            opacity="0.3"
            ref="emptyPointsRef"
          />
        </g>
      </svg>
    </div>

    <!-- Labels -->
    <div class="w-full mt-3 overflow-hidden">
      <div
        class="hidden md:flex justify-between items-center text-[#9dabb9] text-xs font-bold uppercase gap-1"
      >
        <div
          v-for="(period, index) in displayedLabels"
          :key="index"
          class="flex-1 min-w-0"
        >
          <div
            class="text-center truncate"
            :class="{
              'opacity-100': hasDataForPeriod(index),
              'opacity-40': !hasDataForPeriod(index),
            }"
          >
            {{ period }}
            <div
              v-if="!hasDataForPeriod(index)"
              class="text-[10px] text-[#6b7280] font-normal normal-case"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="md:hidden flex justify-between items-center text-[#9dabb9] text-xs font-bold uppercase gap-1"
      >
        <div>{{ displayedLabels[0] }}</div>
        <div>{{ displayedLabels[Math.floor(displayedLabels.length / 3)] }}</div>
        <div>{{ displayedLabels[Math.ceil(displayedLabels.length / 2)] }}</div>
        <div>{{ displayedLabels[displayedLabels.length - 1] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

  interface ChartData {
    day?: string
    month?: string
    year?: string | number
    week?: string | number
    weekNumber?: number
    value: number
    date?: string
  }

  interface DataPoint {
    x: number
    y: number
    value: number
    index: number
  }

  export interface SleepLineChartProps {
    averageTimeAsleep: string
    changePercent?: number
    title?: string
    chartData: ChartData[]
    periodType?: 'day' | 'month' | 'year' | 'week'
    chartColor?: string
    displayCount?: number
  }

  // Props
  const props = withDefaults(defineProps<SleepLineChartProps>(), {
    title: 'Tiempo Dormido',
    changePercent: 0,
    averageTimeAsleep: '2h',
    periodType: 'day',
    chartColor: '#935fe0',
    displayCount: 12,
  })

  // Refs
  const gradientId = ref('')
  const chartLine = ref<SVGPathElement | null>(null)
  const chartArea = ref<SVGPathElement | null>(null)
  const dataPointsRef = ref<SVGCircleElement[]>([])
  const emptyPointsRef = ref<SVGCircleElement[]>([])
  const isAnimating = ref(true)
  const lineLength = ref(1000)

  // Constantes
  const viewBoxWidth: number = 800
  const viewBoxHeight: number = 250
  const ANIMATION_DURATION = 1000 // 1 segundo

  // Labels según tipo de período - MANTENIENDO EL ORIGINAL pero añadiendo 'week'
  const periodLabels = computed(() => {
    if (props.periodType === 'day') {
      return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].slice(
        0,
        props.displayCount
      )
    } else if (props.periodType === 'month') {
      // <-- ESTO SIGUE IGUAL
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
    } else if (props.periodType === 'week') {
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

  // Verificar si hay datos
  const hasData = computed(() => {
    return props.chartData.length > 0
  })

  // Mapear datos por período
  const dataByPeriod = computed(() => {
    const map = new Map<string, number>()
    props.chartData.forEach(item => {
      const key = getPeriodKey(item)
      if (key) {
        map.set(key, item.value)
      }
    })
    return map
  })

  // Obtener clave única para el período - AÑADIDO soporte para 'week'
  const getPeriodKey = (item: ChartData): string | null => {
    if (props.periodType === 'day' && item.day) {
      return item.day.trim()
    }

    if (props.periodType === 'month' && item.month) {
      const month = item.month.trim()
      // Asegurar que es formato abreviado (3 letras)
      if (month.length > 3) {
        return month.substring(0, 3)
      }
      return month
    }

    if (props.periodType === 'week') {
      // <-- AÑADIDO
      // Prioridad: weekNumber, luego week
      if (item.weekNumber !== undefined) {
        return `S${item.weekNumber}`
      }
      if (item.week) {
        if (typeof item.week === 'number') {
          return `S${item.week}`
        }
        return item.week.toString().trim()
      }
    }

    if (props.periodType === 'year' && item.year !== undefined) {
      return item.year.toString().trim()
    }

    if (item.date) {
      const date = new Date(item.date)
      if (props.periodType === 'day') {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
        return days[date.getDay()] as string
      } else if (props.periodType === 'month') {
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
      } else if (props.periodType === 'week') {
        // Calcular número de semana desde la fecha
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        const firstDay = firstDayOfMonth.getDay() // 0=Domingo, 1=Lunes...
        const offsetDate = date.getDate() + firstDay - 1
        const weekNumber = Math.floor(offsetDate / 7) + 1
        return `S${weekNumber}`
      } else {
        return date.getFullYear().toString()
      }
    }

    return null
  }

  // Obtener valor para un período específico
  const getValueForPeriod = (periodIndex: number): number | null => {
    const periodKey = periodLabels.value[periodIndex] as string
    return dataByPeriod.value.get(periodKey) || null
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
  const dataPoints = computed<DataPoint[]>(() => {
    const validData = validChartValues.value
    if (validData.length === 0) return []

    const values = validData.map(item => item.value)
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    const range = maxValue - minValue || 1

    // Calcular posición X basada en el período
    const getXPosition = (periodIndex: number) => {
      const totalPeriods = periodLabels.value.length
      const spacing = viewBoxWidth / Math.max(1, totalPeriods - 1)
      return periodIndex * spacing
    }

    return validData.map(item => {
      const normalizedY = ((item.value - minValue) / range) * 180
      const y = viewBoxHeight - 60 - normalizedY

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

  // Función para obtener posición X de un período
  const getPeriodXPosition = (periodIndex: number): number => {
    const totalPeriods = periodLabels.value.length
    const spacing = viewBoxWidth / Math.max(1, totalPeriods - 1)
    return periodIndex * spacing
  }

  // Generar la línea del gráfico CON CURVAS (manteniendo tu versión original)
  const chartPath = computed<string>(() => {
    const dp = dataPoints.value
    if (dp.length < 2) return ''

    // Ordenar puntos por índice
    const sortedPoints = [...dp].sort((a, b) => a.index - b.index)
    const first = sortedPoints[0] as DataPoint

    let path = `M${first.x},${first.y}`

    // Usar curvas Bézier básicas (TU VERSIÓN ORIGINAL)
    for (let i = 1; i < sortedPoints.length; i++) {
      const prev = sortedPoints[i - 1] as DataPoint
      const curr = sortedPoints[i] as DataPoint

      // Calcular puntos de control para una curva suave
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
    const lastPoint = sortedPoints[sortedPoints.length - 1] as DataPoint
    const firstPoint = sortedPoints[0] as DataPoint

    return ` L${lastPoint.x},${viewBoxHeight - 40} L${firstPoint.x},${viewBoxHeight - 40} Z`
  })

  // Labels a mostrar (abreviados)
  const displayedLabels = computed(() => {
    return periodLabels.value.map(label => {
      // Si son meses largos, abreviar más si es necesario
      if (props.periodType === 'month' && label.length > 3) {
        return label.substring(0, 3)
      }
      return label
    })
  })

  // CALCULAR LONGITUD DEL PATH
  const calculateLineLength = (): number => {
    if (!chartPath.value) return 1000

    try {
      // Crea un path temporal para calcular la longitud
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

  // Inicializar ID único para el gradiente
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
    () => [props.chartData, props.periodType, props.displayCount],
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
      // Asegurar que lineLength está calculado
      lineLength.value = calculateLineLength()

      // Animar la línea (ahora con la longitud correcta)
      if (chartLine.value) {
        chartLine.value.style.transition = `stroke-dashoffset ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
        chartLine.value.style.strokeDashoffset = '0'
      }

      // Animar el área
      if (chartArea.value) {
        chartArea.value.style.transition = `opacity ${ANIMATION_DURATION}ms ease-in-out`
        chartArea.value.style.opacity = '1'
      }

      // Animar puntos de datos
      dataPointsRef.value.forEach(point => {
        point.style.transition = `r ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
        point.setAttribute('r', '3')
      })

      // Animar puntos vacíos
      emptyPointsRef.value.forEach(point => {
        point.style.transition = `r ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
        point.setAttribute('r', '2')
      })

      // Marcar como completado después de la duración de la animación
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

  // Limpiar animaciones al desmontar
  onUnmounted(() => {
    if (chartLine.value) {
      chartLine.value.style.transition = 'none'
    }
  })
</script>

<style scoped>
  /* Asegurar que los períodos no se salgan */
  .period-cell {
    flex: 1 1 0;
    min-width: 0; /* IMPORTANTE: permite que el truncate funcione */
  }

  .period-label {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
