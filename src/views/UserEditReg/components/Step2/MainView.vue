<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-2 xl:gap-6">
    <!-- Panel izquierdo: Añadir intervalo -->
    <div class="lg:col-span-4">
      <IntervalAdder
        v-model="newInterval"
        :is-range-complete="isRangeComplete"
        :remaining-time="remainingTime"
        :total-time-in-bed-minutes="totalTimeInBedMinutes"
        :can-add="canAddInterval"
        @add="addInterval"
        @update:hours="value => (newInterval.hours = value)"
        @update:minutes="value => (newInterval.minutes = value)"
      />

      <!-- <section class="mt-2" v-show="!isRangeComplete">
        <div
          class="bg-primary/5 border border-primary/20 rounded-lg py-3 px-4 flex items-center justify-center gap-3"
        >
          <span class="text-lg font-bold text-primary">{{
            formatTime(previewInterval.startTime)
          }}</span>
          <span class="material-symbols-outlined text-primary/40"
            >trending_flat</span
          >
          <span class="text-lg font-bold text-primary">{{
            formatTime(previewInterval.endTime)
          }}</span>
        </div>
      </section> -->

      <!-- Nota -->
      <div
        class="p-2 my-2 hidden lg:block rounded-xl border border-dashed border-border-dark"
      >
        <p class="text-xs text-slate-500 leading-relaxed italic">
          Debes completar todo el rango desde
          <strong>{{ formattedBedtime }}</strong> hasta
          <strong>{{ formattedWakeup }}</strong> ({{
            formatDuration(totalTimeInBedMinutes)
          }}
          en total).
        </p>
        <p class="text-xs text-slate-400 mt-2">
          Registrado:
          <span class="font-bold text-white">{{
            formatDuration(registeredMinutes)
          }}</span>
          / Total:
          <span class="font-bold text-white">{{
            formatDuration(totalTimeInBedMinutes)
          }}</span>
        </p>
        <div
          class="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-primary rounded-full"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Panel derecho: Visualización y lista -->
    <div class="lg:col-span-8 space-y-2">
      <!-- Barra de rangos -->
      <div
        class="bg-card-dark border border-border-dark rounded-xl p-6 shadow-sm overflow-hidden"
      >
        <div class="flex items-center justify-between mb-4">
          <h3
            class="text-sm font-bold flex items-center gap-1.5 text-slate-400 uppercase tracking-wider"
          >
            <span class="material-symbols-outlined text-primary text-base"
              >analytics</span
            >
            Línea de Tiempo
          </h3>
          <div
            class="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase"
          >
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-state-asleep"></span>
              Sueño
            </div>
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-state-inbed"></span> Cama
            </div>
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-state-awake"></span>
              Despierto
            </div>
          </div>
        </div>

        <div class="relative pt-6 pb-2">
          <!-- Marcas de tiempo basadas en el rango del Paso 1 -->
          <div class="absolute top-0 left-0 w-full flex justify-between px-1">
            <span
              v-for="time in timelineMarkers"
              :key="time"
              class="text-[10px] font-bold text-slate-500"
            >
              {{ time }}
            </span>
          </div>

          <!-- Barra principal con rango total -->
          <div class="relative h-10 w-full rounded-full custom-inner-shadow">
            <div class="absolute inset-0 flex p-1 gap-1">
              <!-- intervalos -->
              <div
                v-for="(interval, index) in intervals"
                :key="index"
                :class="[
                  'h-full rounded-full timeline-pill flex items-center justify-center transition-all',
                  getStateClass(interval.state),
                ]"
                :style="{ width: getIntervalWidth(interval) + '%' }"
              >
                <span
                  v-show="getIntervalWidth(interval) > 8"
                  class="material-symbols-outlined text-white text-xs"
                >
                  {{ getStateIcon(interval.state) }}
                </span>
              </div>
              <!-- previewInterval -->
              <div
                v-if="previewInterval.hours > 0 || previewInterval.minutes > 0"
                :class="[
                  'h-full rounded-full  animate-pulse timeline-pill flex items-center  justify-center transition-all',
                  getStateClass(previewInterval.state),
                ]"
                :style="{ width: getIntervalWidth(previewInterval) + '%' }"
              >
                <span
                  v-show="getIntervalWidth(previewInterval) > 8"
                  class="material-symbols-outlined text-white text-xs"
                >
                  {{ getStateIcon(previewInterval.state) }}
                </span>
              </div>
              <!-- Espacio vacío si no está completo -->
              <div
                v-show="getRemainingWidth > 0"
                class="h-full bg-slate-800 rounded-full timeline-pill flex items-center justify-center"
                :style="{ width: getRemainingWidth + '%' }"
              >
                <span class="text-xs text-slate-500">...</span>
              </div>
            </div>
          </div>

          <!-- Totales -->
          <div class="mt-4 flex justify-between items-center px-2">
            <div class="flex flex-col items-center">
              <span
                class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter"
              >
                Progreso
              </span>
              <span class="text-sm font-black text-white"
                >{{ progressPercentage }}%</span
              >
            </div>
            <div class="flex gap-4">
              <div class="text-right">
                <span
                  class="block text-[10px] font-bold text-slate-500 uppercase"
                >
                  Dormido
                </span>
                <span class="text-sm font-bold text-state-asleep">{{
                  formatDuration(totalTimeSleep)
                }}</span>
              </div>
              <div class="text-right">
                <span
                  class="block text-[10px] font-bold text-slate-500 uppercase"
                >
                  Despierto
                </span>
                <span class="text-sm font-bold text-slate-400">{{
                  formatDuration(totalTimeAwake)
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          @click="addInterval"
          :disabled="!canAddInterval"
          :class="[
            'w-full mt-2 bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between transition-all',
            canAddInterval
              ? 'hover:bg-primary/10 hover:border-primary/40 cursor-pointer'
              : 'opacity-50 cursor-not-allowed',
          ]"
        >
          <div class="flex items-center gap-2">
            <span
              class="material-symbols-outlined"
              :class="canAddInterval ? 'text-primary' : 'text-primary/40'"
            >
              add_circle
            </span>
            <span
              class="font-medium text-sm"
              :class="canAddInterval ? 'text-primary' : 'text-primary/60'"
            >
              Añadir
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary/60 text-sm">
              schedule
            </span>
            <span
              class="font-bold text-sm"
              :class="canAddInterval ? 'text-primary' : 'text-primary/60'"
            >
              {{ formatTime(previewInterval.startTime) }} →
              {{ formatTime(previewInterval.endTime) }}
            </span>
          </div>
        </button>
      </div>

      <!-- Lista de intervalos -->
      <div class="flex flex-col h-90 min-h-0">
        <div class="flex items-center mb-2 justify-between px-1">
          <h3
            class="text-sm font-bold text-slate-500 uppercase tracking-widest"
          >
            Intervalos Registrados ({{ intervals.length }})
          </h3>
          <span class="text-xs font-bold text-primary">
            {{ formatDuration(registeredMinutes) }} /
            {{ formatDuration(totalTimeInBedMinutes) }}
          </span>
        </div>

        <!-- Mensaje si no hay intervalos -->
        <div
          v-show="intervals.length === 0"
          class="bg-card-dark border border-dashed border-border-dark rounded-xl p-8 text-center"
        >
          <span class="material-symbols-outlined text-4xl text-slate-500 mb-3">
            timeline
          </span>
          <p class="text-slate-400">No hay intervalos registrados aún.</p>
          <p class="text-sm text-slate-500 mt-1">
            Añade tu primer intervalo usando el panel.
          </p>
        </div>

        <!-- Intervalos -->
        <section class="overflow-y-auto space-y-4">
          <div
            v-for="(interval, index) in intervals"
            :key="index"
            :class="[
              'group bg-card-dark border rounded-xl p-4 shadow-sm transition-colors flex items-center justify-between',
              index === intervals.length - 1
                ? 'border-state-asleep/40 bg-state-asleep/2'
                : 'border-border-dark hover:border-' +
                  getStateHoverClass(interval.state),
            ]"
          >
            <div class="flex items-center gap-4">
              <div
                :class="[
                  'h-10 w-10 rounded-lg flex items-center justify-center',
                  getStateBgClass(interval.state),
                ]"
              >
                <span class="material-symbols-outlined">
                  {{ getStateIcon(interval.state) }}
                </span>
              </div>
              <div>
                <div class="flex items-center justify-start gap-2">
                  <h4 class="font-bold text-sm">
                    {{ getStateLabel(interval.state) }}
                  </h4>
                  <span
                    :class="[
                      'text-[10px] px-2 py-0.5 rounded-full font-bold border',
                      getStateBorderClass(interval.state),
                    ]"
                  >
                    {{ formatTime(interval.startTime) }} -
                    {{ formatTime(interval.endTime) }}
                  </span>
                </div>
                <p class="text-xs text-slate-400">
                  {{ getDescription(interval) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="font-bold text-sm">{{
                formatIntervalDuration(interval)
              }}</span>
              <button
                @click="removeInterval(index)"
                class="text-slate-500 flex items-center hover:text-red-500 transition-colors"
              >
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
  <!-- Botones de navegación -->
  <div
    class="pt-6 flex flex-col w-full sm:flex-row items-center justify-center md:justify-between gap-4 border-t border-border-dark"
  >
    <button
      @click="goToStep1"
      class="sm:w-auto px-6 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2"
    >
      <span class="material-symbols-outlined text-lg">arrow_back</span>
      Volver al Paso 1
    </button>
    <button
      @click="saveAndContinue"
      :disabled="!isRangeComplete"
      :class="[
        'font-bold p-4 rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm',
        isRangeComplete
          ? 'bg-primary hover:brightness-110 text-white shadow-primary/20 cursor-pointer'
          : 'bg-border-dark text-slate-500 cursor-not-allowed',
      ]"
    >
      {{
        isRangeComplete ? 'Continuar y Guardar' : 'Complete el rango primero'
      }}
      <span class="material-symbols-outlined">chevron_right</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import sleepStateConfig from '../../utils/css.util.ts'
  import IntervalAdder from './IntervalAdder.vue'
  const getStateClass = (state: SleepState) => sleepStateConfig[state].class
  const getStateBgClass = (state: SleepState) => sleepStateConfig[state].bgClass
  const getStateBorderClass = (state: SleepState) =>
    sleepStateConfig[state].borderClass
  const getStateHoverClass = (state: SleepState) =>
    sleepStateConfig[state].hoverClass
  const getStateIcon = (state: SleepState) => sleepStateConfig[state].icon
  const getStateLabel = (state: SleepState) => sleepStateConfig[state].label

  const emits = defineEmits(['back', 'next'])

  // Tipos
  type SleepState = 'asleep' | 'inBed' | 'awake'
  type Interval = {
    state: SleepState
    hours: number
    minutes: number
    startTime: Date
    endTime: Date
  }

  // Fechas fijas de acostado y levantado
  // FIXME: These dates should come from the previous step
  const bedtimeDate = ref(new Date(2024, 0, 1, 22, 30)) // 22:30
  const wakeupDate = ref(new Date(2024, 0, 2, 7, 15)) // 07:15

  // Calcular tiempo total en cama
  const totalTimeInBedMinutes = computed(() => {
    const diffMs = wakeupDate.value.getTime() - bedtimeDate.value.getTime()
    return Math.floor(diffMs / 60000) // minutos
  })

  const totalTimeSleep = computed(() => {
    return intervals.value
      .filter(interval => interval.state === 'asleep')
      .reduce(
        (total, interval) => total + interval.hours * 60 + interval.minutes,
        0
      )
  })
  const totalTimeAwake = computed(() => {
    return intervals.value
      .filter(
        interval => interval.state === 'inBed' || interval.state === 'awake'
      )
      .reduce(
        (total, interval) => total + interval.hours * 60 + interval.minutes,
        0
      )
  })

  // Estado del nuevo intervalo
  const newInterval = ref({
    state: 'inBed' as SleepState,
    hours: 1,
    minutes: 30,
  })

  const previewInterval = computed<Interval>(() => {
    const lastInterval = intervals.value[intervals.value.length - 1]
    let startTime: Date

    if (lastInterval) {
      startTime = new Date(lastInterval.endTime)
    } else {
      startTime = new Date(bedtimeDate.value)
    }

    const endTime = new Date(startTime)
    endTime.setHours(startTime.getHours() + newInterval.value.hours)
    endTime.setMinutes(startTime.getMinutes() + newInterval.value.minutes)

    const interval: Interval = {
      state: newInterval.value.state,
      hours: newInterval.value.hours,
      minutes: newInterval.value.minutes,
      startTime,
      endTime,
    }
    return interval
  })

  // Lista de intervalos
  const intervals = ref<Interval[]>([])

  // Calcular tiempo registrado
  const registeredMinutes = computed(() => {
    return intervals.value.reduce(
      (total, interval) => total + interval.hours * 60 + interval.minutes,
      0
    )
  })

  // Calcular tiempo restante
  const remainingTime = computed(() => {
    const remaining = totalTimeInBedMinutes.value - registeredMinutes.value
    return Math.max(0, remaining)
  })

  // Verificar si el rango está completo
  const isRangeComplete = computed(() => {
    return remainingTime.value <= 0 && intervals.value.length > 0
  })

  // Porcentaje de progreso
  const progressPercentage = computed(() => {
    if (totalTimeInBedMinutes.value === 0) return 0
    const percentage =
      (registeredMinutes.value / totalTimeInBedMinutes.value) * 100
    return Math.min(100, Math.round(percentage))
  })

  // Marcas de tiempo para la línea de tiempo
  const timelineMarkers = computed(() => {
    if (totalTimeInBedMinutes.value === 0) return []

    const markers = []
    const startMinutes =
      bedtimeDate.value.getHours() * 60 + bedtimeDate.value.getMinutes()
    const interval = totalTimeInBedMinutes.value / 5

    for (let i = 0; i <= 5; i++) {
      const markerMinutes = startMinutes + interval * i
      const markerHour = Math.floor(markerMinutes / 60) % 24
      const markerMinute = Math.floor(markerMinutes % 60)
      markers.push(
        `${markerHour.toString().padStart(2, '0')}:${markerMinute
          .toString()
          .padStart(2, '0')}`
      )
    }

    return markers
  })

  // Formatear hora de acostado
  const formattedBedtime = computed(() => {
    const h = bedtimeDate.value.getHours()
    const m = bedtimeDate.value.getMinutes()
    const amPm = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return `${hour12.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')} ${amPm}`
  })

  // Formatear hora de levantado
  const formattedWakeup = computed(() => {
    const h = wakeupDate.value.getHours()
    const m = wakeupDate.value.getMinutes()
    const amPm = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return `${hour12.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')} ${amPm}`
  })

  // Formatear duración
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins.toString().padStart(2, '0')}m`
  }

  // Formatear duración de intervalo
  const formatIntervalDuration = (interval: Interval) => {
    const totalMinutes = interval.hours * 60 + interval.minutes
    return formatDuration(totalMinutes)
  }

  // Verificar si se puede añadir intervalo
  const canAddInterval = computed(() => {
    if (isRangeComplete.value) return false
    if (newInterval.value.hours === 0 && newInterval.value.minutes === 0)
      return false

    const newDuration = newInterval.value.hours * 60 + newInterval.value.minutes
    return newDuration <= remainingTime.value
  })

  // Añadir intervalo
  const addInterval = () => {
    if (!canAddInterval.value) {
      const newDuration =
        newInterval.value.hours * 60 + newInterval.value.minutes
      if (newDuration > remainingTime.value) {
        //TODO cambiar por toast
        alert(
          `No puedes añadir ${formatDuration(
            newDuration
          )} porque solo te quedan ${formatDuration(remainingTime.value)}`
        )
      }
      return
    }
    intervals.value.push(previewInterval.value)
    newInterval.value = { state: 'asleep', hours: 0, minutes: 0 }
  }

  // Eliminar intervalo
  const removeInterval = (index: number) => {
    intervals.value.splice(index, 1)
  }

  // Calcular ancho del intervalo para la barra
  const getIntervalWidth = (interval: Interval): number => {
    if (totalTimeInBedMinutes.value === 0) return 0
    const intervalMinutes = interval.hours * 60 + interval.minutes
    const percentage = (intervalMinutes / totalTimeInBedMinutes.value) * 100
    return Math.max(5, percentage)
  }

  // Ancho del espacio restante
  const getRemainingWidth = computed<number>(() => {
    if (totalTimeInBedMinutes.value === 0) return 0
    const percentage =
      ((remainingTime.value -
        previewInterval.value.hours * 60 -
        previewInterval.value.minutes) /
        totalTimeInBedMinutes.value) *
      100
    return percentage
  })

  // Descripción según intervalo
  const getDescription = (interval: Interval) => {
    const duration = interval.hours * 60 + interval.minutes

    if (interval.state === 'asleep') {
      if (duration >= 240) return 'Sueño profundo ininterrumpido'
      if (duration >= 120) return 'Ciclo de sueño completo'
      return 'Sueño ligero'
    }

    if (interval.state === 'inBed') {
      if (interval.startTime.getHours() === 22)
        return 'Inicio de la sesión de descanso'
      return 'Periodo en cama'
    }

    if (interval.state === 'awake') {
      if (interval.startTime.getHours() >= 7) return 'Actividad matutina final'
      return 'Periodo despierto'
    }

    return 'Intervalo registrado'
  }

  // Formatear hora
  const formatTime = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`
  }

  // Navegación
  const goToStep1 = () => emits('back')
  const saveAndContinue = () => {
    if (!isRangeComplete.value) return
    console.log('Guardando secuencia completa:', intervals.value)
    alert(
      `✅ Rango completo guardado!\nTotal registrado: ${formatDuration(
        registeredMinutes.value
      )}\nProgreso: 100%`
    )
    emits('next')
  }
</script>
