<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import type { TimeValue } from '@/types/regEdit.types'

  const ITEM_HEIGHT = 48
  const HOURS: number[] = Array.from({ length: 12 }, (_, i) => i + 1) // 1-12
  const MINUTES: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

  interface TimeState {
    hour: number
    minute: number
    amPm: 'am' | 'pm'
    hoursScroll: number
    minutesScroll: number
  }

  interface TouchState {
    startY: number
    currentY: number
    isScrolling: boolean
  }

  interface WheelType {
    bedtimeHours: TouchState
    bedtimeMinutes: TouchState
  }
  const props = defineProps<{
    title: string
    time: TimeValue
  }>()

  const emit = defineEmits<{
    (e: 'update:time', time: TimeValue): void
  }>()

  const emitUpdate = () => {
    emit('update:time', {
      hour: bedtime.value.hour,
      minute: bedtime.value.minute,
      amPm: bedtime.value.amPm,
    })
  }

  const bedtime = ref<TimeState>({
    ...props.time,
    hoursScroll: 0,
    minutesScroll: 0,
  })

  const onBedtimeHoursWheel = (e: WheelEvent): void => {
    const delta = e.deltaY > 0 ? 1 : -1
    const currentIndex = hours.indexOf(bedtime.value.hour)
    const newIndex = Math.max(
      0,
      Math.min(hours.length - 1, currentIndex + delta)
    )
    setBedtimeHour(hours[newIndex] as number)
  }

  const touchData = ref<WheelType>({
    bedtimeHours: { startY: 0, currentY: 0, isScrolling: false },
    bedtimeMinutes: { startY: 0, currentY: 0, isScrolling: false },
  })

  const hours = HOURS
  const minutes = MINUTES

  onMounted(() => {
    updateScrollPositions()
  })

  const setBedtimeHour = (hour: number): void => {
    bedtime.value.hour = hour
    updateScrollPositions()
    emitUpdate()
  }

  const setBedtimeMinute = (minute: number): void => {
    bedtime.value.minute = minute
    updateScrollPositions()
    emitUpdate()
  }

  const setBedtimeAmPm = (amPm: 'am' | 'pm'): void => {
    bedtime.value.amPm = amPm
    emitUpdate()
  }

  const adjustBedtime = (minutesToAdd: number): void => {
    const date = new Date()
    date.setHours(
      bedtime.value.amPm === 'pm' ? bedtime.value.hour + 12 : bedtime.value.hour
    )
    date.setMinutes(bedtime.value.minute + minutesToAdd)

    // Ajustar si pasa de medianoche
    const newHour = date.getHours() % 12 || 12
    const newMinute = date.getMinutes()
    const newAmPm = date.getHours() >= 12 ? 'pm' : 'am'

    // Encontrar el minuto más cercano en nuestra lista
    const closestMinute = minutes.reduce((prev, curr) =>
      Math.abs(curr - newMinute) < Math.abs(prev - newMinute) ? curr : prev
    )

    bedtime.value.hour = newHour
    bedtime.value.minute = closestMinute
    bedtime.value.amPm = newAmPm
    updateScrollPositions()
    emitUpdate()
  }

  // Funcion para scroll (desktop)
  const onBedtimeMinutesWheel = (e: WheelEvent): void => {
    const direction = e.deltaY > 0 ? 1 : -1
    const currentIndex = minutes.indexOf(bedtime.value.minute)
    const newIndex = Math.max(
      0,
      Math.min(minutes.length - 1, currentIndex + direction)
    )
    setBedtimeMinute(minutes[newIndex] as number)
  }

  // Funciones de touch para móviles
  const startTouch = (wheelType: keyof WheelType, e: TouchEvent): void => {
    const touch = e.touches[0]
    if (!touch) return

    touchData.value[wheelType].startY = touch.clientY
    touchData.value[wheelType].currentY = touch.clientY
    touchData.value[wheelType].isScrolling = true
  }

  const onTouchMove = (wheelType: keyof WheelType, e: TouchEvent): void => {
    if (!touchData.value[wheelType].isScrolling) return

    e.preventDefault()
    const touch = e.touches[0]
    if (!touch) return

    touchData.value[wheelType].currentY = touch.clientY

    // Calcular delta
    const delta =
      touchData.value[wheelType].currentY - touchData.value[wheelType].startY

    // Actualizar basado en el tipo de rueda
    if (Math.abs(delta) > ITEM_HEIGHT / 2) {
      const direction = delta < 0 ? 1 : -1

      if (wheelType === 'bedtimeHours') {
        const currentIndex = hours.indexOf(bedtime.value.hour)
        const newIndex = Math.max(
          0,
          Math.min(hours.length - 1, currentIndex + direction)
        )
        setBedtimeHour(hours[newIndex] as number)
        touchData.value[wheelType].startY = touchData.value[wheelType].currentY
      } else if (wheelType === 'bedtimeMinutes') {
        const currentIndex = minutes.indexOf(bedtime.value.minute)
        const newIndex = Math.max(
          0,
          Math.min(minutes.length - 1, currentIndex + direction)
        )
        setBedtimeMinute(minutes[newIndex] as number)
        touchData.value[wheelType].startY = touchData.value[wheelType].currentY
      }
    }
  }

  const endTouch = (wheelType: keyof WheelType): void => {
    touchData.value[wheelType].isScrolling = false
  }

  // Actualizar posiciones de scroll
  const VISIBLE_ITEMS = 5 // 2 arriba + 1 centro + 2 abajo
  const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2) // 2

  const updateScrollPositions = (): void => {
    const hourIndex = hours.indexOf(bedtime.value.hour)
    const minuteIndex = minutes.indexOf(bedtime.value.minute)

    if (hourIndex !== -1) {
      bedtime.value.hoursScroll = -(hourIndex - CENTER_INDEX) * ITEM_HEIGHT
    }

    if (minuteIndex !== -1) {
      bedtime.value.minutesScroll = -(minuteIndex - CENTER_INDEX) * ITEM_HEIGHT
    }
  }

  // Clases para resaltar el elemento seleccionado
  const getBedtimeHourClass = (hour: number): string => {
    if (hour === bedtime.value.hour) return 'text-white text-3xl font-black'
    const hourIndex = hours.indexOf(hour)
    const selectedIndex = hours.indexOf(bedtime.value.hour)
    const distance = Math.abs(hourIndex - selectedIndex)
    if (distance === 1) return 'text-slate-500 text-xl'
    return 'text-slate-600 text-lg'
  }

  const getBedtimeMinuteClass = (minute: number): string => {
    if (minute === bedtime.value.minute) return 'text-white text-3xl font-black'
    const minuteIndex = minutes.indexOf(minute)
    const selectedIndex = minutes.indexOf(bedtime.value.minute)
    const distance = Math.abs(minuteIndex - selectedIndex)
    if (distance === 1) return 'text-slate-500 text-xl'
    return 'text-slate-600 text-lg'
  }
