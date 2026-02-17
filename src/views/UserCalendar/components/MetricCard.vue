<!-- MetricCard.vue -->
<template>
  <div
    class="glass-card rounded-2xl p-5 border-l-4 flex flex-col justify-center items-center group hover:bg-card-dark/80 transition-colors h-full"
    :class="[hasData ? 'border-l-primary' : 'border-l-neutral-muted']"
  >
    <!-- Título -->
    <span
      class="text-[#9dabb9] text-[10px] self-start font-bold uppercase tracking-widest"
    >
      {{ title }}
    </span>

    <!-- Valor y badge -->
    <div class="flex items-baseline gap-2 mt-2">
      <!-- Valor principal -->
      <h3 class="text-3xl font-black" :class="{ 'text-white/40': !hasData }">
        {{ displayValue }}
      </h3>

      <!-- Badge de tendencia (solo si hay datos) -->
      <span
        v-if="hasData"
        class="text-xs font-bold flex items-center"
        :class="trendColorClass"
      >
        {{ trend.value }}
        <span
          v-if="trendIcon"
          class="material-symbols-outlined text-sm ml-0.5"
          >{{ trendIcon }}</span
        >
      </span>

      <!-- Badge de "sin datos" -->
      <span v-else class="text-neutral-muted text-xs font-bold">
        Sin datos
      </span>
    </div>

    <div
      class="mt-1 text-[10px] font-medium min-h-[20px]"
      :class="hasData ? 'text-[#9dabb9]' : 'text-transparent'"
    >
      {{ hasData ? trend.comparisonText : '_' }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  export interface MetricCardProps {
    /** Título de la métrica */
    title: string
    /** Valor principal formateado (ej: "7h 20m", "88%") */
    value: string
    /** Datos de tendencia */
    trend: {
      /** Valor de la tendencia (ej: "+5m", "Óptima", "-2m") */
      value: string
      /** Dirección de la tendencia */
      direction: 'up' | 'down' | 'stable'
      /** Texto comparativo (ej: "vs. ayer +5m", "Percentil 85") */
      comparisonText: string
    }
    /** Forzar estado sin datos (opcional) */
    noData?: boolean
  }

  const props = withDefaults(defineProps<MetricCardProps>(), {
    noData: false,
  })

  // Determinar si hay datos
  const hasData = computed(() => {
    return !props.noData && props.value !== ''
  })

  // Valor a mostrar (-- si no hay datos)
  const displayValue = computed(() => {
    if (!hasData.value) return '--'
    return props.value
  })

  // Icono según dirección de tendencia
  const trendIcon = computed(() => {
    if (!hasData.value) return ''

    switch (props.trend.direction) {
      case 'up':
        return 'trending_up'
      case 'down':
        return 'trending_down'
      case 'stable':
        return 'remove'
      default:
        return ''
    }
  })

  // Color del texto según dirección de tendencia
  const trendColorClass = computed(() => {
    if (!hasData.value) return ''

    switch (props.trend.direction) {
      case 'up':
        return 'text-emerald-400'
      case 'down':
        return 'text-primary'
      case 'stable':
        return 'text-amber-400'
      default:
        return 'text-white'
    }
  })
</script>
<style>
  .bento-glow-tl {
    background: radial-gradient(
      circle at 0% 0%,
      rgba(19, 127, 236, 0.1) 0%,
      transparent 50%
    );
  }
  .glass-card {
    background: rgba(28, 33, 39, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(19, 127, 236, 0.15);
  }
  .btn-glow {
    box-shadow: 0 0 20px rgba(19, 127, 236, 0.4);
  }
  .calendar-glow {
    box-shadow: 0 0 15px rgba(19, 127, 236, 0.4);
  }
</style>
