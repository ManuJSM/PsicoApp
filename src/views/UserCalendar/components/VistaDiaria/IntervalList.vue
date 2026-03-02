<template>
  <div
    class="bg-card-dark rounded-2xl border h-full border-border-dark shadow-2xl overflow-hidden flex flex-col"
  >
    <div
      class="px-6 py-5 border-b border-border-dark/50 bg-white/2 flex items-center gap-4 justify-between"
    >
      <div class="flex items-center gap-3">
        <div
          class="h-5 w-1 bg-primary rounded-full shadow-[0_0_10px_#137fec]"
        ></div>
        <div>
          <h3
            class="text-white text-[10px] font-black uppercase tracking-[0.2em]"
          >
            Lista de Intervalos
          </h3>
          <p
            class="text-slate-500 text-[9px] font-bold mt-0.5 uppercase tracking-tighter"
          >
            {{ intervals.length }} segmentos registrados
          </p>
        </div>
      </div>

      <button
        v-if="hasData"
        @click="handleEdit"
        class="flex items-center gap-2 px-2 py-2 bg-primary/10 border border-primary/20 rounded-xl text-[9px] font-black text-primary uppercase tracking-widest transition-all cursor-pointer shadow-sm"
      >
        <span class="material-symbols-outlined text-sm">edit_note</span>
        Editar Registro
      </button>
    </div>

    <div
      v-if="hasData"
      class="grid grid-cols-12 gap-4 px-8 py-3 bg-black/20 border-b border-border-dark/30 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]"
    >
      <div class="col-span-5">Horario</div>
      <div class="col-span-4">Estado</div>
      <div class="col-span-3 text-right">Duración</div>
    </div>

    <div class="divide-y divide-border-dark/20">
      <div
        v-for="(interval, index) in intervals"
        :key="index"
        class="grid grid-cols-12 gap-4 py-4 px-8 items-center"
      >
        <div class="col-span-5 font-mono text-xs text-slate-200 tracking-tight">
          {{ formatTimeRange(interval.startTime, interval.endTime) }}
        </div>

        <div class="col-span-4 flex items-center gap-3">
          <div
            class="size-1.5 rounded-full status-dot-glow transition-all duration-500 group-hover:scale-125"
            :class="getStateDotClass(interval.state)"
          ></div>
          <span
            class="text-[10px] font-black tracking-widest text-white uppercase opacity-80 group-hover:opacity-100"
          >
            {{ getStateLabel(interval.state) }}
          </span>
        </div>

        <div
          class="col-span-3 text-right text-[11px] font-bold text-slate-500 group-hover:text-primary transition-colors"
        >
          {{ formatDuration(interval.hours, interval.minutes) }}
        </div>
      </div>

      <div
        v-if="!hasData"
        class="p-12 flex flex-col items-center justify-center text-center"
      >
        <span class="material-symbols-outlined text-slate-700 text-4xl mb-3"
          >database_off</span
        >
        <p class="text-slate-500 text-xs font-medium italic">
          {{ emptyMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { type Interval, SleepState } from '@/types/sleepReg.types'
  import { useRoute, useRouter } from 'vue-router'

  export interface IntervalListProps {
    intervals: Interval[]
    emptyMessage?: string
  }

  const props = withDefaults(defineProps<IntervalListProps>(), {
    emptyMessage: 'Parece que no hay datos técnicos para este periodo.',
  })

  const router = useRouter()
  const route = useRoute()

  function handleEdit() {
    router.push(`${route.path}/form`)
  }

  const hasData = computed(() => {
    return props.intervals && props.intervals.length > 0
  })

  const formatTimeRange = (start: Date, end: Date): string => {
    const startStr = start.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const endStr = end.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    return `${startStr} — ${endStr}`
  }

  const formatDuration = (hours: number, minutes: number): string => {
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const getStateLabel = (state: SleepState): string => {
    const labels: Record<SleepState, string> = {
      asleep: 'Dormido',
      awake: 'Despierto',
      inBed: 'En Cama',
    }
    return labels[state] || state
  }

  const getStateDotClass = (state: SleepState): string => {
    const classes: Record<SleepState, string> = {
      asleep: 'bg-state-asleep text-state-asleep',
      awake: 'bg-state-awake text-state-awake',
      inBed: 'bg-state-inbed text-state-inbed',
    }
    return classes[state]
  }
</script>

<style scoped>
  .status-dot-glow {
    box-shadow: 0 0 8px currentColor;
  }
</style>
