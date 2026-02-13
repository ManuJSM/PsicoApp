<template>
  <div
    class="dark:bg-card-dark border dark:border-border-dark rounded-xl p-4 flex flex-col"
  >
    <!-- Header -->
    <div class="flex justify-center items-center mb-4">
      <div>
        <h3 class="font-bold text-slate-300 text-base mb-0.5">{{ title }}</h3>
        <p class="text-xs text-center text-slate-500">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col md:flex-row items-center md:items-stretch gap-4">
      <!-- Donut (responsive real, sin tamaños fijos) -->
      <div class="flex-1 flex items-center justify-center">
        <div class="relative w-full aspect-square">
          <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
            <!-- fondo -->
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#262c33"
              stroke-width="12"
            />

            <!-- segmentos con separación mínima -->
            <circle
              v-for="(segment, index) in renderedSegments"
              v-show="segment.value > 0"
              :key="index"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              :stroke="segment.color"
              stroke-width="12"
              stroke-linecap="inherit"
              :stroke-dasharray="`${segment.length} ${circumference}`"
              :stroke-dashoffset="segment.offset"
              class="transition-all duration-700 ease-out"
            />
          </svg>

          <!-- center -->
          <div
            class="absolute inset-0 flex flex-col items-center justify-center text-center px-2"
          >
            <span
              class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"
            >
              {{ centerSubtitle }}
            </span>
            <span class="text-xl font-black text-white leading-none">
              {{ formatDuration(totalValue) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Legend lateral -->
      <div
        v-if="showLegend && preparedSegments.length"
        class="flex-1 flex md:flex-col justify-center gap-4"
      >
        <div
          v-for="(segment, index) in preparedSegments"
          :key="index"
          class="flex gap-1 md:gap-0 md:grid md:grid-cols-2"
        >
          <div class="flex gap-1 justify-start items-baseline">
            <div
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: segment.color }"
            />
            <span class="text-sm text-slate-300">{{ segment.label }}</span>
          </div>
          <span class="text-sm text-slate-400">{{ segment.percentage }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, watch } from 'vue'

  export interface DonutSegment {
    value: number
    color: string
    label: string
    percentage?: number
  }

  export interface DonutChartProps {
    title?: string
    subtitle?: string
    segments: DonutSegment[]
    centerSubtitle?: string
    centerValue?: number
    showLegend?: boolean
    animate?: boolean
    animationDuration?: number
  }

  const props = withDefaults(defineProps<DonutChartProps>(), {
    title: 'Distribución del Tiempo',
    subtitle: 'Promedio diario',
    segments: () => [],
    centerSubtitle: 'Total',
    centerValue: 0,
    showLegend: true,
    animate: true,
    animationDuration: 700,
  })

  defineEmits(['analytics-click'])

  const animatedProgress = ref(0)

  const radius = 40
  const circumference = 2 * Math.PI * radius

  const totalValue = computed(() => {
    if (props.centerValue > 0) return props.centerValue
    return props.segments.reduce((s, seg) => s + seg.value, 0)
  })

  const preparedSegments = computed(() => {
    const total = totalValue.value || 1
    let acc = 0

    return props.segments.map((s, i) => {
      const raw = Math.round((s.value / total) * 100)
      const pct = i === props.segments.length - 1 ? Math.max(0, 100 - acc) : raw
      acc += pct
      return { ...s, percentage: pct }
    })
  })

  // const renderedSegments = computed(() => {
  //   let offset = 0
  //   return preparedSegments.value.map(seg => {
  //     const full = (seg.percentage! / 100) * circumference
  //     const length = full * animatedProgress.value

  //     const data = {
  //       ...seg,
  //       length,
  //       offset: -offset,
  //     }

  //     offset += full
  //     return data
  //   })
  // })
  const GAP = 2 // tamaño deseado de gap en unidades de circunferencia

  const renderedSegments = computed(() => {
    let offset = GAP
    return preparedSegments.value.map(seg => {
      const full =
        (seg.percentage! / 100) *
        (circumference - GAP * preparedSegments.value.length)
      const length = full * animatedProgress.value

      const data = {
        ...seg,
        length,
        dasharray: `${length} ${GAP}`,
        offset: -offset,
      }

      offset += full + GAP
      return data
    })
  })

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (!h) return `${m}m`
    if (!m) return `${h}h`
    return `${h}h ${m}m`
  }

  const startAnimation = () => {
    if (!props.animate) {
      animatedProgress.value = 1

      return
    }

    const start = performance.now()

    const d = props.animationDuration

    const step = (t: number) => {
      const p = Math.min((t - start) / d, 1)

      animatedProgress.value = 1 - Math.pow(1 - p, 3)

      if (p < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  onMounted(startAnimation)

  watch(() => props.segments, startAnimation, { deep: true })
</script>
