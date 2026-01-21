<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
    <!-- Panel izquierdo: Interval Adder -->
    <section class="lg:col-span-8 space-y-2">
      <div
        class="bg-card-dark border border-border-dark rounded-xl shadow-xl overflow-hidden"
      >
        <!-- Parte superior: Línea de tiempo -->
        <div class="p-4 pb-2">
          <div class="flex items-center justify-between mb-4">
            <h3
              class="text-[10px] font-bold flex items-center gap-1.5 text-slate-400 uppercase tracking-wider"
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
                <span class="w-1.5 h-1.5 rounded-full bg-state-asleep"></span>
                Dormido
              </div>
              <div class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-state-inbed"></span>
                Cama
              </div>
              <div class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-state-awake"></span>
                Despierto
              </div>
            </div>
          </div>

          <div class="relative pt-4 pb-2">
            <!-- Marcas de tiempo -->
            <div class="absolute top-0 left-0 w-full flex justify-between px-1">
              <span
                v-for="time in timelineMarkers"
                :key="time"
                class="text-[9px] font-bold"
                :class="
                  time === timelineMarkers[0] ||
                  time === timelineMarkers[timelineMarkers.length - 1]
                    ? 'text-slate-500'
                    : 'text-slate-600'
                "
              >
                {{ time }}
              </span>
            </div>
            <!-- Barra principal con rango total -->
            <div class="relative h-10 w-full rounded-full custom-inner-shadow">
              <div class="absolute inset-0 flex p-1 gap-1">
                <!-- Mostrar intervalos en su orden correcto -->
                <template v-for="(interval, index) in intervals" :key="index">
                  <!-- Intervalo normal (cuando NO está siendo editado) -->
                  <div
                    v-if="editingIntervalIndex !== index"
                    :class="[
                      'h-full rounded-full timeline-pill flex items-center justify-center transition-all cursor-pointer ',
                      getStateClass(interval.state),
                    ]"
                    :style="{ width: getIntervalWidth(interval) + '%' }"
                    @click="selectIntervalForEditing(index)"
                  >
                    <span
                      v-show="getIntervalWidth(interval) > 8"
                      class="material-symbols-outlined text-white text-xs"
                    >
                      {{ getStateIcon(interval.state) }}
                    </span>
                  </div>

                  <!-- Intervalo editado (cuando ESTÁ siendo editado) -->
                  <div
                    v-else
                    @click="cancelEditing"
                    :class="[
                      'h-full rounded-full timeline-pill flex items-center justify-center  scale-105 z-10 cursor-pointer',
                      getStateClass(editingIntervalState),
                    ]"
                    :style="{ width: getEditingIntervalWidth() + '%' }"
                  >
                    <span
                      v-show="getEditingIntervalWidth() > 8"
                      class="material-symbols-outlined text-white text-xs"
                    >
                      {{ getStateIcon(editingIntervalState) }}
                    </span>
                  </div>
                </template>

                <!-- Preview solo para añadir (no en modo edición) -->
                <div
                  v-if="!editingMode && canAddInterval"
                  :class="[
                    'h-full rounded-full animate-pulse timeline-pill flex items-center justify-center transition-all',
                    getStateClass(newInterval.state),
                  ]"
                  :style="{ width: getPreviewIntervalWidth() + '%' }"
                >
                  <span
                    v-show="getPreviewIntervalWidth() > 8"
                    class="material-symbols-outlined text-white text-xs"
                  >
                    {{ getStateIcon(newInterval.state) }}
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
          </div>
        </div>

        <!-- Parte inferior: Controles -->
        <div
          class="bg-background-dark/60 border-t border-border-dark p-3 space-y-4"
        >
          <!-- Proyección del tiempo -->
          <div class="flex justify-around items-center gap-3">
            <div
              v-show="canAddInterval || editingMode"
              class="flex items-center justify-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20"
            >
              <span
                class="hidden md:block text-sm font-bold text-slate-500 uppercase"
                >{{ editingMode ? 'Editando:' : 'Proyectando:' }}</span
              >
              <span class="text-sm font-black text-primary">{{
                editingMode
                  ? formatTime(getEditingStartTime())
                  : formatTime(previewInterval.startTime)
              }}</span>
              <span class="material-symbols-outlined text-primary/40 text-sm"
                >trending_flat</span
              >
              <span class="text-sm font-black text-primary">{{
                editingMode
                  ? formatTime(getEditingEndTime())
                  : formatTime(previewInterval.endTime)
              }}</span>
            </div>
            <!-- Tiempo restante / completado -->
            <div
              v-if="remainTime.hours > 0 || remainTime.minutes > 0"
              class="flex items-center justify-center gap-3 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full"
            >
              <div class="flex items-center gap-2">
                <span
                  class="hidden md:block text-sm font-bold text-slate-500 uppercase"
                  >Restante</span
                >
                <span class="flex items-center text-sm text-primary font-bold">
                  {{ remainTime.hours }}h
                  {{ remainTime.minutes.toString().padStart(2, '0') }}m
                </span>
              </div>
            </div>
            <div
              v-else-if="isRangeComplete"
              class="flex w-full items-center justify-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full"
            >
              <span class="material-symbols-outlined text-green-500 text-sm"
                >check_circle</span
              >
              <span class="text-sm font-medium text-green-500"
                >Rango completo</span
              >
            </div>
          </div>

          <!-- Botones de estado -->
          <div class="flex items-center justify-center gap-6">
            <div class="flex flex-col items-center gap-2">
              <button
                @click="updateState('asleep')"
                :class="[
                  'w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all',
                  getCurrentState() === 'asleep'
                    ? 'bg-state-asleep text-white ring-4 ring-state-asleep/20'
                    : 'bg-card-dark border border-border-dark text-slate-500 hover:bg-slate-800',
                ]"
                title="Dormido"
              >
                <span class="material-symbols-outlined text-2xl">hotel</span>
              </button>
              <span
                class="text-[9px] font-bold uppercase"
                :class="
                  getCurrentState() === 'asleep'
                    ? 'text-state-asleep'
                    : 'text-slate-500'
                "
              >
                Dormido
              </span>
            </div>

            <div class="flex flex-col items-center gap-2">
              <button
                @click="updateState('inBed')"
                :class="[
                  'w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all',
                  getCurrentState() === 'inBed'
                    ? 'bg-state-inbed text-white ring-4 ring-state-inbed/20'
                    : 'bg-card-dark border border-border-dark text-slate-500 hover:bg-slate-800',
                ]"
                title="En Cama"
              >
                <span class="material-symbols-outlined text-2xl"
                  >airline_seat_flat</span
                >
              </button>
              <span
                class="text-[9px] font-bold uppercase"
                :class="
                  getCurrentState() === 'inBed'
                    ? 'text-state-inbed'
                    : 'text-slate-500'
                "
              >
                Cama
              </span>
            </div>

            <div class="flex flex-col items-center gap-2">
              <button
                @click="updateState('awake')"
                :class="[
                  'w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all',
                  getCurrentState() === 'awake'
                    ? 'bg-state-awake text-white ring-4 ring-state-awake/20'
                    : 'bg-card-dark border border-border-dark text-slate-500 hover:bg-slate-800',
                ]"
                title="Levantado"
              >
                <span class="material-symbols-outlined text-2xl"
                  >accessibility_new</span
                >
              </button>
              <span
                class="text-[9px] font-bold uppercase"
                :class="
                  getCurrentState() === 'awake'
                    ? 'text-state-awake'
                    : 'text-slate-500'
                "
              >
                Fuera
              </span>
            </div>
          </div>

          <!-- Controles de duración -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Control de horas -->
            <div
              class="flex items-center justify-between bg-card-dark rounded-xl p-2 border border-border-dark"
            >
              <button
                @click="adjustDuration('hours', -1)"
                class="w-10 h-10 rounded-lg bg-background-dark flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                :disabled="getCurrentHours() <= 0"
              >
                <span class="material-symbols-outlined">remove</span>
              </button>
              <div class="flex flex-col items-center">
                <span class="text-xl font-black leading-none">{{
                  getCurrentHours()
                }}</span>
                <span class="text-[8px] font-bold text-slate-500 uppercase"
                  >Horas</span
                >
              </div>
              <button
                @click="adjustDuration('hours', 1)"
                class="w-10 h-10 rounded-lg bg-background-dark flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                :disabled="getCurrentHours() >= 12"
              >
                <span class="material-symbols-outlined">add</span>
              </button>
            </div>

            <!-- Control de minutos -->
            <div
              class="flex items-center justify-between bg-card-dark rounded-xl p-2 border border-border-dark"
            >
              <button
                @click="adjustDuration('minutes', -5)"
                class="w-10 h-10 rounded-lg bg-background-dark flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                :disabled="getCurrentMinutes() <= 0"
              >
                <span class="material-symbols-outlined">remove</span>
              </button>
              <div class="flex flex-col items-center">
                <span class="text-xl font-black leading-none">{{
                  getCurrentMinutes()
                }}</span>
                <span class="text-[8px] font-bold text-slate-500 uppercase"
                  >Minutos</span
                >
              </div>
              <button
                @click="adjustDuration('minutes', 5)"
                class="w-10 h-10 rounded-lg bg-background-dark flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                :disabled="getCurrentMinutes() >= 55"
              >
                <span class="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          <!-- Botón principal de acción -->
          <button
            @click="editingMode ? updateInterval() : addInterval()"
            :disabled="!canAddInterval && !editingMode"
            :class="[
              'w-full h-14 rounded-xl cursor-pointer font-bold shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm ',
              editingMode
                ? 'bg-green-600/20 hover:bg-green-600/30 border text-green-400 border-green-600/30 hover:text-green-300'
                : canAddInterval
                  ? 'bg-primary hover:brightness-110 shadow-primary/20'
                  : 'bg-slate-800 cursor-not-allowed',
            ]"
          >
            <span class="material-symbols-outlined font-bold">
              {{ editingMode ? 'check_circle' : 'add_circle' }}
            </span>
            {{ editingMode ? 'Actualizar Intervalo' : 'Añadir a la Secuencia' }}
          </button>
          <!-- Botón de borrar intervalo (solo en modo edición) -->
          <button
            v-if="editingMode"
            @click="deleteEditingInterval()"
            class="w-full h-10 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 cursor-pointer font-bold transition-all flex items-center justify-center gap-2 text-sm border border-red-600/30"
          >
            <span class="material-symbols-outlined text-base">delete</span>
            Eliminar este Intervalo
          </button>

          <!-- Botón de cancelar edición -->
          <button
            v-if="editingMode"
            @click="cancelEditing()"
            class="w-full h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer font-bold transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span class="material-symbols-outlined text-base">close</span>
            Cancelar Edición
          </button>
        </div>
      </div>
    </section>
    <!-- Panel derecho: Instrucciones y navegación -->
    <div class="flex flex-col lg:col-span-4 gap-2">
      <InstructionsPanel :instructions="instructions" />
      <!-- Botones de navegación -->
      <section
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
            isRangeComplete
              ? 'Continuar y Guardar'
              : 'Complete el rango primero'
          }}
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import sleepStateConfig from '../../utils/css.util'
  import InstructionsPanel from '../InstructionsPanel.vue'
  import {
    formatDuration,
    formatTime,
  } from '@/views/UserEditReg/utils/time.util'

  const getStateClass = (state: SleepState) => sleepStateConfig[state].class
  const getStateIcon = (state: SleepState) => sleepStateConfig[state].icon

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
  const bedtimeDate = ref(new Date(2024, 0, 1, 22, 30)) // 22:30
  const wakeupDate = ref(new Date(2024, 0, 2, 7, 15)) // 07:15

  // Calcular tiempo total en cama
  const totalTimeInBedMinutes = computed(() => {
    const diffMs = wakeupDate.value.getTime() - bedtimeDate.value.getTime()
    return Math.floor(diffMs / 60000) // minutos
  })

  // const totalTimeSleep = computed(() => {
  //   return intervals.value
  //     .filter(interval => interval.state === 'asleep')
  //     .reduce(
  //       (total, interval) => total + interval.hours * 60 + interval.minutes,
  //       0
  //     )
  // })
  // const totalTimeAwake = computed(() => {
  //   return intervals.value
  //     .filter(
  //       interval => interval.state === 'inBed' || interval.state === 'awake'
  //     )
  //     .reduce(
  //       (total, interval) => total + interval.hours * 60 + interval.minutes,
  //       0
  //     )
  // })

  // Estado del nuevo intervalo (solo para añadir)
  const newInterval = ref({
    state: 'inBed' as SleepState,
    hours: 1,
    minutes: 30,
  })
  const instructions = [
    'Selecciona un estado (Dormido, En Cama o Despierto) y ajusta la duración con los controles de horas/minutos.',
    'Observa cómo se distribuyen tus intervalos en la barra superior. Los colores representan cada estado.',
    'Haz clic en cualquier intervalo de la lista para editarlo. Puedes cambiar su estado, duración o eliminarlo.',
    'Asegúrate de que la suma de todos los intervalos cubra completamente desde la hora de inicio hasta la hora de fin.',
    'Una vez completado el rango, haz clic en "Continuar y Guardar" para registrar tu sesión de sueño.',
  ]

  // Modo de edición
  const editingMode = ref(false)
  const editingIntervalIndex = ref<number | null>(null)
  const editingIntervalHours = ref(0)
  const editingIntervalMinutes = ref(0)
  const editingIntervalState = ref<SleepState>('inBed')

  const remainTime = computed<{ hours: number; minutes: number }>(() => {
    const hours = Math.floor(remainingTime.value / 60)
    const minutes = remainingTime.value % 60
    return { hours, minutes }
  })

  // Preview solo para añadir
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

  // Eliminar el intervalo que se está editando
  const deleteEditingInterval = () => {
    if (editingIntervalIndex.value === null) return
    removeInterval(editingIntervalIndex.value)
    cancelEditing()
  }

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

  // Verificar si se puede añadir intervalo (solo para añadir)
  const canAddInterval = computed(() => {
    if (isRangeComplete.value) return false
    if (editingMode.value) return false // En modo edición no se puede añadir

    const newDuration = newInterval.value.hours * 60 + newInterval.value.minutes
    return newDuration > 0 && newDuration <= remainingTime.value
  })

  // Obtener estado actual (para los botones de estado)
  const getCurrentState = (): SleepState => {
    return editingMode.value
      ? editingIntervalState.value
      : newInterval.value.state
  }

  // Obtener horas actuales
  const getCurrentHours = (): number => {
    return editingMode.value
      ? editingIntervalHours.value
      : newInterval.value.hours
  }

  // Obtener minutos actuales
  const getCurrentMinutes = (): number => {
    return editingMode.value
      ? editingIntervalMinutes.value
      : newInterval.value.minutes
  }

  // Calcular ancho del preview para añadir
  const getPreviewIntervalWidth = (): number => {
    if (totalTimeInBedMinutes.value === 0 || editingMode.value) return 0
    const intervalMinutes =
      newInterval.value.hours * 60 + newInterval.value.minutes
    const percentage = (intervalMinutes / totalTimeInBedMinutes.value) * 100
    return Math.max(2, percentage)
  }

  // Actualizar estado
  const updateState = (state: SleepState) => {
    if (editingMode.value) {
      editingIntervalState.value = state
    } else {
      newInterval.value.state = state
    }
  }

  // Seleccionar intervalo para editar
  const selectIntervalForEditing = (index: number) => {
    const interval = intervals.value[index] as Interval
    editingMode.value = true
    editingIntervalIndex.value = index
    editingIntervalHours.value = interval.hours
    editingIntervalMinutes.value = interval.minutes
    editingIntervalState.value = interval.state

    resetAddInterval()
  }
  // Resetear el preview de añadir
  const resetAddInterval = () => {
    newInterval.value = { state: 'asleep', hours: 0, minutes: 0 }
  }

  // Cancelar edición
  const cancelEditing = () => {
    editingMode.value = false
    editingIntervalIndex.value = null
    editingIntervalHours.value = 0
    editingIntervalMinutes.value = 0
    editingIntervalState.value = 'inBed'

    resetAddInterval()
  }

  // Calcular ancho del intervalo para la barra
  const getIntervalWidth = (interval: Interval): number => {
    if (totalTimeInBedMinutes.value === 0) return 0
    const intervalMinutes = interval.hours * 60 + interval.minutes
    const percentage = (intervalMinutes / totalTimeInBedMinutes.value) * 100
    return Math.max(2, percentage) // Mínimo 2% para que sea visible
  }

  // Calcular ancho del intervalo editado en tiempo real
  const getEditingIntervalWidth = (): number => {
    if (totalTimeInBedMinutes.value === 0) return 0
    const intervalMinutes =
      editingIntervalHours.value * 60 + editingIntervalMinutes.value
    const percentage = (intervalMinutes / totalTimeInBedMinutes.value) * 100
    return Math.max(2, percentage)
  }

  // Calcular tiempo de inicio del intervalo editado
  const getEditingStartTime = (): Date => {
    if (editingIntervalIndex.value === null || intervals.value.length === 0) {
      return new Date()
    }

    // Encontrar el intervalo anterior al que estamos editando
    let startTime = new Date(bedtimeDate.value)

    for (let i = 0; i < intervals.value.length; i++) {
      if (i === editingIntervalIndex.value) {
        break
      }
      const interval = intervals.value[i] as Interval
      startTime = new Date(interval.endTime)
    }

    return startTime
  }

  // Calcular tiempo de fin del intervalo editado
  const getEditingEndTime = (): Date => {
    const startTime = getEditingStartTime()
    const endTime = new Date(startTime)
    endTime.setHours(startTime.getHours() + editingIntervalHours.value)
    endTime.setMinutes(startTime.getMinutes() + editingIntervalMinutes.value)
    return endTime
  }

  // Ancho del espacio restante
  const getRemainingWidth = computed<number>(() => {
    if (totalTimeInBedMinutes.value === 0) return 0

    let totalRegisteredWithoutEditing = 0
    let totalRegisteredAll = 0

    intervals.value.forEach((interval, index) => {
      const intervalMinutes = interval.hours * 60 + interval.minutes
      totalRegisteredAll += intervalMinutes

      if (index !== editingIntervalIndex.value) {
        totalRegisteredWithoutEditing += intervalMinutes
      }
    })

    // Si estamos editando, calcular con el intervalo editado
    if (editingMode.value) {
      const editingMinutes =
        editingIntervalHours.value * 60 + editingIntervalMinutes.value
      const totalWithEditing = totalRegisteredWithoutEditing + editingMinutes
      const remaining = totalTimeInBedMinutes.value - totalWithEditing
      return Math.max(0, (remaining / totalTimeInBedMinutes.value) * 100)
    } else {
      // Si no estamos editando, mostrar espacio vacío
      const remaining = totalTimeInBedMinutes.value - totalRegisteredAll
      const previewMinutes =
        newInterval.value.hours * 60 + newInterval.value.minutes
      const available = remaining - previewMinutes
      return Math.max(0, (available / totalTimeInBedMinutes.value) * 100)
    }
  })

  // Actualizar intervalo
  const updateInterval = () => {
    if (editingIntervalIndex.value === null) return

    const newDuration =
      editingIntervalHours.value * 60 + editingIntervalMinutes.value

    // Validar que no exceda el tiempo total
    if (!validateIntervalDuration(editingIntervalIndex.value, newDuration)) {
      alert(
        `No puedes actualizar a ${formatDuration(newDuration)} porque excede el tiempo disponible.`
      )
      return
    }

    const interval = intervals.value[editingIntervalIndex.value] as Interval

    // Actualizar intervalo
    interval.state = editingIntervalState.value
    interval.hours = editingIntervalHours.value
    interval.minutes = editingIntervalMinutes.value

    // Recalcular todos los tiempos
    recalculateIntervalTimes()

    // Salir del modo edición
    cancelEditing()
  }

  // Ajustar duración
  const adjustDuration = (type: 'hours' | 'minutes', amount: number) => {
    if (editingMode.value) {
      if (type === 'hours') {
        editingIntervalHours.value = Math.max(
          0,
          Math.min(12, editingIntervalHours.value + amount)
        )
      } else {
        editingIntervalMinutes.value = Math.max(
          0,
          Math.min(55, editingIntervalMinutes.value + amount)
        )

        // Ajustar a múltiplos de 5 si es necesario
        if (editingIntervalMinutes.value % 5 !== 0) {
          if (amount > 0) {
            editingIntervalMinutes.value =
              Math.ceil(editingIntervalMinutes.value / 5) * 5
          } else {
            editingIntervalMinutes.value =
              Math.floor(editingIntervalMinutes.value / 5) * 5
          }
        }
      }
    } else {
      if (type === 'hours') {
        newInterval.value.hours = Math.max(
          0,
          Math.min(12, newInterval.value.hours + amount)
        )
      } else {
        newInterval.value.minutes = Math.max(
          0,
          Math.min(55, newInterval.value.minutes + amount)
        )

        // Ajustar a múltiplos de 5 si es necesario
        if (newInterval.value.minutes % 5 !== 0) {
          if (amount > 0) {
            newInterval.value.minutes =
              Math.ceil(newInterval.value.minutes / 5) * 5
          } else {
            newInterval.value.minutes =
              Math.floor(newInterval.value.minutes / 5) * 5
          }
        }
      }
    }
  }

  // Añadir intervalo
  const addInterval = () => {
    if (editingMode.value) {
      updateInterval()
      return
    }

    if (!canAddInterval.value) {
      const newDuration =
        newInterval.value.hours * 60 + newInterval.value.minutes
      if (newDuration > remainingTime.value) {
        alert(
          `No puedes añadir ${formatDuration(
            newDuration
          )} porque solo te quedan ${formatDuration(remainingTime.value)}`
        )
      }
      return
    }

    intervals.value.push({
      ...previewInterval.value,
      startTime: new Date(previewInterval.value.startTime),
      endTime: new Date(previewInterval.value.endTime),
    })

    resetAddInterval()

    // Recalcular tiempos
    recalculateIntervalTimes()
  }

  const removeInterval = (index: number) => {
    if (editingMode.value && editingIntervalIndex.value === index) {
      cancelEditing()
    }

    intervals.value.splice(index, 1)
    recalculateIntervalTimes()
  }

  // Recalcular tiempos de todos los intervalos después de una edición
  const recalculateIntervalTimes = () => {
    if (intervals.value.length === 0) return

    let currentTime = new Date(bedtimeDate.value)

    intervals.value.forEach(interval => {
      interval.startTime = new Date(currentTime)

      const endTime = new Date(currentTime)
      endTime.setHours(currentTime.getHours() + interval.hours)
      endTime.setMinutes(currentTime.getMinutes() + interval.minutes)
      interval.endTime = endTime

      currentTime = new Date(endTime)
    })
  }

  // Validar que no se exceda el tiempo total al editar
  const validateIntervalDuration = (
    index: number,
    newDuration: number
  ): boolean => {
    const totalRegistered = intervals.value.reduce((total, interval, i) => {
      if (i === index) return total + newDuration
      return total + (interval.hours * 60 + interval.minutes)
    }, 0)

    return totalRegistered <= totalTimeInBedMinutes.value
  }

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
