<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Panel izquierdo: Añadir intervalo -->
    <div class="lg:col-span-4 space-y-6">
      <div
        class="bg-card-dark border border-border-dark rounded-xl p-6 shadow-sm"
      >
        <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">add_circle</span>
          Añadir Intervalo
        </h3>
        <div class="space-y-6">
          <!-- Estado del intervalo -->
          <div class="space-y-3">
            <label
              class="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              Estado del intervalo
            </label>
            <div
              class="grid grid-cols-3 gap-2 p-1 bg-background-dark rounded-lg border border-border-dark"
            >
              <button
                @click="newInterval.state = 'asleep'"
                :class="[
                  'flex flex-col items-center justify-center py-3 px-2 rounded-md transition-all',
                  newInterval.state === 'asleep'
                    ? 'bg-card-dark border border-state-asleep text-state-asleep shadow-sm'
                    : 'hover:bg-card-dark border border-transparent hover:border-border-dark opacity-60 hover:opacity-100',
                ]"
              >
                <span class="material-symbols-outlined text-xl mb-1">
                  hotel
                </span>
                <span class="text-[10px] font-bold uppercase">Dormido</span>
              </button>
              <button
                @click="newInterval.state = 'inBed'"
                :class="[
                  'flex flex-col items-center justify-center py-3 px-2 rounded-md transition-all',
                  newInterval.state === 'inBed'
                    ? 'bg-card-dark border border-state-inbed text-state-inbed shadow-sm'
                    : 'hover:bg-card-dark border border-transparent hover:border-border-dark opacity-60 hover:opacity-100',
                ]"
              >
                <span class="material-symbols-outlined text-xl mb-1">
                  airline_seat_flat
                </span>
                <span class="text-[10px] font-bold uppercase">En Cama</span>
              </button>
              <button
                @click="newInterval.state = 'awake'"
                :class="[
                  'flex flex-col items-center justify-center py-3 px-2 rounded-md transition-all',
                  newInterval.state === 'awake'
                    ? 'bg-card-dark border border-state-awake text-state-awake shadow-sm'
                    : 'hover:bg-card-dark border border-transparent hover:border-border-dark opacity-60 hover:opacity-100',
                ]"
              >
                <span class="material-symbols-outlined text-xl mb-1">
                  accessibility_new
                </span>
                <span class="text-[10px] font-bold uppercase">Levantado</span>
              </button>
            </div>
          </div>

          <!-- Duración del intervalo -->
          <div class="space-y-3">
            <label
              class="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              Duración del intervalo
            </label>
            <div class="grid grid-cols-2 gap-4">
              <!-- Horas -->
              <div class="space-y-2">
                <div class="relative">
                  <input
                    v-model.number="newInterval.hours"
                    :disabled="isRangeComplete"
                    class="w-full bg-background-dark border border-border-dark rounded-lg py-3 px-4 text-center font-bold text-xl focus:ring-primary focus:border-primary appearance-none transition-all disabled:opacity-50"
                    :class="isRangeComplete ? 'text-slate-500' : 'text-white'"
                    type="number"
                    min="0"
                    max="12"
                    @change="validateHours"
                  />
                  <div
                    class="absolute inset-y-0 right-3 flex items-center pointer-events-none"
                  >
                    <span class="text-xs font-bold text-slate-500">H</span>
                  </div>
                </div>
                <div class="flex gap-1">
                  <button
                    @click="adjustHours(-1)"
                    :disabled="isRangeComplete"
                    class="flex-1 bg-border-dark hover:bg-slate-700 py-1 rounded text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <button
                    @click="adjustHours(1)"
                    :disabled="isRangeComplete"
                    class="flex-1 bg-border-dark hover:bg-slate-700 py-1 rounded text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
              <!-- Minutos -->
              <div class="space-y-2">
                <div class="relative">
                  <input
                    v-model.number="newInterval.minutes"
                    :disabled="isRangeComplete"
                    class="w-full bg-background-dark border border-border-dark rounded-lg py-3 px-4 text-center font-bold text-xl focus:ring-primary focus:border-primary transition-all disabled:opacity-50"
                    :class="isRangeComplete ? 'text-slate-500' : 'text-white'"
                    type="number"
                    min="0"
                    max="59"
                    step="5"
                    @change="validateMinutes"
                  />
                  <div
                    class="absolute inset-y-0 right-3 flex items-center pointer-events-none"
                  >
                    <span class="text-xs font-bold text-slate-500">M</span>
                  </div>
                </div>
                <div class="flex gap-1">
                  <button
                    @click="adjustMinutes(-5)"
                    :disabled="isRangeComplete"
                    class="flex-1 bg-border-dark hover:bg-slate-700 py-1 rounded text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -5
                  </button>
                  <button
                    @click="adjustMinutes(5)"
                    :disabled="isRangeComplete"
                    class="flex-1 bg-border-dark hover:bg-slate-700 py-1 rounded text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón Añadir -->
          <button
            @click="addInterval"
            :disabled="!canAddInterval"
            :class="[
              'w-full font-bold py-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2',
              canAddInterval
                ? 'bg-primary hover:brightness-110 text-white cursor-pointer'
                : 'bg-border-dark text-slate-500 cursor-not-allowed',
            ]"
          >
            <span class="material-symbols-outlined">add</span>
            {{ isRangeComplete ? 'Rango Completo' : 'Añadir a la Secuencia' }}
          </button>

          <!-- Indicador de tiempo restante -->
          <div
            v-if="remainingTime > 0 && remainingTime < totalTimeInBedMinutes"
            class="p-3 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <p class="text-xs text-primary font-bold text-center">
              ⏱️ Tiempo restante para completar:
              <span class="text-white">{{ formatRemainingTime }}</span>
            </p>
          </div>
          <div
            v-else-if="isRangeComplete"
            class="p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
          >
            <p class="text-xs text-green-500 font-bold text-center">
              ✅ Rango completo alcanzado
            </p>
          </div>
          <div
            v-else-if="remainingTime === 0 && intervals.length === 0"
            class="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <p class="text-xs text-blue-500 font-bold text-center">
              🎯 Comienza añadiendo tu primer intervalo
            </p>
          </div>
        </div>
      </div>

      <!-- Nota -->
      <div class="p-4 rounded-xl border border-dashed border-border-dark">
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
    <div class="lg:col-span-8 space-y-6">
      <!-- Barra de rangos -->
      <div
        class="bg-card-dark border border-border-dark rounded-xl p-6 shadow-sm overflow-hidden"
      >
        <div
          class="flex flex-col md:flex-row items-center gap-2 md:justify-between mb-6"
        >
          <h3 class="text-lg font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-primary"
              >analytics</span
            >
            Barra de Rangos de Sueño
          </h3>

          <span class="text-sm font-normal text-slate-400">
            ({{ formattedBedtime }} - {{ formattedWakeup }})
          </span>
          <div
            class="flex items-center gap-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase"
          >
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-state-asleep"></span>
              Dormido
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-state-inbed"></span>
              En Cama
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-state-awake"></span>
              Levantado
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
              <div
                v-for="(interval, index) in intervals"
                :key="index"
                :class="[
                  'h-full rounded-full timeline-pill flex items-center justify-center transition-all',
                  getStateClass(interval.state),
                ]"
                :style="{ width: getIntervalWidth(interval) }"
              >
                <span
                  v-if="
                    getIntervalWidth(interval) !== '0%' &&
                    getIntervalWidth(interval) !== '0px'
                  "
                  class="material-symbols-outlined text-white text-xs"
                >
                  {{ getStateIcon(interval.state) }}
                </span>
              </div>
              <!-- Espacio vacío si no está completo -->
              <div
                v-if="remainingTime > 0"
                class="h-full bg-slate-800 rounded-full timeline-pill flex items-center justify-center"
                :style="{ width: getRemainingWidth }"
              >
                <span class="text-xs text-slate-500">...</span>
              </div>
            </div>
          </div>

          <!-- Totales -->
          <div class="mt-4 flex justify-between items-center px-2">
            <div class="flex flex-col">
              <span
                class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter"
              >
                Progreso del Rango
              </span>
              <span class="text-xl font-black text-white"
                >{{ progressPercentage }}%</span
              >
            </div>
            <div class="flex gap-4">
              <div class="text-right">
                <span
                  class="block text-[10px] font-bold text-slate-500 uppercase"
                >
                  Registrado
                </span>
                <span class="text-sm font-bold text-white">{{
                  formatDuration(registeredMinutes)
                }}</span>
              </div>
              <div class="text-right">
                <span
                  class="block text-[10px] font-bold text-slate-500 uppercase"
                >
                  Total
                </span>
                <span class="text-sm font-bold text-slate-400">{{
                  formatDuration(totalTimeInBedMinutes)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de intervalos -->
      <div class="space-y-4">
        <div class="flex items-center justify-between px-1">
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
          v-if="intervals.length === 0"
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
      </div>

      <!-- Botones de navegación -->
      <div
        class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-dark"
      >
        <button
          @click="goToStep1"
          class="w-full sm:w-auto px-6 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Volver al Paso 1
        </button>
        <button
          @click="saveAndContinue"
          :disabled="!isRangeComplete"
          :class="[
            'w-full sm:w-[240px] font-bold py-4 rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm',
            isRangeComplete
              ? 'bg-primary hover:brightness-110 text-white shadow-primary/20 cursor-pointer'
              : 'bg-border-dark text-slate-500 cursor-not-allowed',
          ]"
        >
          {{
            isRangeComplete
              ? 'Continuar y Guardar'
              : 'Complete el rango primero'
          }}
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import sleepStateConfig from '../../utils/css.util.ts'
  const getStateClass = (state: SleepState) => sleepStateConfig[state].class
  const getStateBgClass = (state: SleepState) => sleepStateConfig[state].bgClass
  const getStateBorderClass = (state: SleepState) =>
    sleepStateConfig[state].borderClass
  const getStateHoverClass = (state: SleepState) =>
    sleepStateConfig[state].hoverClass
  const getStateIcon = (state: SleepState) => sleepStateConfig[state].icon
  const getStateLabel = (state: SleepState) => sleepStateConfig[state].label

  // Tipos
  type SleepState = 'asleep' | 'inBed' | 'awake'
  type Interval = {
    state: SleepState
    hours: number
    minutes: number
    startTime: Date
    endTime: Date
  }

  // Fechas fijas de acostado y levantado que vienen del paso 1
  const bedtimeDate = ref(new Date(2024, 0, 1, 22, 30)) // 22:30
  const wakeupDate = ref(new Date(2024, 0, 2, 7, 15)) // 07:15

  // Calcular tiempo total en cama
  const totalTimeInBedMinutes = computed(() => {
    const diffMs = wakeupDate.value.getTime() - bedtimeDate.value.getTime()
    return Math.floor(diffMs / 60000) // minutos
  })

  // Estado del nuevo intervalo
  const newInterval = ref({
    state: 'asleep' as SleepState,
    hours: 1,
    minutes: 30,
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

  // Formatear tiempo restante
  const formatRemainingTime = computed(() => {
    const hours = Math.floor(remainingTime.value / 60)
    const minutes = remainingTime.value % 60

    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`
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

  // Validaciones
  const validateHours = () => {
    if (newInterval.value.hours < 0) newInterval.value.hours = 0
    if (newInterval.value.hours > 12) newInterval.value.hours = 12
  }

  const validateMinutes = () => {
    if (newInterval.value.minutes < 0) newInterval.value.minutes = 0
    if (newInterval.value.minutes > 59) newInterval.value.minutes = 59
    newInterval.value.minutes = Math.round(newInterval.value.minutes / 5) * 5
  }

  // Ajustar horas
  const adjustHours = (delta: number) => {
    if (isRangeComplete.value) return
    const newValue = newInterval.value.hours + delta
    if (newValue >= 0 && newValue <= 12) newInterval.value.hours = newValue
  }

  // Ajustar minutos
  const adjustMinutes = (delta: number) => {
    if (isRangeComplete.value) return
    const newValue = newInterval.value.minutes + delta
    if (newValue >= 0 && newValue <= 59) {
      newInterval.value.minutes = Math.round(newValue / 5) * 5
    }
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

    intervals.value.push(interval)
    newInterval.value = { state: 'asleep', hours: 1, minutes: 30 }
  }

  // Eliminar intervalo
  const removeInterval = (index: number) => {
    intervals.value.splice(index, 1)
  }

  // Calcular ancho del intervalo para la barra
  const getIntervalWidth = (interval: Interval) => {
    if (totalTimeInBedMinutes.value === 0) return '0%'
    const intervalMinutes = interval.hours * 60 + interval.minutes
    const percentage = (intervalMinutes / totalTimeInBedMinutes.value) * 100
    return `${Math.max(5, percentage)}%`
  }

  // Ancho del espacio restante
  const getRemainingWidth = computed(() => {
    if (totalTimeInBedMinutes.value === 0) return '0%'
    const percentage = (remainingTime.value / totalTimeInBedMinutes.value) * 100
    return `${percentage}%`
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
  const goToStep1 = () => alert('Navegando al Paso 1...')
  const saveAndContinue = () => {
    if (!isRangeComplete.value) return
    console.log('Guardando secuencia completa:', intervals.value)
    alert(
      `✅ Rango completo guardado!\nTotal registrado: ${formatDuration(
        registeredMinutes.value
      )}\nProgreso: 100%`
    )
  }

  // Inicializar con ejemplo para pruebas
  onMounted(() => {
    const startTime = new Date(bedtimeDate.value)
    intervals.value.push({
      state: 'inBed',
      hours: 0,
      minutes: 30,
      startTime: startTime,
      endTime: new Date(startTime.getTime() + 30 * 60000),
    })
  })
</script>
<style scoped>
  /* Chrome, Edge, Safari */
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none; /* estándar */
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    appearance: none; /* estándar */
    -moz-appearance: textfield;
  }
</style>
