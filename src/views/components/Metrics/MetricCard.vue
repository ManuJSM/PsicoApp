<template>
  <div
    :class="[
      'relative overflow-hidden flex flex-col justify-between rounded-2xl p-3 sm:p-5 border transition-all duration-300',
      'bg-white dark:bg-[#1a1c23] shadow-sm',
      borderColorClass,
    ]"
  >
    <div class="w-full mb-1">
      <p
        class="text-slate-400 dark:text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider leading-tight"
      >
        {{ title }}
      </p>
    </div>

    <div class="flex items-center justify-between gap-2 mb-2">
      <h3
        class="text-slate-900 dark:text-white tracking-tight text-lg sm:text-2xl font-black truncate"
      >
        {{ value }}
      </h3>

      <div
        :class="[
          'shrink-0 flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl text-lg sm:text-2xl',
          moodBgClass,
        ]"
      >
        {{ moodEmoji }}
      </div>
    </div>

    <div
      class="flex flex-wrap items-center gap-x-2 pt-2 border-t border-slate-50 dark:border-white/5"
    >
      <div
        class="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] sm:text-[12px] font-bold"
        :class="trendBadgeClass"
      >
        <span class="material-symbols-outlined text-[12px] sm:text-[14px]">
          {{ trendIcon }}
        </span>
        <span>{{ props.trend.value }}</span>
      </div>

      <p
        class="text-slate-400 text-[9px] sm:text-[11px] font-medium truncate max-w-[50%]"
      >
        {{ props.trend.comparisonText }}
      </p>
    </div>

    <div
      class="absolute top-0 left-0 w-1 h-full opacity-40"
      :class="accentBgClass"
    ></div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  export interface MetricCardProps {
    title: string
    value: string
    trend: {
      value: string
      direction: 'up' | 'down' | 'stable'
      comparisonText: string
    }
  }

  const props = withDefaults(defineProps<MetricCardProps>(), {
    value: '0',
    trend: () => ({
      value: '0%',
      direction: 'stable',
      comparisonText: '',
    }),
  })

  // Lógica de Moods
  const moodEmoji = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return '🚀'
      case 'down':
        return '📉'
      default:
        return '⚖️'
    }
  })

  const trendIcon = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'trending_up'
      case 'down':
        return 'trending_down'
      default:
        return 'horizontal_rule'
    }
  })

  // Estilos de color (IDs de Tailwind)
  const borderColorClass = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'border-emerald-500/20 dark:border-emerald-500/10'
      case 'down':
        return 'border-rose-500/20 dark:border-rose-500/10'
      default:
        return 'border-slate-200 dark:border-primary/20'
    }
  })

  const trendBadgeClass = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      case 'down':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
      default:
        return 'bg-slate-100 text-slate-500 dark:bg-primary/20'
    }
  })

  const moodBgClass = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'bg-emerald-50 dark:bg-emerald-500/10'
      case 'down':
        return 'bg-rose-50 dark:bg-rose-500/10'
      default:
        return 'bg-slate-50 dark:bg-white/5'
    }
  })

  const accentBgClass = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'bg-emerald-500'
      case 'down':
        return 'bg-rose-500'
      default:
        return 'bg-slate-300 dark:bg-primary/80'
    }
  })
</script>