</script>

<style scoped>
  .time-wheel-container {
    height: 240px;
    overflow: hidden;
    position: relative;
  }

  .time-wheel-scroll {
    transition: transform 0.3s ease;
  }

  .time-wheel-item {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    user-select: none;
  }

  .time-wheel-item:hover {
    transform: scale(1.1);
  }

  /* Para navegadores WebKit (Chrome, Safari) */
  .time-wheel-container::-webkit-scrollbar {
    display: none;
  }

  .time-wheel-container {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  /* Mejoras táctiles para móviles */
  .time-wheel-item:active {
    transform: scale(0.95);
  }
</style>

<template>
  <div class="flex flex-col items-center">
    <span
      class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6"
      >{{ title }}</span
    >
    <div
      class="flex bg-background-dark p-1 rounded-lg border border-border-dark mb-6"
    >
      <button
        @click="setBedtimeAmPm('am')"
        :class="[
          'px-4 py-1 text-xs font-bold rounded transition-colors',
          bedtime.amPm === 'am'
            ? 'bg-border-dark text-white'
            : 'text-slate-500 hover:text-white',
        ]"
      >
        AM
      </button>
      <button
        @click="setBedtimeAmPm('pm')"
        :class="[
          'px-4 py-1 text-xs font-bold rounded transition-colors',
          bedtime.amPm === 'pm'
            ? 'bg-border-dark text-white'
            : 'text-slate-500 hover:text-white',
        ]"
      >
        PM
      </button>
    </div>
    <div class="relative w-full max-w-[200px] mb-6">
      <div class="absolute inset-x-0"></div>
      <div class="grid grid-cols-2 gap-0 relative z-10">
        <!-- Horas -->
        <div
          class="time-wheel-container text-center"
          ref="bedtimeHoursRef"
          @wheel.prevent="onBedtimeHoursWheel"
          @touchstart="startTouch('bedtimeHours', $event)"
          @touchmove="onTouchMove('bedtimeHours', $event)"
          @touchend="endTouch('bedtimeHours')"
        >
          <div
            class="time-wheel-scroll"
            :style="{
              transform: `translateY(${bedtime.hoursScroll}px)`,
            }"
          >
            <div
              v-for="(hour, index) in hours"
              :key="index"
              @click="setBedtimeHour(hour)"
              :class="[
                'time-wheel-item cursor-pointer  select-none',
                getBedtimeHourClass(hour),
              ]"
            >
              {{ hour.toString().padStart(2, '0') }}
            </div>
          </div>
        </div>
        <!-- Minutos -->
        <div
          class="time-wheel-container text-center border-l border-border-dark/30"
          ref="bedtimeMinutesRef"
          @wheel.prevent="onBedtimeMinutesWheel"
          @touchstart="startTouch('bedtimeMinutes', $event)"
          @touchmove="onTouchMove('bedtimeMinutes', $event)"
          @touchend="endTouch('bedtimeMinutes')"
        >
          <div
            class="time-wheel-scroll"
            :style="{
              transform: `translateY(${bedtime.minutesScroll}px)`,
            }"
          >
            <div
              v-for="(minute, index) in minutes"
              :key="index"
              @click="setBedtimeMinute(minute)"
              :class="[
                'time-wheel-item cursor-pointer select-none',
                getBedtimeMinuteClass(minute),
              ]"
            >
              {{ minute.toString().padStart(2, '0') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-2 w-full">
      <button
        @click="adjustBedtime(-15)"
        class="flex-1 bg-background-dark border border-border-dark py-2 rounded-lg text-xs font-bold hover:bg-border-dark transition-colors text-slate-400 hover:text-white"
      >
        - 15m
      </button>
      <button
        @click="adjustBedtime(15)"
        class="flex-1 bg-background-dark border border-border-dark py-2 rounded-lg text-xs font-bold hover:bg-border-dark transition-colors text-slate-400 hover:text-white"
      >
        + 15m
      </button>
    </div>
  </div>
</template>
