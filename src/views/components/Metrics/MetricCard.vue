<template>
  <div
    :class="[
      'relative overflow-hidden flex flex-col justify-between rounded-2xl p-4 sm:p-5 border transition-all duration-300',
      'bg-card-dark shadow-lg',
      borderColorClass,
    ]"
  >
    <div class="w-full mb-2">
      <p
        class="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] leading-tight"
      >
        {{ title }}
      </p>
    </div>

    <div class="flex items-center justify-between gap-3 mb-4">
      <h3 class="text-white tracking-tighter text-2xl sm:text-3xl font-black">
        {{ value }}
      </h3>

      <div
        :class="[
          'shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl border',
          moodBgClass,
        ]"
      >
        <span class="material-symbols-outlined text-2xl sm:text-3xl">
          {{ moodIcon }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-3 pt-3 border-t border-white/5">
      <div
        class="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold"
        :class="trendBadgeClass"
      >
        <span class="material-symbols-outlined text-[14px]">
          {{ trendIcon }}
        </span>
        <span>{{ props.trend.value }}</span>
      </div>

      <p class="text-slate-500 text-[11px] font-medium truncate">
        {{ props.trend.comparisonText }}
      </p>
    </div>

    <div
      class="absolute top-0 left-0 w-[3px] h-full"
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
    title: 'Métrica',
    value: '0',
    trend: () => ({
      value: '0%',
      direction: 'stable',
      comparisonText: 'vs. ayer',
    }),
  })

  const moodIcon = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'insights'
      case 'down':
        return 'release_alert'
      default:
        return 'monitoring'
    }
  })

  const trendIcon = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'north_east'
      case 'down':
        return 'south_east'
      default:
        return 'trending_flat'
    }
  })

  const borderColorClass = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'border-emerald-500/20'
      case 'down':
        return 'border-rose-500/20'
      default:
        return 'border-border-dark'
    }
  })

  const trendBadgeClass = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'bg-emerald-500/10 text-emerald-400'
      case 'down':
        return 'bg-rose-500/10 text-rose-400'
      default:
        return 'bg-white/5 text-slate-400 border border-white/5'
    }
  })

  const moodBgClass = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
      case 'down':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
      default:
        return 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(19,127,236,0.1)]'
    }
  })

  const accentBgClass = computed(() => {
    switch (props.trend.direction) {
      case 'up':
        return 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
      case 'down':
        return 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
      default:
        return 'bg-primary shadow-[0_0_8px_#137fec]'
    }
  })
</script>
