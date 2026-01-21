<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-2 xl:gap-6">
    <!-- Panel izquierdo: Añadir intervalo -->
    <div class="lg:col-span-4">
      <div
        class="bg-card-dark border border-border-dark rounded-xl p-4 shadow-sm"
      >
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
        <button
          @click="addInterval"
          :disabled="!canAddInterval"
          :class="[
            'w-full mt-2 rounded-xl p-4 flex items-center justify-center gap-3 transition-all shadow-lg',
            canAddInterval
              ? 'bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white cursor-pointer hover:shadow-xl hover:shadow-primary/20'
              : 'bg-linear-to-r from-slate-800 to-slate-900 text-slate-500 cursor-not-allowed',
          ]"
        >
          <div class="flex items-center gap-3">
            <div
              :class="[
                'h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-sm',
                canAddInterval ? 'bg-white/20' : 'bg-slate-700/50',
              ]"
            >
              <span class="material-symbols-outlined text-xl"> add </span>
            </div>
            <div class="text-left">
              <p class="font-bold text-sm">
                {{ canAddInterval ? 'Añadir intervalo' : '' }}
              </p>
              <p class="text-xs opacity-90"></p>
            </div>
          </div>

          <span
            v-if="canAddInterval"
            class="ml-auto bg-white/20 px-3 py-1 rounded-full text-xs font-bold"
          >
            {{ formatTime(previewInterval.startTime) }} ->
            {{ formatTime(previewInterval.endTime) }}
          </span>
        </button>
      </div>

      <!-- Nota -->
      <section
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
      </section>
    </div>

    <!-- Panel derecho: Visualización y lista - NUEVO LAYOUT -->
    <div class="lg:col-span-8 space-y-2">
      <!-- NUEVA LÍNEA DE TIEMPO -->
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
                      'h-full rounded-full timeline-pill flex items-center justify-center transition-all cursor-pointer hover:scale-105',
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
                      'h-full rounded-full timeline-pill flex items-center justify-center  scale-110 z-10 cursor-pointer',
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
          <div class="grid grid-cols-2 items-center gap-3">
            <div
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
              class="flex items-center justify-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full"
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
              'w-full h-14 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm',
              editingMode
                ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
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

          <!-- Botón de cancelar edición -->
          <button
            v-if="editingMode"
            @click="cancelEditing()"
            class="w-full h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span class="material-symbols-outlined text-base">close</span>
            Cancelar Edición
          </button>
        </div>
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
              'group bg-card-dark border rounded-xl p-4 shadow-sm transition-colors flex items-center justify-between cursor-pointer',
              index === intervals.length - 1
                ? 'border-state-asleep/40 bg-state-asleep/2'
                : 'border-border-dark hover:border-' +
                  getStateHoverClass(interval.state),
              editingIntervalIndex === index
                ? 'ring-2 ring-green-500 ring-offset-1'
                : '',
            ]"
            @click="selectIntervalForEditing(index)"
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
                @click.stop="removeInterval(index)"
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
  import sleepStateConfig from '../../utils/css.util'
  import {
    formatTime12Hour,
    formatDuration,
    formatIntervalDuration,
    formatTime,
  } from '@/views/UserEditReg/utils/time.util'
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
  const formattedBedtime = computed(() => formatTime12Hour(bedtimeDate.value))

  // Formatear hora de levantado
  const formattedWakeup = computed(() => formatTime12Hour(wakeupDate.value))

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

    // Resetear el preview de añadir
    newInterval.value = { state: 'inBed', hours: 0, minutes: 0 }
  }

  // Cancelar edición
  const cancelEditing = () => {
    editingMode.value = false
    editingIntervalIndex.value = null
    editingIntervalHours.value = 0
    editingIntervalMinutes.value = 0
    editingIntervalState.value = 'inBed'

    // Resetear el preview de añadir
    newInterval.value = { state: 'inBed', hours: 0, minutes: 0 }
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

    // Resetear valores
    newInterval.value = { state: 'asleep', hours: 0, minutes: 0 }

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
