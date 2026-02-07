<template>
  <div class="relative pt-2 pb-2">
    <!-- Línea de tiempo dinámica -->
    <div class="h-8 w-full flex p-1 gap-1 mb-1">
      <div
        v-for="(interval, index) in intervals"
        :key="index"
        :class="[
          'h-full timeline-pill',
          getStateClass(interval.state),
          'rounded-full',
        ]"
        :style="{
          width: getIntervalWidth(interval, totalTiempoEnCama) + '%',
        }"
      ></div>
    </div>
    <div
      class="flex justify-between text-[10px] font-bold text-slate-500 uppercase px-1"
    >
      <span>{{ formatTime(bedtimeDate) }}</span>
      <span>{{ formatTime(wakeupDate) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { Interval } from '@/types/sleepReg.types'
  import { getIntervalWidth } from '@/views/UserEditReg/utils/bar.util'
  import { getStateClass } from '@/views/UserEditReg/utils/css.util'
  import { formatTime } from '@/views/UserEditReg/utils/time.util'

  interface Props {
    intervals: Interval[]
    bedtimeDate: Date
    wakeupDate: Date
  }

  const props = defineProps<Props>()

  // Calcular tiempo total en cama
  const totalTiempoEnCama = computed(() => {
    const diffMs = props.wakeupDate.getTime() - props.bedtimeDate.getTime()
    return Math.floor(diffMs / 60000)
  })
</script>

<style scoped>
  .timeline-pill {
    transition: all 0.3s ease;
  }
</style>
