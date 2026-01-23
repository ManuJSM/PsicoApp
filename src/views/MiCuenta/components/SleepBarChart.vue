<template>
  <div
    class="bg-white dark:bg-[#1a232e] border border-slate-200 dark:border-[#3b4754] rounded-xl p-6 flex flex-col h-[450px]"
  >
    <div class="flex flex-col mb-6">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-slate-700 dark:text-slate-300">
          {{ title }}
        </h3>
        <button
          v-if="showInfoButton"
          class="text-slate-400 hover:text-primary transition-colors"
          @click="$emit('info-click')"
        >
          <span class="material-symbols-outlined">info</span>
        </button>
      </div>
      <div class="flex gap-2 mt-2">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm bg-state-asleep"></span>
          <span class="text-[10px] text-slate-500 font-bold uppercase">
            Dormido
          </span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm bg-state-inbed"></span>
          <span class="text-[10px] text-slate-500 font-bold uppercase">
            En Cama
          </span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm bg-state-awake"></span>
          <span class="text-[10px] text-slate-500 font-bold uppercase">
            Despierto
          </span>
        </div>
      </div>
    </div>

    <div class="flex-1 flex items-end justify-between gap-2 px-2">
      <div
        v-for="(dayData, index) in chartData"
        :key="index"
        class="flex-1 flex flex-col items-center gap-2 h-full justify-end relative"
        @click="toggleTooltip(index)"
      >
        <div
          class="w-full flex flex-col-reverse rounded-t-lg cursor-pointer hover:brightness-110 overflow-hidden"
          :style="{ height: getTotalHeight(dayData) + '%' }"
        >
          <div
            v-for="(segment, segIndex) in dayData.segments"
            :key="segIndex"
            :class="getStateClass(segment.type)"
            :style="{
              height: getSegmentHeight(segment, dayData) + '%',
            }"
          ></div>
        </div>
        <span class="text-[10px] text-slate-400">{{ dayData.day }}</span>

        <!-- Tooltip del día completo -->
        <div
          v-if="activeTooltip === index"
          class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 z-50 shadow-xl min-w-[160px] border border-slate-700"
        >
          <div class="font-bold mb-1 text-center">{{ dayData.day }}</div>

          <!-- Tiempo Dormido -->
          <div class="flex justify-between items-center gap-3 mb-1">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-sm bg-state-asleep"></span>
              <span class="text-slate-300">Dormido:</span>
            </div>
            <span class="font-bold text-state-asleep">
              {{ formatDuration(getTimeByType(dayData.segments, 'asleep')) }}
            </span>
          </div>

          <!-- Tiempo en Cama -->
          <div class="flex justify-between items-center gap-3 mb-1">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-sm bg-state-inbed"></span>
              <span class="text-slate-300">En Cama:</span>
            </div>
            <span class="font-bold text-state-inbed">
              {{ formatDuration(getTimeByType(dayData.segments, 'inBed')) }}
            </span>
          </div>

          <!-- Tiempo Despierto -->
          <div class="flex justify-between items-center gap-3">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-sm bg-state-awake"></span>
              <span class="text-slate-300">Despierto:</span>
            </div>
            <span class="font-bold text-state-awake">
              {{ formatDuration(getTimeByType(dayData.segments, 'awake')) }}
            </span>
          </div>

          <!-- Total -->
          <div class="mt-2 pt-2 border-t border-slate-700">
            <div class="flex justify-between">
              <span class="text-slate-300">Total:</span>
              <span class="font-bold">{{
                formatDuration(getTotalTime(dayData))
              }}</span>
            </div>
          </div>

          <div
            class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getStateClass } from '@/views/UserEditReg/utils/css.util'
  import { ref } from 'vue'

  // Tipos
  type SegmentType = 'asleep' | 'inBed' | 'awake'

  interface ChartSegment {
    value: number // en minutos
    type: SegmentType
  }

  interface ChartDayData {
    day: string
    segments: ChartSegment[]
  }

  // Props
  defineProps({
    title: {
      type: String,
      default: 'Uso del Tiempo en Cama',
    },
    chartData: {
      type: Array<ChartDayData[]>,
      required: true,
    },
    showInfoButton: {
      type: Boolean,
      default: true,
    },
  })

  defineEmits(['info-click'])

  // Estado reactivo para tooltips - SIMPLE
  const activeTooltip = ref<number | null>(null)

  // Métodos
  const getTotalHeight = (dayData: ChartDayData): number => {
    const totalMinutes = getTotalTime(dayData)
    // Normalizar a porcentaje entre 70-100% (basado en 12 horas máximo)
    const maxHours = 12 * 60
    return Math.min(100, 70 + (totalMinutes / maxHours) * 30)
  }

  const getSegmentHeight = (
    segment: ChartSegment,
    dayData: ChartDayData
  ): number => {
    const totalMinutes = getTotalTime(dayData)
    if (totalMinutes === 0) return 0
    return (segment.value / totalMinutes) * 100
  }

  const getTimeByType = (
    segments: ChartSegment[],
    type: SegmentType
  ): number => {
    return segments
      .filter(segment => segment.type === type)
      .reduce((total, segment) => total + segment.value, 0)
  }

  const getTotalTime = (dayData: ChartDayData): number => {
    return dayData.segments.reduce((total, segment) => total + segment.value, 0)
  }

  const formatDuration = (minutes: number): string => {
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

  // Control de tooltips - SIMPLE: solo clic
  const toggleTooltip = (index: number) => {
    // Si ya está activo, lo cierra; si no, lo abre
    activeTooltip.value = activeTooltip.value === index ? null : index
  }
</script>
