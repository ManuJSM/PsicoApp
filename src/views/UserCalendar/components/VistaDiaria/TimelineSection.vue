<template>
  <div
    class="bg-card-dark rounded-2xl border border-border-dark p-6 flex flex-col h-full"
  >
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4"
    >
      <div>
        <div class="flex items-center gap-2 mb-0.5">
          <div class="h-4 w-1 bg-primary rounded-full"></div>
          <h3
            class="text-white text-[16px] font-black uppercase tracking-[0.15em]"
          >
            Timeline del Sueño
          </h3>
        </div>
      </div>

      <div
        class="flex items-center w-full md:w-auto justify-center gap-4"
        :class="{ 'opacity-30': !hasData }"
      >
        <div
          v-for="item in legendItems"
          :key="item.label"
          class="flex items-center gap-1.5"
        >
          <div
            class="size-2.5 rounded-full shadow-sm"
            :class="hasData ? item.colorClass : 'bg-slate-700'"
          ></div>
          <span
            class="text-[9px] text-slate-400 font-bold uppercase tracking-widest"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center">
      <SleepTimeline
        v-if="hasData && bedtimeDate && wakeupDate"
        :intervals="intervals"
        :bedtime-date="bedtimeDate"
        :wakeup-date="wakeupDate"
      />
    </div>

    <div class="mt-4 pt-4 border-t border-border-dark/30">
      <p
        class="text-[10px] text-slate-500 italic leading-tight text-center md:text-left"
      >
        {{ footerText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import SleepTimeline from '@/views/UserEditReg/components/Step3/components/SleepTimeline.vue'
  import { computed } from 'vue'
  import type { Interval } from '@/types/sleepReg.types'

  export interface SleepArchitectureProps {
    intervals: Interval[]
    bedtimeDate?: Date | null
    wakeupDate?: Date | null
    emptyMessage?: string
    footerText?: string
  }

  const props = withDefaults(defineProps<SleepArchitectureProps>(), {
    bedtimeDate: null,
    wakeupDate: null,
    emptyMessage: 'Sin actividad registrada',
    footerText:
      'El gráfico representa los estados técnicos registrados por el dispositivo médico durante el ciclo completo.',
  })

  // Leyenda usando TUS clases exactas
  const legendItems = [
    { label: 'Dormido', colorClass: 'bg-state-asleep' },
    { label: 'En Cama', colorClass: 'bg-state-inbed' },
    { label: 'Fuera', colorClass: 'bg-state-awake' },
  ]

  const hasData = computed(() => {
    return props.intervals && props.intervals.length > 0
  })
</script>
