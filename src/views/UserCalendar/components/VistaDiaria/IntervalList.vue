<template>
  <div class="glass-card rounded-3xl p-6 flex flex-col gap-4 min-h-0 h-full">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h3 class="text-[#9dabb9] text-xs font-bold uppercase">
          Lista de Intervalos
        </h3>
        <p class="text-white/40 text-[10px] font-medium mt-1">
          {{ intervals.length }} segmentos registrados
        </p>
      </div>

      <!-- Botón de acción (solo visible si hay datos) -->
      <button
        class="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
        @click="handleEdit"
      >
        <span class="material-symbols-outlined text-base">edit_note</span>
        Editar Registro del Día
      </button>
    </div>

    <!-- Cabecera de la tabla (solo si hay datos) -->
    <div
      class="grid grid-cols-12 gap-4 px-2 pb-3 text-[10px] font-bold text-[#637381] uppercase tracking-widest"
    >
      <div class="col-span-5">horario</div>
      <div class="col-span-4">estado</div>
      <div class="col-span-3 text-right">duración</div>
    </div>

    <!-- Lista de intervalos (CON DATOS) -->
    <div class="divide-y divide-[#30363d]">
      <div
        v-for="(interval, index) in intervals"
        :key="index"
        class="grid grid-cols-12 gap-4 py-4 px-2 items-center group"
      >
        <!-- Horario -->
        <div class="col-span-5 font-mono text-sm text-white/90 tracking-tight">
          {{ formatTimeRange(interval.startTime, interval.endTime) }}
        </div>

        <!-- Estado con indicador de color -->
        <div class="col-span-4 flex items-center gap-3">
          <div
            class="size-1.5 rounded-full status-dot-glow"
            :class="getStateDotClass(interval.state)"
          ></div>
          <span
            class="text-xs font-semibold tracking-wider text-white uppercase"
          >
            {{ getStateLabel(interval.state) }}
          </span>
        </div>

        <!-- Duración -->
        <div class="col-span-3 text-right text-xs font-light text-[#9dabb9]">
          {{ formatDuration(interval.hours, interval.minutes) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { type Interval, SleepState } from '@/types/sleepReg.types'
  import { useRoute, useRouter } from 'vue-router'

  export interface IntervalListProps {
    /** Array de intervalos (puede ser vacío) */
    intervals: Interval[]
    /** Mensaje personalizado para estado vacío */
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

  // Determinar si hay datos
  const hasData = computed(() => {
    return props.intervals && props.intervals.length > 0
  })

  // Formatear rango de horas
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

  // Formatear duración
  const formatDuration = (hours: number, minutes: number): string => {
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  // Obtener label del estado
  const getStateLabel = (state: SleepState): string => {
    const labels: Record<SleepState, string> = {
      asleep: 'Dormido',
      awake: 'Despierto',
      inBed: 'En Cama',
    }
    return labels[state] || state
  }

  // Obtener clase del dot según estado
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
