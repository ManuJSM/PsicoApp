<template>
  <div
    class="bg-card-dark rounded-xl border border-white/10 p-6 shadow-2xl flex flex-col h-full"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4 shrink-0">
      <div>
        <h3
          class="text-[#9dabb9] text-sm font-bold uppercase tracking-widest mb-1"
        >
          {{ title }}
        </h3>
        <p class="text-sm text-slate-500 mt-1">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Contenedor gráfico + leyenda -->
    <div class="flex flex-col flex-1 min-h-[150px]">
      <!-- Gráfico -->
      <div
        class="flex-1 flex items-end justify-between gap-2 p-4 rounded-xl border border-white/5 h-full"
        :class="gradientClass"
      >
        <div
          v-for="(bar, index) in chartData"
          :key="index"
          class="flex-1 rounded-t-sm cursor-help relative"
          :style="{
            height: calculateBarHeight(bar.value) + '%',
            backgroundColor: getBarColor(index, bar.value),
          }"
          @click="activeTooltip = activeTooltip === index ? null : index"
        >
          <!-- Tooltip -->
          <div
            v-if="activeTooltip === index"
            class="absolute -top-16 left-1/2 -translate-x-1/2 bg-card-dark border border-github-border px-3 py-1.5 rounded-lg text-sm font-bold shadow-xl min-w-[80px] text-center z-10"
          >
            <div class="font-semibold text-white mb-1">{{ bar.label }}</div>
            <div
              class="font-bold"
              :class="getTooltipTextColor(index, bar.value)"
            >
              {{ formatValue(bar.value) }}
            </div>
            <div
              class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-github-border"
            ></div>
          </div>
        </div>
      </div>

      <!-- Leyenda -->
      <div class="flex justify-around mt-4 shrink-0">
        <div
          v-for="(bar, index) in chartData"
          :key="index"
          class="text-sm text-slate-500 font-medium text-center"
        >
          {{ bar.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, type PropType } from 'vue'

  interface ChartBar {
    label: string
    value: number
  }

  const props = defineProps({
    title: { type: String, default: 'Tendencia de Descanso' },
    subtitle: { type: String, default: 'Horas totales registradas por noche' },
    chartData: { type: Array as PropType<ChartBar[]>, required: true },
    valueSuffix: { type: String, default: '' },
    gradientType: { type: String, default: 'blue' },
    highlightMax: { type: Boolean, default: true },
  })

  const activeTooltip = ref<number | null>(null)

  const calculateBarHeight = (value: number): number => {
    if (!props.chartData.length) return 10

    const max = Math.max(...props.chartData.map(item => item.value))
    if (max === 0) return 10

    const normalized = value / max
    return Math.max(10, normalized * 100)
  }

  // Valor máximo
  const getMaxDataValue = () => {
    if (!props.chartData.length) return 0
    return Math.max(...props.chartData.map(item => item.value))
  }

  // Color de barra
  const getBarColor = (index: number, value: number): string => {
    const colors = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      orange: '#f59e0b',
    }
    const color =
      colors[props.gradientType as keyof typeof colors] || colors.blue
    const maxValue = getMaxDataValue()
    if (props.highlightMax && Math.abs(value - maxValue) < 0.001) return color
    return color + '33' // opacidad 20%
  }

  // Tooltip
  const getTooltipTextColor = (index: number, value: number) => {
    const maxValue = getMaxDataValue()
    if (props.highlightMax && Math.abs(value - maxValue) < 0.001) {
      return (
        {
          blue: 'text-blue-400',
          green: 'text-green-400',
          purple: 'text-purple-400',
          orange: 'text-orange-400',
        }[props.gradientType] || 'text-blue-400'
      )
    }
    return 'text-slate-300'
  }

  // Gradiente
  const gradientClass =
    {
      blue: 'chart-gradient-blue',
      green: 'chart-gradient-green',
      purple: 'chart-gradient-purple',
      orange: 'chart-gradient-orange',
    }[props.gradientType] || 'chart-gradient-blue'

  // Formateo de valores
  const formatValue = (value: number) => {
    if (props.valueSuffix === '%') return `${value.toFixed(1)}%`
    if (props.valueSuffix === 'h') return `${value.toFixed(1)}h`
    if (props.valueSuffix) return `${value}${props.valueSuffix}`
    return value.toString()
  }
</script>

<style scoped>
  .chart-gradient-blue {
    background: linear-gradient(
      180deg,
      rgba(59, 130, 246, 0.05) 0%,
      rgba(59, 130, 246, 0.02) 100%
    );
  }
  .chart-gradient-green {
    background: linear-gradient(
      180deg,
      rgba(16, 185, 129, 0.05) 0%,
      rgba(16, 185, 129, 0.02) 100%
    );
  }
  .chart-gradient-purple {
    background: linear-gradient(
      180deg,
      rgba(139, 92, 246, 0.05) 0%,
      rgba(139, 92, 246, 0.02) 100%
    );
  }
  .chart-gradient-orange {
    background: linear-gradient(
      180deg,
      rgba(245, 158, 11, 0.05) 0%,
      rgba(245, 158, 11, 0.02) 100%
    );
  }
</style>
