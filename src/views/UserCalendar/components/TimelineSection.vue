<!-- SleepArchitecture.vue -->
<template>
  <div class="glass-card h-full flex flex-col justify-center rounded-3xl p-6">
    <!-- Header -->
    <div
      class="flex justify-center flex-col md:flex-row items-center md:justify-between mb-2"
    >
      <div>
        <h3
          class="text-[#9dabb9] text-xs text-center font-bold uppercase tracking-widest"
        >
          Timeline del Sueño
        </h3>
        <p class="text-white text-xl font-bold">Visualizador de 24 Horas</p>
      </div>

      <!-- Leyenda -->
      <div class="flex gap-6" :class="{ 'opacity-30': !hasData }">
        <div
          v-for="item in legendItems"
          :key="item.label"
          class="flex items-center gap-2"
        >
          <div
            class="size-3 rounded-full"
            :class="hasData ? item.colorClass : 'bg-technical-divider'"
          ></div>
          <span
            class="text-[10px] text-[#9dabb9] font-bold uppercase tracking-tighter"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- Timeline con SleepTimeline -->
    <div class="w-full mb-2">
      <!-- Horas del día (24h) -->
      <div
        class="flex mb-2 border-b pb-2"
        :class="
          hasData
            ? 'text-[#9dabb9] border-glass-border'
            : 'text-[#9dabb9]/40 border-glass-border/30'
        "
      ></div>

      <SleepTimeline
        v-if="hasData && bedtimeDate && wakeupDate"
        :intervals="intervals"
        :bedtime-date="bedtimeDate"
        :wakeup-date="wakeupDate"
      />

      <!-- Estado vacío (si no hay datos) -->
      <div
        v-else
        class="relative w-full h-24 bg-background-dark/30 rounded-2xl overflow-hidden border border-glass-border/30 flex items-center justify-center"
      >
        <div class="absolute inset-x-0 h-px bg-technical-divider mx-4"></div>
        <span
          class="text-technical-divider text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"
        >
          {{ emptyMessage }}
        </span>
      </div>
    </div>
    <!-- Nota al pie (personalizable según estado) -->
    <p
      class="text-xs text-center italic"
      :class="hasData ? 'text-[#9dabb9]' : 'text-[#9dabb9]/50'"
    >
      {{ footerText }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import SleepTimeline from '@/views/UserEditReg/components/Step3/components/SleepTimeline.vue'
  import { computed } from 'vue'
  import type { Interval } from '@/types/sleepReg.types'

  export type SleepState = 'asleep' | 'awake' | 'inBed' | 'out'

  export interface SleepArchitectureProps {
    /** Intervalos de sueño (puede ser array vacío o null) */
    intervals: Interval[]
    /** Fecha de inicio (acostarse) - opcional, si no hay datos no se usa */
    bedtimeDate?: Date | null
    /** Fecha de fin (despertar) - opcional, si no hay datos no se usa */
    wakeupDate?: Date | null
    /** Mensaje personalizado para estado vacío */
    emptyMessage?: string
    /** Texto personalizado para el footer */
    footerText?: string
  }

  const props = withDefaults(defineProps<SleepArchitectureProps>(), {
    bedtimeDate: null,
    wakeupDate: null,
    emptyMessage: 'Sin actividad registrada',
    footerText:
      'El gráfico representa los estados técnicos registrados por el dispositivo médico durante el ciclo completo.',
  })

  // Items de la leyenda
  const legendItems = [
    { label: 'Dormido', colorClass: 'bg-state-asleep' },
    { label: 'En Cama', colorClass: 'bg-state-inbed' },
    { label: 'Fuera', colorClass: 'bg-state-awake' },
  ]

  // Determinar si hay datos (array no vacío)
  const hasData = computed(() => {
    return props.intervals && props.intervals.length > 0
  })
</script>
