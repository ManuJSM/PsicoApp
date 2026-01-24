<template>
  <div
    :class="[
      'flex flex-col gap-3 rounded-xl p-5 border transition-all group',
      'border-slate-200 dark:border-white/10',
      'bg-white dark:bg-card-dark',
    ]"
  >
    <!-- Header -->
    <div class="flex justify-between items-center">
      <p
        class="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider"
      >
        {{ title }}
      </p>
      <span
        class="material-symbols-outlined text-primary transition-colors text-xs"
      >
        {{ icon }}
      </span>
    </div>

    <!-- Main Value -->
    <p
      class="text-slate-900 dark:text-white self-center tracking-tight text-2xl font-extrabold"
    >
      {{ value }}
    </p>

    <!-- Trend -->
    <div class="flex items-center gap-1" :class="trendColorClass">
      <span class="material-symbols-outlined text-xs">
        {{ trendIcon }}
      </span>
      <p class="text-xs font-semibold">
        {{ trendText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface MetricCardProps {
    title: string
    value: string
    icon: string
    trend: {
      value: string
      direction: 'up' | 'down' | 'stable'
      comparisonText: string
    }
  }

  const props = defineProps<MetricCardProps>()

  // Computed
  const trendIcon = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'trending_up'
      case 'down':
        return 'trending_down'
      case 'stable':
        return 'horizontal_rule'
      default:
        return 'horizontal_rule'
    }
  })

  const trendColorClass = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'text-[#0bda5b]'
      case 'down':
        return 'text-[#ff6b6b]'
      case 'stable':
        return 'text-slate-400'
      default:
        return 'text-slate-400'
    }
  })

  const trendText = computed(() => {
    return `${props.trend.value} ${props.trend.comparisonText}`
  })
</script>
