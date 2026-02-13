<template>
  <div>
    <!-- Overlay -->
    <label
      v-show="isOpen"
      :class="[
        'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300',
      ]"
      @click="closeDrawer"
    ></label>

    <!-- Drawer -->
    <div
      :class="[
        'fixed top-0 left-0 h-full w-full md:w-1/4 bg-background-dark/95 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col',
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
            Seleccionar Fecha
          </h2>
          <p
            class="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1"
          >
            {{ viewType }}
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

      <!-- Calendar Content -->
      <div
        class="flex-1 overflow-y-auto custom-scrollbar"
        ref="scrollContainer"
      >
        <!-- Todos los años -->
        <div v-for="year in availableYears" :key="year" class="p-6">
          <!-- Header del año -->
          <div
            class="flex items-center justify-between border-b border-slate-400 pb-2 mb-4"
            :id="`year-${year}`"
          >
            <h3 class="text-white font-bold text-lg">{{ year }}</h3>
            <span
              class="text-xs text-slate-500 font-bold uppercase tracking-widest"
            >
              {{ getMonthsCount(year) }} meses
            </span>
          </div>

          <!-- Todos los meses del año (en orden descendente: diciembre a enero) -->
          <div
            v-for="month in getMonthsForYear(year)"
            :key="`${year}-${month.index}`"
            class="mb-8"
          >
            <!-- Header del mes -->
            <div
              class="flex items-center justify-between border-b border-slate-400/50 pb-2 mb-3"
            >
              <h4 class="text-white font-bold text-sm">
                {{ getMonthName(month.index) }}
              </h4>
              <span
                class="text-xs text-slate-500 font-bold uppercase tracking-widest"
              >
                {{ month.daysCount }} días
              </span>
            </div>

            <!-- Días de la semana -->
            <div
              class="mini-calendar-grid text-[9px] text-slate-600 font-extrabold uppercase text-center mb-1"
            >
              <span>L</span><span>M</span><span>X</span><span>J</span
              ><span>V</span><span>S</span><span>D</span>
            </div>

            <!-- CALENDARIO DEL MES -->
            <div class="space-y-1">
              <div
                v-for="(week, weekIndex) in month.weeks"
                :key="weekIndex"
                class="mini-calendar-grid"
              >
                <div
                  v-for="day in week"
                  :key="`${day.year}-${day.month}-${day.date}`"
                  :class="[
                    'flex text-slate-200 items-center justify-center min-h-8 transition-all relative',

                    isToday(day)
                      ? 'bg-blue-500/20 border border-blue-500 text-white font-bold'
                      : isDaySelected(day)
                        ? 'bg-primary/20 border border-primary/70 text-white font-bold'
                        : hasRegistro(day)
                          ? 'cursor-pointer hover:bg-white/10'
                          : isDayClickable(day)
                            ? 'cursor-pointer hover:bg-white/5 opacity-60'
                            : 'opacity-30',
                    hasRegistro(day) && !isToday(day) && !isDaySelected(day)
                      ? 'rounded-full bg-state-asleep'
                      : 'rounded-lg',
                  ]"
                  @click="isDayClickable(day) ? handleDayClick(day) : null"
                >
                  <span class="font-medium z-10 relative">
                    {{ day.date }}
                  </span>

                  <!-- NOTIFICACIÓN ROJA -->
                  <div
                    v-if="hasNotification(day)"
                    class="absolute top-0 right-0"
                  >
                    <div
                      class="size-2 rounded-full bg-red-500 animate-pulse"
                    ></div>
                  </div>

                  <!-- INDICADOR DE HOY -->
                  <div v-if="isToday(day)" class="absolute -top-1 -right-1">
                    <div class="size-3 rounded-full bg-blue-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-github-border bg-github-dark/50">
        <button
          class="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3.5 rounded-xl border border-github-border transition-all flex items-center justify-center gap-2"
          @click="selectToday"
          type="button"
        >
          <span class="material-symbols-outlined text-sm!">history</span>
          Seleccionar Hoy
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { fetchCalendar } from '@/api/SleepData/sleepReg.api'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  interface Day {
    year: number
    month: number
    date: number
    dateObj: Date
  }

  interface MonthData {
    index: number
    days: Set<number>
    weeks: Day[][]
    daysCount: number
  }

  interface Registro {
    fecha: string
    notification: boolean
  }

  const props = defineProps<{
    isOpen: boolean
    viewType?: string
    selectedDate?: Date
  }>()

  const emit = defineEmits<{
    close: []
    'date-selected': [date: Date]
  }>()

  const currentYear = ref(new Date().getFullYear())
  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDate = today.getDate()

  // Usar los datos reales del mock
  const registros = ref<Registro[]>([])

  // Años disponibles en los datos
  const availableYears = computed(() => {
    const yearsSet = new Set<number>()

    // Añadir años de los registros
    registros.value.forEach(reg => {
      const year = parseInt(reg.fecha.split('-')[0] as string)
      yearsSet.add(year)
    })

    // Asegurarnos que el año actual esté incluido
    yearsSet.add(todayYear)

    // Si hay una fecha seleccionada, asegurarnos que su año está incluido
    if (props.selectedDate) {
      const selectedYear = props.selectedDate.getFullYear()
      yearsSet.add(selectedYear)
    }

    // Ordenar de más reciente a más antiguo
    return Array.from(yearsSet).sort((a, b) => b - a)
  })

  // Obtener meses de un año que tienen registros
  const getMonthsForYear = (year: number): MonthData[] => {
    const monthsMap = new Map<number, Omit<MonthData, 'daysCount'>>()

    // Obtener todos los registros del año
    const yearRegistros = registros.value.filter(reg => {
      const regYear = parseInt(reg.fecha.split('-')[0] as string)
      return regYear === year
    })

    // Agrupar por mes
    yearRegistros.forEach(reg => {
      const [, regMonth, regDate] = reg.fecha.split('-').map(Number)
      const monthIndex = (regMonth as number) - 1

      if (!monthsMap.has(monthIndex)) {
        monthsMap.set(monthIndex, {
          index: monthIndex,
          days: new Set<number>(),
          weeks: [],
        })
      }

      const monthData = monthsMap.get(monthIndex)!
      monthData.days.add(regDate as number)
    })

    // SI ES EL AÑO ACTUAL, AÑADIR EL MES ACTUAL AUNQUE NO TENGA REGISTROS
    if (year === todayYear) {
      if (!monthsMap.has(todayMonth)) {
        monthsMap.set(todayMonth, {
          index: todayMonth,
          days: new Set<number>(),
          weeks: [],
        })
      }
    }

    // Convertir a array y ordenar de más reciente a más antiguo
    const monthsArray = Array.from(monthsMap.values())
      .sort((a, b) => b.index - a.index)
      .map(
        month =>
          ({
            ...month,
            daysCount: month.days.size,
            weeks: generateWeeksForMonth(
              year,
              month.index,
              year === todayYear && month.index === todayMonth
                ? todayDate
                : new Date(year, month.index + 1, 0).getDate()
            ),
          }) as MonthData
      )

    return monthsArray
  }

  // Contar meses con registros en un año
  const getMonthsCount = (year: number): number => {
    const monthsSet = new Set<number>()
    registros.value.forEach(reg => {
      const [regYear, regMonth] = reg.fecha.split('-').map(Number)
      if (regYear === year) {
        monthsSet.add(regMonth as number)
      }
    })

    // Si es el año actual, contar el mes actual aunque no tenga registros
    if (year === todayYear) {
      monthsSet.add(todayMonth + 1)
    }

    return monthsSet.size
  }

  // Generar semanas de un mes
  const generateWeeksForMonth = (
    year: number,
    month: number,
    lastDay: number
  ): Day[][] => {
    const weeks: Day[][] = []

    // Primer día del mes
    const firstDay = new Date(year, month, 1)

    // Último día a mostrar
    const effectiveLastDay = Math.min(
      lastDay,
      new Date(year, month + 1, 0).getDate()
    )

    // Ir al primer lunes antes del primer día del mes
    const currentDate = new Date(firstDay)
    while (currentDate.getDay() !== 1) {
      currentDate.setDate(currentDate.getDate() - 1)
    }

    const lastDate = new Date(year, month, effectiveLastDay)

    // Generar semanas
    while (currentDate <= lastDate) {
      const week: Day[] = []

      for (let i = 0; i < 7; i++) {
        const dateObj = new Date(currentDate)
        week.push({
          year: dateObj.getFullYear(),
          month: dateObj.getMonth(),
          date: dateObj.getDate(),
          dateObj: dateObj,
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Solo añadir semanas que tengan días del mes actual
      const hasDaysInMonth = week.some(
        day => day.year === year && day.month === month
      )
      if (hasDaysInMonth) {
        weeks.push(week)
      }
    }

    return weeks
  }

  // Verificar si un día tiene registro
  const hasRegistro = (day: Day): boolean => {
    return registros.value.some(reg => {
      const regDate = new Date(reg.fecha)

      return (
        regDate.getFullYear() === day.year &&
        regDate.getMonth() === day.month &&
        regDate.getDate() === day.date
      )
    })
  }

  // Verificar si es hoy
  const isToday = (day: Day): boolean => {
    return (
      day.year === todayYear &&
      day.month === todayMonth &&
      day.date === todayDate
    )
  }

  // Verificar si un día es clicable
  const isDayClickable = (day: Day): boolean => {
    return hasRegistro(day) || isToday(day)
  }

  // Verificar si tiene notificación
  const hasNotification = (day: Day): boolean => {
    const dateStr = `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`
    const registro = registros.value.find(reg => reg.fecha === dateStr)
    return registro?.notification || false
  }

  // Métodos auxiliares
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

  const isDaySelected = (day: Day): boolean => {
    if (!props.selectedDate) return false
    const selected = new Date(props.selectedDate)
    return (
      day.year === selected.getFullYear() &&
      day.month === selected.getMonth() &&
      day.date === selected.getDate()
    )
  }

  const handleDayClick = (day: Day) => {
    emit('date-selected', new Date(day.dateObj))
    closeDrawer()
  }

  const selectToday = () => {
    emit('date-selected', new Date())
    closeDrawer()
  }

  const closeDrawer = () => {
    currentYear.value = todayYear
    emit('close')
  }
  watch(
    () => Number(route.params.id),
    async id => {
      selectToday()
      if (!Number.isInteger(id)) return
      registros.value = await fetchCalendar({ userId: id })
    },
    { immediate: true }
  )

  // Inicializar
  onMounted(() => {
    if (props.selectedDate) {
      currentYear.value = props.selectedDate.getFullYear()
    }
  })
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

  /* Animación de notificación */
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 1s infinite;
  }
</style>
