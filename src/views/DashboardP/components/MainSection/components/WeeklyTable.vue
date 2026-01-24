<template>
  <div class="bg-card-dark rounded-xl border border-white/10 p-6 shadow-2xl">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-bold text-white">{{ title }}</h3>
      <button
        v-if="showExportButton"
        class="text-xs font-bold text-primary flex items-center gap-1 hover:underline hover:opacity-80 transition-all"
        @click="$emit('export-csv')"
      >
        <span class="material-symbols-outlined text-sm!">download</span>
        {{ exportButtonText }}
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr
            class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-white/10"
          >
            <th class="pb-3 px-3">Fecha</th>
            <th class="pb-3 px-3">Estado</th>
            <th class="pb-3 px-3 text-right">Eficiencia</th>
            <th class="pb-3 px-3 text-right"></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, index) in rows"
            :key="index"
            class="border-b border-white/5 hover:bg-white/3 transition-all duration-200 cursor-pointer group"
            @click="$emit('row-click', row)"
          >
            <!-- Fecha -->
            <td class="px-3 py-4">
              <div class="flex flex-col">
                <span
                  class="text-sm font-semibold text-white group-hover:text-primary transition-colors"
                >
                  {{ formatDate(row.date) }}
                </span>
                <span class="text-[11px] text-slate-500 mt-0.5">
                  {{ formatWeekday(row.date) }}
                </span>
              </div>
            </td>

            <!-- Estado -->
            <td class="px-3 py-4">
              <div class="flex items-center gap-2.5">
                <div class="relative">
                  <span
                    class="size-3 rounded-full block"
                    :class="getStatusColorClass(row.efficiency)"
                  ></span>
                  <span
                    v-if="row.isLive"
                    class="absolute -top-0.5 -right-0.5 size-1.5 bg-red-500 rounded-full border border-card-dark dot-pulse"
                  ></span>
                </div>
                <div class="flex flex-col">
                  <span
                    class="text-sm font-medium"
                    :class="getStatusTextColorClass(row.efficiency)"
                  >
                    {{ getStatusLabel(row.efficiency) }}
                  </span>
                  <span class="text-[11px] text-slate-500">
                    {{ getStatusDescription(row.efficiency) }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Eficiencia -->
            <td class="px-3 py-4 text-right">
              <div class="flex flex-col items-end">
                <span
                  class="text-lg font-bold tracking-tight"
                  :class="getEfficiencyColorClass(row.efficiency)"
                >
                  {{ row.efficiency }}%
                </span>
                <div
                  class="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1.5"
                >
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="getStatusColorClass(row.efficiency)"
                    :style="{ width: `${Math.min(row.efficiency, 100)}%` }"
                  ></div>
                </div>
              </div>
            </td>

            <!-- Indicador Live/En curso -->
            <td class="py-4">
              <div class="flex items-center justify-end gap-2">
                <div v-if="row.isLive" class="flex items-center gap-1.5">
                  <div class="size-1.5 bg-red-500 rounded-full dot-pulse"></div>
                </div>
              </div>
            </td>
          </tr>

          <!-- Mensaje si no hay datos -->
          <tr v-if="rows.length === 0">
            <td colspan="4" class="px-3 py-12 text-center">
              <div class="flex flex-col items-center justify-center">
                <span
                  class="material-symbols-outlined text-3xl text-slate-600 mb-3"
                >
                  sentiment_dissatisfied
                </span>
                <p class="text-slate-500 font-medium">{{ emptyMessage }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Interfaces
  interface SleepRecord {
    date: Date
    efficiency: number
    isLive?: boolean
  }

  interface SleepTableProps {
    title?: string
    rows?: SleepRecord[]
    showExportButton?: boolean
    exportButtonText?: string
    emptyMessage?: string
  }

  // Props
  withDefaults(defineProps<SleepTableProps>(), {
    title: 'Registros Diarios',
    rows: () => [],
    showExportButton: true,
    exportButtonText: 'Exportar CSV',
    emptyMessage: 'No hay registros para mostrar',
  })

  // Emits
  defineEmits<{
    'export-csv': []
    'row-click': [row: SleepRecord]
  }>()

  // Métodos
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    })
  }

  const formatWeekday = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
    })
  }

  // Determinar estado basado en eficiencia
  const getStatusLabel = (efficiency: number): string => {
    if (efficiency >= 90) return 'Excelente'
    if (efficiency >= 80) return 'Bueno'
    if (efficiency >= 70) return 'Regular'
    if (efficiency >= 60) return 'Deficiente'
    return 'Malo'
  }

  const getStatusDescription = (efficiency: number): string => {
    if (efficiency >= 90) return 'Sueño óptimo'
    if (efficiency >= 80) return 'Descanso adecuado'
    if (efficiency >= 70) return 'Sueño fragmentado'
    if (efficiency >= 60) return 'Descanso insuficiente'
    return 'Necesita atención'
  }

  const getStatusColorClass = (efficiency: number): string => {
    if (efficiency >= 90)
      return 'bg-gradient-to-r from-emerald-500 to-emerald-400'
    if (efficiency >= 80) return 'bg-gradient-to-r from-green-500 to-green-400'
    if (efficiency >= 70) return 'bg-gradient-to-r from-amber-500 to-amber-400'
    if (efficiency >= 60)
      return 'bg-gradient-to-r from-orange-500 to-orange-400'
    return 'bg-gradient-to-r from-red-500 to-red-400'
  }

  const getStatusTextColorClass = (efficiency: number): string => {
    if (efficiency >= 90) return 'text-emerald-400'
    if (efficiency >= 80) return 'text-green-400'
    if (efficiency >= 70) return 'text-amber-400'
    if (efficiency >= 60) return 'text-orange-400'
    return 'text-red-400'
  }

  const getEfficiencyColorClass = (efficiency: number): string => {
    if (efficiency >= 90) return 'text-emerald-300'
    if (efficiency >= 80) return 'text-green-300'
    if (efficiency >= 70) return 'text-amber-300'
    if (efficiency >= 60) return 'text-orange-300'
    return 'text-red-300'
  }
</script>

<style scoped>
  tr {
    position: relative;
  }

  tr::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
  }

  tr:last-child::after {
    display: none;
  }

  tr:hover {
    background: linear-gradient(
      90deg,
      rgba(59, 130, 246, 0.03) 0%,
      rgba(59, 130, 246, 0.01) 100%
    );
  }

  .dot-pulse {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
