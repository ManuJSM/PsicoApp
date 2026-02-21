<script setup lang="ts">
  import { ref, computed } from 'vue'

  const model = defineModel<boolean>({ required: true })

  // Añadimos v-model para la fecha seleccionada
  const selectedDate = defineModel<string>('selectedDate', { default: '' })

  const props = defineProps<{
    registros?: Array<{ fecha: string; notification: boolean }>
  }>()

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentDay = currentDate.getDate()

  const selectedYear = ref<number>(currentYear)

  // Mapa de registros
  const registrosMap = computed(() => {
    const map = new Map()
    if (!props.registros?.length) return map
    props.registros.forEach(r => {
      const d = new Date(r.fecha)
      map.set(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`, {
        hasRegistro: true,
        notification: r.notification,
      })
    })
    return map
  })

  // Años disponibles
  const availableYears = computed(() => {
    if (!props.registros?.length) return [currentYear]
    const years = new Set(
      props.registros.map(r => new Date(r.fecha).getFullYear())
    )
    years.add(currentYear)
    return Array.from(years).sort((a, b) => b - a)
  })

  // Verificar día
  const getDiaInfo = (year: number, month: number, day: number) => {
    const info = registrosMap.value.get(`${year}-${month}-${day}`)
    return {
      hasRegistro: info?.hasRegistro || false,
      notification: info?.notification || false,
    }
  }

  // Offset primer día
  const getStartOffset = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1
  }

  // Generar meses
  const monthsToShow = computed(() => {
    const months = []
    const maxMonth = selectedYear.value === currentYear ? currentMonth : 11

    for (let month = 0; month <= maxMonth; month++) {
      const daysInMonth = new Date(selectedYear.value, month + 1, 0).getDate()
      const maxDay =
        selectedYear.value === currentYear && month === currentMonth
          ? currentDay
          : daysInMonth

      const days = []
      for (let day = 1; day <= maxDay; day++) {
        const info = getDiaInfo(selectedYear.value, month, day)
        days.push({
          day,
          hasRegistro: info.hasRegistro,
          notification: info.notification,
          isToday:
            selectedYear.value === currentYear &&
            month === currentMonth &&
            day === currentDay,
          fecha: `${selectedYear.value}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        })
      }

      months.push({
        index: month,
        name: new Date(selectedYear.value, month, 1).toLocaleString('es', {
          month: 'long',
        }),
        startOffset: getStartOffset(selectedYear.value, month),
        days,
      })
    }
    return months
  })

  const changeYear = (increment: number) => {
    const idx = availableYears.value.indexOf(selectedYear.value)
    const newIdx = idx + increment
    if (newIdx >= 0 && newIdx < availableYears.value.length) {
      selectedYear.value = availableYears.value[newIdx] as number
    }
  }

  const selectDate = (fecha: string) => {
    selectedDate.value = fecha
    model.value = false // Cierra el drawer
  }
</script>

<template>
  <aside
    class="fixed top-0 right-0 h-screen w-full md:w-[400px] bg-card-dark border-l border-border-dark shadow-2xl z-50 transition-transform duration-500 flex flex-col"
    :class="model ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Header -->
    <div class="p-6 border-b border-border-dark">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-white">Calendario</h2>
        <button class="text-white/60 hover:text-white" @click="model = false">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Selector año -->
      <div class="flex items-center justify-between">
        <button
          class="text-white hover:text-primary cursor-pointer disabled:opacity-30 text-xl"
          @click="changeYear(1)"
          :disabled="
            availableYears.indexOf(selectedYear) === availableYears.length - 1
          "
        >
          <span class="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <span class="text-white font-bold text-lg">{{ selectedYear }}</span>
        <button
          class="text-white hover:text-primary cursor-pointer disabled:opacity-30 text-xl"
          @click="changeYear(-1)"
          :disabled="availableYears.indexOf(selectedYear) === 0"
        >
          <span class="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>

    <!-- Meses -->
    <div class="flex-1 overflow-y-auto p-6">
      <div v-for="month in monthsToShow" :key="month.index" class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-white font-bold capitalize">{{ month.name }}</h3>
          <span class="text-xs text-gray-500"
            >{{ String(month.index + 1).padStart(2, '0') }}/{{
              selectedYear
            }}</span
          >
        </div>

        <!-- Días semana -->
        <div
          class="grid grid-cols-7 gap-1 mb-2 text-xs text-center text-gray-500"
        >
          <div v-for="d in ['L', 'M', 'X', 'J', 'V', 'S', 'D']" :key="d">
            {{ d }}
          </div>
        </div>

        <!-- Días -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Días vacíos -->
          <div v-for="n in month.startOffset" :key="n" class="h-10"></div>

          <!-- Días del mes -->
          <div
            v-for="day in month.days"
            :key="day.day"
            class="h-10 flex items-center justify-center relative cursor-pointer rounded transition-all"
            :class="{
              'border border-primary/80': day.hasRegistro && !day.isToday,
              'border border-dashed border-gray-700':
                !day.hasRegistro && !day.isToday,
              'bg-primary border-primary': day.isToday,
              'hover:bg-white/10': !day.isToday,
              'bg-[#00D2FF]': day.fecha === selectedDate,
            }"
            @click="selectDate(day.fecha)"
          >
            <span
              :class="{
                'text-white': day.isToday,
                'text-primary': !day.isToday && day.hasRegistro,
                'text-gray-500': !day.isToday && !day.hasRegistro,
              }"
            >
              {{ day.day }}
            </span>

            <!-- Punto notificación -->
            <span
              v-if="day.notification"
              class="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"
            >
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-border-dark">
      <button
        class="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 py-3 rounded-lg font-medium"
        @click="selectedYear = currentYear"
      >
        Hoy
      </button>
    </div>
  </aside>
</template>
