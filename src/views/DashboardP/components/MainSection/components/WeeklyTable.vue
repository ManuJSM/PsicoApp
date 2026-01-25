<template>
  <div class="bg-card-dark rounded-xl border border-white/10 p-4 shadow-2xl">
    <div class="flex items-center justify-between mb-6 px-2">
      <div>
        <h3 class="text-sm font-bold text-white uppercase tracking-tight">
          {{ title }}
        </h3>
      </div>
      <button
        v-if="showExportButton"
        class="text-sm font-bold text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors"
        @click="$emit('export')"
      >
        <span class="material-symbols-outlined text-sm!">download</span>
        EXPORTAR
      </button>
    </div>

    <div class="flex flex-col gap-2 justify-around">
      <!-- Header -->
      <div
        class="flex items-center px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight border-b border-white/10 mb-2"
      >
        <div class="w-24">Fecha</div>
        <div class="flex-1 px-6"></div>
        <div class="w-20 text-center">Eficiencia</div>
        <div class="w-16 text-right">Acción</div>
      </div>

      <div
        v-for="(record, index) in processedRecords"
        :key="index"
        @click="$emit('view', index)"
        class="flex items-center border border-white/10 cursor-pointer px-4 py-3 hover:bg-white/5 transition-colors group relative"
      >
        <!-- Indicador lateral por eficiencia -->
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
          :class="getEfficiencyColor(record.efficiency).border"
        ></div>

        <!-- Fecha -->
        <div class="w-24 shrink-0 pl-1">
          <div class="text-sm font-bold text-white">{{ record.day }}</div>
          <div class="text-[10px] text-slate-400 font-medium">
            {{ record.month }}
          </div>
        </div>

        <!-- Espacio vacío -->
        <div class="flex-1 px-6"></div>

        <!-- Eficiencia -->
        <div class="w-20 text-center">
          <span
            class="inline-flex items-center justify-center text-sm font-bold px-3 py-1.5 rounded-lg"
            :class="getEfficiencyColor(record.efficiency).text"
          >
            {{ record.efficiency }}%
          </span>
        </div>

        <!-- Ojo + Puntito -->
        <div class="w-16 flex items-center justify-end gap-2">
          <!-- Puntito rojo pulsante si isLive -->
          <div v-if="record.isLive" class="relative" title="Registro en vivo">
            <div class="size-2 bg-red-500 rounded-full dot-pulse"></div>
            <div
              class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-40"
            ></div>
          </div>
          <button
            class="flex items-center justify-center text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            title="Ver detalles"
          >
            <span class="material-symbols-outlined text-xl"> visibility </span>
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="processedRecords.length === 0"
        class="py-10 text-center text-slate-400 text-sm"
      >
        <span class="material-symbols-outlined mb-3 block opacity-50"
          >sleep</span
        >
        <p class="text-slate-500">No hay registros disponibles</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  // Interface del registro - SOLO lo necesario
  export interface DailyRecord {
    date: Date | string
    efficiency: number
    isLive?: boolean
  }

  // Props
  const props = withDefaults(
    defineProps<{
      title?: string
      records: DailyRecord[]
      showExportButton?: boolean
    }>(),
    {
      title: 'Registros Diarios',
      subtitle: 'Eficiencia del sueño',
      showExportButton: true,
      records: () => [],
    }
  )

  // Emits
  defineEmits<{
    export: []
    view: [index: number]
  }>()

  // Procesar fechas
  const processedRecords = computed(() => {
    return props.records.map(record => {
      const d =
        typeof record.date === 'string' ? new Date(record.date) : record.date
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      const months = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ]

      return {
        ...record,
        day: `${days[d.getDay()]} ${d.getDate().toString().padStart(2, ' ')}`,
        month: months[d.getMonth()],
      }
    })
  })

  // Color por eficiencia - MEJOR VISIBILIDAD
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90)
      return {
        text: 'text-emerald-400 bg-emerald-400/20',
        border: 'bg-emerald-500',
      }
    if (efficiency >= 70)
      return {
        text: 'text-amber-400 bg-amber-400/20',
        border: 'bg-amber-500',
      }
    return {
      text: 'text-red-400 bg-red-400/20',
      border: 'bg-red-500',
    }
  }
</script>

<style scoped>
  .dot-pulse {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
</style>
