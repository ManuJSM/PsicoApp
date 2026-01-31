<template>
  <div>
    <!-- Overlay -->
    <label
      :class="[
        'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300',
        isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none',
      ]"
      @click="closeDrawer"
    ></label>

    <!-- Drawer -->
    <div
      :class="[
        'fixed top-0 left-0 h-full w-full md:w-1/4 bg-background-dark/95 backdrop-blur-xl border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-50 transform transition-transform duration-300 ease-in-out flex flex-col',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
      id="date-side-drawer"
    >
      <!-- Header -->
      <div
        class="p-6 border-b border-slate-400 flex items-center justify-between sticky top-0 bg-background-dark/90 backdrop-blur-md z-10"
      >
        <div class="flex flex-col">
          <h2 class="text-white font-extrabold text-xl tracking-tight">
            Seleccionar Periodo
          </h2>
          <p
            class="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1"
          >
            {{ getViewTypeLabel() }}
          </p>
        </div>
        <button
          class="cursor-pointer size-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          @click="closeDrawer"
          type="button"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Year Selector -->
      <div
        class="px-6 py-4 bg-github-dark/50 flex items-center gap-2 overflow-x-auto"
      >
        <button
          v-for="year in loadedYears"
          :key="year"
          :class="[
            'px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
            selectedYear === year
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'text-slate-500 border border-github-border hover:border-slate-500 hover:text-white',
          ]"
          @click="scrollToYear(year)"
          type="button"
        >
          {{ year }}
        </button>
      </div>

      <!-- Calendar Content -->
      <div
        class="flex-1 overflow-y-auto custom-scrollbar"
        ref="scrollContainerRef"
        @scroll="handleScroll"
      >
        <!-- Spinner de carga inicial -->
        <div
          v-if="loadingInitial"
          class="flex items-center justify-center h-full"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
          ></div>
        </div>

        <div v-else class="flex flex-col">
          <div
            v-for="month in loadedMonths"
            :key="`${month.year}-${month.month}`"
            class="p-6 space-y-4"
            :ref="el => addMonthRef(el as HTMLElement, month)"
          >
            <!-- Header del mes -->
            <div
              class="flex items-center justify-between border-b border-slate-400 pb-2"
            >
              <div class="flex items-center gap-3">
                <h3 class="text-white font-bold text-base">
                  {{ getMonthName(month.month) }}
                </h3>
                <!-- Indicador de mes actual -->
                <span
                  v-if="isCurrentMonth(month)"
                  class="text-sm border border-primary/50 shadow-[inset_0_0_15px_rgba(19,127,236,0.1)] px-2 bg-primary/10 rounded-lg text-primary font-bold"
                  >ACTUAL</span
                >
              </div>
              <span
                class="text-xs text-slate-500 font-bold uppercase tracking-widest"
              >
                {{ month.year }}
              </span>
            </div>

            <!-- Days of week header -->
            <div
              class="mini-calendar-grid text-[9px] text-slate-600 font-extrabold uppercase text-center mb-1"
            >
              <span>L</span><span>M</span><span>X</span><span>J</span
              ><span>V</span><span>S</span><span>D</span>
            </div>

            <!-- Calendar weeks - ESTILOS SEPARADOS POR VISTA -->
            <div
              :class="[
                'space-y-1',
                // VISTA MENSUAL: Todo el contenedor del mes con fondo cuando está seleccionado
                viewType === DashboardViews.MENSUAL && isMonthSelected(month)
                  ? 'bg-primary/10 border border-primary/50 rounded-lg p-2'
                  : '',
                // VISTA MENSUAL: Hover en TODO el contenedor del mes cuando NO está seleccionado
                viewType === DashboardViews.MENSUAL && !isMonthSelected(month)
                  ? 'cursor-pointer hover:bg-white/5 rounded-lg p-2'
                  : '',
              ]"
              @click="
                viewType === DashboardViews.MENSUAL
                  ? handleWeekOrMonthClick(month.weeks[0] as Week)
                  : null
              "
            >
              <div
                v-for="(week, weekIndex) in month.weeks"
                :key="weekIndex"
                :class="[
                  'mini-calendar-grid',
                  // VISTA DIARIA: Solo días individuales
                  viewType === DashboardViews.DIARIA ? 'p-1' : '',
                  // VISTA SEMANAL: Click en semanas completas
                  viewType === DashboardViews.SEMANAL
                    ? 'p-2 cursor-pointer hover:bg-white/5 rounded-lg'
                    : '',
                  // VISTA MENSUAL: NO hover en semanas individuales - todo el mes es un solo elemento clickable
                  viewType === DashboardViews.MENSUAL ? 'p-1' : '',
                  // Semana seleccionada en vista semanal
                  viewType === DashboardViews.SEMANAL && isWeekSelected(week)
                    ? 'bg-primary/10 border border-primary/50 shadow-[inset_0_0_15px_rgba(19,127,236,0.1)]'
                    : '',
                ]"
                @click="
                  viewType === DashboardViews.SEMANAL
                    ? handleWeekOrMonthClick(week)
                    : null
                "
              >
                <!-- Días de la semana -->
                <div
                  v-for="day in week"
                  :key="`${day.year}-${day.month}-${day.day}`"
                  :class="[
                    'flex items-center justify-center min-h-8 transition-all relative',
                    day.month !== month.month
                      ? 'text-slate-500 opacity-60'
                      : 'text-slate-200',
                    // VISTA DIARIA
                    viewType === DashboardViews.DIARIA && isDaySelected(day)
                      ? 'bg-primary/10 border border-primary/50 shadow-[inset_0_0_15px_rgba(19,127,236,0.1)] text-primary font-bold rounded-lg'
                      : viewType === DashboardViews.DIARIA
                        ? 'cursor-pointer hover:bg-white/10 rounded-lg'
                        : '',
                    // VISTA SEMANAL
                    viewType === DashboardViews.SEMANAL &&
                    isDayInSelectedWeek(day)
                      ? 'text-primary font-bold'
                      : '',
                    // VISTA MENSUAL - texto azul para todos los días del mes seleccionado
                    viewType === DashboardViews.MENSUAL &&
                    isDayInSelectedMonth(day)
                      ? 'text-primary'
                      : '',
                    // Día actual (todas las vistas)
                    isToday(day) ? 'text-white bg-primary/30 rounded-full' : '',
                  ]"
                  @click.stop="handleDayClick(day)"
                >
                  <span class="font-medium z-10 relative">
                    {{ day.day }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Spinner al final cuando está cargando más -->
          <div v-if="loadingMore" class="p-6 flex justify-center">
            <div
              class="animate-spin rounded-full h-6 w-6 border-t-2 border-primary"
            ></div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-github-border bg-github-dark/50">
        <button
          class="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3.5 rounded-xl border border-github-border transition-all flex items-center justify-center gap-2"
          @click="selectCurrentPeriod"
          type="button"
        >
          <span class="material-symbols-outlined text-sm!">history</span>
          {{ getCurrentPeriodButtonText() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue'
  import { DashboardViews } from '@/types/dashboardP.types'

  // Interfaces
  interface DayInfo {
    year: number
    month: number
    day: number
    date: Date
  }

  type Week = DayInfo[]
  type ViewType = DashboardViews

  interface MonthData {
    year: number
    month: number
    weeks: Week[]
  }

  // Props
  interface Props {
    isOpen: boolean
    viewType?: ViewType
    minDate?: Date
    selectedDate?: Date
  }

  // Fecha de hoy
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
    viewType: DashboardViews.DIARIA,
    minDate: () => {
      const date = new Date()
      date.setFullYear(date.getFullYear() - 1)
      date.setHours(0, 0, 0, 0)
      return date
    },
    selectedDate: () => new Date(),
  })

  // Emits
  const emit = defineEmits<{
    close: []
    'date-selected': [date: Date]
  }>()

  // Refs
  const scrollContainerRef = ref<HTMLElement | null>(null)
  const monthRefs = ref<Map<string, HTMLElement>>(new Map())
  const selectedYear = ref<number>(today.getFullYear())
  const loadingInitial = ref(false)
  const loadingMore = ref(false)

  // Datos cargados
  const loadedMonths = ref<MonthData[]>([])
  const loadedYears = ref<number[]>([])
  const allYears = ref<number[]>([])

  // Métodos principales
  const closeDrawer = () => {
    // Limpiar todo al cerrar
    loadedMonths.value = []
    loadedYears.value = []
    monthRefs.value.clear()
    emit('close')
  }

  // Métodos de referencia y scroll
  const addMonthRef = (el: HTMLElement | null, month: MonthData) => {
    if (el) {
      monthRefs.value.set(`${month.year}-${month.month}`, el)
    }
  }

  const scrollToYear = async (year: number) => {
    selectedYear.value = year

    // Si el año ya está cargado, scrolleamos
    if (loadedYears.value.includes(year)) {
      const monthIndex = loadedMonths.value.findIndex(m => m.year === year)
      if (monthIndex !== -1) {
        const month = loadedMonths.value[monthIndex] as MonthData
        const element = monthRefs.value.get(`${month.year}-${month.month}`)
        if (element && scrollContainerRef.value) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
      return
    }

    // Si no está cargado, lo cargamos
    loadingMore.value = true
    await loadYearMonths(year)
    loadingMore.value = false

    // Scroll al año
    nextTick(() => {
      const monthIndex = loadedMonths.value.findIndex(m => m.year === year)
      if (monthIndex !== -1) {
        const month = loadedMonths.value[monthIndex] as MonthData
        const element = monthRefs.value.get(`${month.year}-${month.month}`)
        if (element && scrollContainerRef.value) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    })
  }

  const handleScroll = async () => {
    if (!scrollContainerRef.value || loadingMore.value || loadingInitial.value)
      return

    const container = scrollContainerRef.value
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight

    // Detectar año actualmente visible
    let mostVisibleMonth: MonthData | null = null
    let maxVisibility = 0

    for (const month of loadedMonths.value) {
      const element = monthRefs.value.get(`${month.year}-${month.month}`)
      if (element) {
        const rect = element.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        const elementTop = rect.top - containerRect.top + scrollTop
        const elementBottom = elementTop + rect.height

        const visibleTop = Math.max(scrollTop, elementTop)
        const visibleBottom = Math.min(scrollTop + clientHeight, elementBottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        const visibility = visibleHeight / rect.height

        if (visibility > maxVisibility) {
          maxVisibility = visibility
          mostVisibleMonth = month
        }
      }
    }

    if (mostVisibleMonth && mostVisibleMonth.year !== selectedYear.value) {
      selectedYear.value = mostVisibleMonth.year
    }

    // VERIFICACIÓN MEJORADA: Cargar más meses cuando estamos cerca del final
    const scrollBottom = scrollTop + clientHeight
    const distanceFromBottom = scrollHeight - scrollBottom

    // Si estamos en el último 20% del contenido, cargar más
    if (distanceFromBottom < clientHeight * 0.2) {
      await loadMoreMonths()
    }
  }

  // Cargar todos los años disponibles (solo para el selector)
  async function loadAllYears() {
    const maxYear = today.getFullYear()
    const minYear = props.minDate.getFullYear()
    const years: number[] = []

    // Orden descendente
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year)
    }

    allYears.value = years
  }

  // Cargar meses de un año específico
  async function loadYearMonths(year: number) {
    // Si ya está cargado, salir
    if (loadedYears.value.includes(year)) return

    const months: MonthData[] = []
    const startMonth =
      year === props.minDate.getFullYear() ? props.minDate.getMonth() : 0
    const endMonth = year === today.getFullYear() ? today.getMonth() : 11

    // Orden descendente dentro del año
    for (let month = endMonth; month >= startMonth; month--) {
      const monthData = await generateMonthData(year, month)
      if (monthData) {
        months.push(monthData)
      }
    }

    // Insertar en la posición correcta (orden descendente)
    const insertIndex = loadedMonths.value.findIndex(m => m.year < year)

    if (insertIndex === -1) {
      // Añadir al final
      loadedMonths.value.push(...months)
    } else {
      // Insertar antes del primer año menor
      loadedMonths.value.splice(insertIndex, 0, ...months)
    }

    // Añadir año a la lista de años cargados
    if (!loadedYears.value.includes(year)) {
      loadedYears.value.push(year)
      loadedYears.value.sort((a, b) => b - a) // Orden descendente
    }
  }

  // Cargar más meses (años anteriores) - VERSIÓN MEJORADA
  async function loadMoreMonths() {
    if (loadingMore.value) return

    // Encontrar el año más antiguo cargado
    if (loadedYears.value.length === 0) return

    const oldestLoadedYear = Math.min(...loadedYears.value)
    const minYear = props.minDate.getFullYear()

    // Si aún quedan años por cargar
    if (oldestLoadedYear > minYear) {
      loadingMore.value = true

      // Cargar el año anterior
      await loadYearMonths(oldestLoadedYear - 1)

      // Si todavía tenemos poco contenido, cargar otro año más
      if (scrollContainerRef.value) {
        const container = scrollContainerRef.value
        const scrollHeight = container.scrollHeight
        const clientHeight = container.clientHeight

        // Si el contenido es menos de 2 veces la altura del viewport, cargar otro año
        if (scrollHeight < clientHeight * 2) {
          const newOldestYear = Math.min(...loadedYears.value)
          if (newOldestYear > minYear) {
            await loadYearMonths(newOldestYear - 1)
          }
        }
      }

      loadingMore.value = false
    }
  }

  // Métodos de utilidad
  const getMonthName = (monthIndex: number): string => {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ]
    return months[monthIndex] as string
  }

  const getWeekFromDate = (date: Date): Week => {
    const week: DayInfo[] = []
    const dayOfWeek = date.getDay()

    const monday = new Date(date)
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    monday.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday)
      currentDate.setDate(monday.getDate() + i)

      week.push({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        day: currentDate.getDate(),
        date: currentDate,
      })
    }

    return week
  }

  const getWeekMiddleDay = (week: Week): DayInfo => {
    return week[2] || week[0] || (week[week.length - 1] as DayInfo)
  }

  const generateMonthData = async (
    year: number,
    month: number
  ): Promise<MonthData | null> => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const monthEnd = lastDay > today ? new Date(today) : lastDay

    const isInRange = firstDay <= today && monthEnd >= props.minDate

    if (!isInRange) return null

    const weeks = await generateCalendarWeeks(year, month)
    return {
      year,
      month,
      weeks,
    }
  }

  const generateCalendarWeeks = async (
    year: number,
    month: number
  ): Promise<Week[]> => {
    const weeks: Week[] = []
    const firstDay = new Date(year, month, 1)
    let lastDay = new Date(year, month + 1, 0)

    if (lastDay > today) {
      lastDay = new Date(today)
    }

    const adjustedFirstDay =
      firstDay < props.minDate ? new Date(props.minDate) : firstDay

    if (adjustedFirstDay > lastDay) return weeks

    let currentDate = new Date(adjustedFirstDay)
    while (currentDate.getDay() !== 1 && currentDate <= lastDay) {
      currentDate.setDate(currentDate.getDate() + 1)
    }

    if (currentDate > lastDay) {
      currentDate = new Date(adjustedFirstDay)
    }

    while (currentDate.getDay() !== 1 && currentDate >= adjustedFirstDay) {
      currentDate.setDate(currentDate.getDate() - 1)
    }

    while (currentDate <= lastDay) {
      const weekDays: DayInfo[] = []

      for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate)

        weekDays.push({
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate(),
          date: date,
        })

        currentDate.setDate(currentDate.getDate() + 1)
      }

      const hasCurrentMonthInRange = weekDays.some(
        day =>
          day.year === year &&
          day.month === month &&
          day.date >= adjustedFirstDay &&
          day.date <= lastDay
      )

      if (hasCurrentMonthInRange) {
        weeks.push(weekDays)
      }
    }

    return weeks
  }

  // Métodos de selección y verificación
  const isDaySelected = (day: DayInfo): boolean => {
    if (!props.selectedDate) return false

    const date = new Date(day.year, day.month, day.day)
    date.setHours(0, 0, 0, 0)

    const selectedDate = new Date(props.selectedDate)
    selectedDate.setHours(0, 0, 0, 0)

    return date.getTime() === selectedDate.getTime()
  }

  const isDayInSelectedWeek = (day: DayInfo): boolean => {
    if (!props.selectedDate) return false

    const selectedWeek = getWeekFromDate(new Date(props.selectedDate))
    return selectedWeek.some(
      d => d.year === day.year && d.month === day.month && d.day === day.day
    )
  }

  const isDayInSelectedMonth = (day: DayInfo): boolean => {
    if (!props.selectedDate) return false

    const selectedDate = new Date(props.selectedDate)
    return (
      day.year === selectedDate.getFullYear() &&
      day.month === selectedDate.getMonth()
    )
  }

  const isWeekSelected = (week: Week): boolean => {
    if (!props.selectedDate) return false

    const selectedDate = new Date(props.selectedDate)
    selectedDate.setHours(0, 0, 0, 0)

    const selectedWeek = getWeekFromDate(selectedDate)
    const selectedWeekStart = selectedWeek[0]?.date
    if (!selectedWeekStart) return false

    const weekStart = week[0]?.date
    if (!weekStart) return false

    const selectedStart = new Date(selectedWeekStart)
    selectedStart.setHours(0, 0, 0, 0)

    const thisStart = new Date(weekStart)
    thisStart.setHours(0, 0, 0, 0)

    return selectedStart.getTime() === thisStart.getTime()
  }

  const isMonthSelected = (month: MonthData): boolean => {
    if (!props.selectedDate) return false

    const selectedDate = new Date(props.selectedDate)
    selectedDate.setHours(0, 0, 0, 0)

    return (
      selectedDate.getMonth() === month.month &&
      selectedDate.getFullYear() === month.year
    )
  }

  const isCurrentMonth = (month: MonthData): boolean => {
    return (
      month.year === today.getFullYear() && month.month === today.getMonth()
    )
  }

  const isToday = (day: DayInfo): boolean => {
    return (
      day.year === today.getFullYear() &&
      day.month === today.getMonth() &&
      day.day === today.getDate()
    )
  }

  // Handlers de click
  const handleDayClick = (day: DayInfo): void => {
    emit('date-selected', new Date(day.date))
    closeDrawer()
  }

  const handleWeekOrMonthClick = (week: Week): void => {
    const day = getWeekMiddleDay(week)
    emit('date-selected', new Date(day.date))
    closeDrawer()
  }

  const selectCurrentPeriod = (): void => {
    const todayDate = new Date(today)
    todayDate.setHours(0, 0, 0, 0)
    emit('date-selected', todayDate)
    closeDrawer()
  }

  const getViewTypeLabel = (): string => {
    return props.viewType || DashboardViews.DIARIA
  }

  const getCurrentPeriodButtonText = (): string => {
    switch (props.viewType) {
      case DashboardViews.DIARIA:
        return 'Seleccionar Hoy'
      case DashboardViews.SEMANAL:
        return 'Seleccionar Esta Semana'
      case DashboardViews.MENSUAL:
        return 'Seleccionar Este Mes'
      default:
        return 'Seleccionar Periodo Actual'
    }
  }

  const scrollToSelectedMonth = () => {
    const targetDate = new Date(props.selectedDate)
    const targetYear = targetDate.getFullYear()
    const targetMonth = targetDate.getMonth()

    const element = monthRefs.value.get(`${targetYear}-${targetMonth}`)

    if (element && scrollContainerRef.value) {
      nextTick(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  // Inicialización - Carga el año del selectedDate y uno más para tener contenido
  const initialize = async () => {
    loadingInitial.value = true

    // Limpiar todo
    loadedMonths.value = []
    loadedYears.value = []
    monthRefs.value.clear()

    // Cargar lista de años para el selector
    await loadAllYears()

    // Cargar el año del selectedDate
    selectedYear.value = props.selectedDate.getFullYear()
    await loadYearMonths(selectedYear.value)

    // Cargar también el año anterior para tener más contenido inicial
    const minYear = props.minDate.getFullYear()
    if (selectedYear.value > minYear) {
      await loadYearMonths(selectedYear.value - 1)
    }

    loadingInitial.value = false

    // Scroll al mes seleccionado
    nextTick(() => {
      scrollToSelectedMonth()
    })
  }

  // Watchers
  watch(
    () => props.isOpen,
    async newVal => {
      if (newVal) {
        await initialize()
      } else {
        // Limpiar al cerrar
        loadedMonths.value = []
        loadedYears.value = []
        monthRefs.value.clear()
      }
    }
  )

  watch(
    () => props.selectedDate,
    () => {
      if (props.isOpen) {
        scrollToSelectedMonth()
      }
    }
  )
</script>

<style scoped>
  .mini-calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
</style>
