<template>
  <div
    class="dark:bg-card-dark border dark:border-border-dark rounded-xl p-4 flex flex-col"
  >
    <div class="flex justify-center items-center mb-4">
      <div>
        <h3 class="font-bold text-slate-300 text-base mb-0.5">{{ title }}</h3>
        <p class="text-xs text-center text-slate-500">{{ subtitle }}</p>
      </div>
    </div>

    <div class="flex flex-col md:flex-row items-center md:items-stretch gap-4">
      <div class="flex-1 flex items-center justify-center">
        <div class="relative w-full max-w-[220px] aspect-square">
          <svg
            viewBox="0 0 100 100"
            class="w-full h-full -rotate-90"
            shape-rendering="geometricPrecision"
          >
            <path
              v-for="(segment, index) in pathSegments"
              :key="index"
              :d="segment.d"
              :fill="segment.color"
              :class="[
                'transition-opacity duration-300',
                { 'opacity-0': !hasSegments },
              ]"
            />
          </svg>

          <div
            class="absolute inset-0 flex flex-col items-center justify-center text-center px-2"
          >
            <span
              class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"
            >
              {{ centerSubtitle }}
            </span>
            <span
              class="text-xl font-black text-white leading-none tabular-nums"
            >
              {{ formatDuration(totalValue) }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="showLegend && hasSegments"
        class="flex-1 flex md:flex-col justify-center gap-4"
      >
        <div
          v-for="(segment, index) in preparedSegments"
          :key="index"
          class="flex gap-1 md:gap-0 md:grid md:grid-cols-2"
        >
          <div class="flex gap-1 justify-start items-baseline">
            <div
              class="w-2 h-2 rounded-full shrink-0"
              :style="{ backgroundColor: segment.color }"
            />
            <span class="text-sm text-slate-300">{{ segment.label }}</span>
          </div>
          <span class="text-sm text-slate-400 tabular-nums"
            >{{ segment.percentage }}%</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, watch, nextTick } from 'vue'

  export interface DonutSegment {
    value: number
    color: string
    label: string
  }

  export interface DonutChartProps {
    title?: string
    subtitle?: string
    segments: DonutSegment[]
    centerSubtitle?: string
    centerValue?: number
    showLegend?: boolean
    animationDuration?: number
  }

  const props = withDefaults(defineProps<DonutChartProps>(), {
    title: 'Distribución del Tiempo',
    subtitle: 'Promedio diario',
    segments: () => [],
    centerSubtitle: 'Total',
    centerValue: 0,
    showLegend: true,
    animationDuration: 600, // Sincronizado a 600ms
  })

  // RESTAURADOS VALORES ORIGINALES
  const radius = 45
  const strokeWidth = 10
  const gapDegrees = 3
  const animatedProgress = ref(0)

  const hasSegments = computed(() => props.segments.length > 0)
  const totalValue = computed(() => {
    if (props.centerValue > 0) return props.centerValue
    return props.segments.reduce((s, seg) => s + seg.value, 0) || 0
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

  function polarToCartesian(
    cx: number,
    cy: number,
    r: number,
    angleDeg: number
  ) {
    const angleRad = (angleDeg * Math.PI) / 180.0
    return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) }
  }

  function describeArc(
    x: number,
    y: number,
    rOut: number,
    rIn: number,
    startA: number,
    endA: number
  ) {
    if (endA - startA >= 359.9) {
      const s = polarToCartesian(x, y, rOut, 0)
      const e = polarToCartesian(x, y, rOut, 180)
      const sIn = polarToCartesian(x, y, rIn, 0)
      const eIn = polarToCartesian(x, y, rIn, 180)
      return [
        `M`,
        s.x,
        s.y,
        `A`,
        rOut,
        rOut,
        0,
        1,
        1,
        e.x,
        e.y,
        `A`,
        rOut,
        rOut,
        0,
        1,
        1,
        s.x,
        s.y,
        `M`,
        sIn.x,
        sIn.y,
        `A`,
        rIn,
        rIn,
        0,
        1,
        0,
        eIn.x,
        eIn.y,
        `A`,
        rIn,
        rIn,
        0,
        1,
        0,
        sIn.x,
        sIn.y,
        `Z`,
      ].join(' ')
    }
    const sO = polarToCartesian(x, y, rOut, endA)
    const eO = polarToCartesian(x, y, rOut, startA)
    const sI = polarToCartesian(x, y, rIn, endA)
    const eI = polarToCartesian(x, y, rIn, startA)
    const largeArc = endA - startA <= 180 ? '0' : '1'
    return [
      `M`,
      sO.x,
      sO.y,
      `A`,
      rOut,
      rOut,
      0,
      largeArc,
      0,
      eO.x,
      eO.y,
      `L`,
      eI.x,
      eI.y,
      `A`,
      rIn,
      rIn,
      0,
      largeArc,
      1,
      sI.x,
      sI.y,
      `Z`,
    ].join(' ')
  }

  const pathSegments = computed(() => {
    if (!hasSegments.value) return []

    const total = totalValue.value || 1
    const minDegrees = 8 // Un 1% ahora se verá como un ~3.5% para que sea visible

    // 1. Calculamos los grados "teóricos"
    let segmentsWithDegrees = props.segments.map(seg => ({
      ...seg,
      degrees: (seg.value / total) * 360,
    }))

    // 2. REDISTRIBUCIÓN: Si hay segmentos diminutos, les damos el minDegrees
    // y le quitamos la diferencia a los segmentos más grandes para no explotar los 360°
    const smallSegments = segmentsWithDegrees.filter(
      s => s.degrees < minDegrees
    )
    const largeSegments = segmentsWithDegrees.filter(
      s => s.degrees >= minDegrees
    )

    if (smallSegments.length > 0 && largeSegments.length > 0) {
      let extraNeeded = 0
      smallSegments.forEach(s => {
        extraNeeded += minDegrees - s.degrees
        s.degrees = minDegrees
      })

      // Repartimos la "deuda" de grados entre los grandes proporcionalmente
      const totalLargeDegrees = largeSegments.reduce(
        (acc, s) => acc + s.degrees,
        0
      )
      largeSegments.forEach(s => {
        s.degrees -= extraNeeded * (s.degrees / totalLargeDegrees)
      })
    }

    // 3. Dibujamos con los grados ya normalizados
    let currentAngle = 0
    return segmentsWithDegrees.map(seg => {
      const startA = currentAngle + gapDegrees / 2
      // El sweep es el dibujo animado
      const fullSweep = Math.max(0, seg.degrees - gapDegrees)
      const endA = startA + fullSweep * animatedProgress.value

      const d =
        endA > startA
          ? describeArc(50, 50, radius, radius - strokeWidth, startA, endA)
          : ''

      currentAngle += seg.degrees
      return { color: seg.color, d }
    })
  })
  const resetAndStartAnimation = async () => {
    animatedProgress.value = 0
    await nextTick()
    const start = performance.now()
    const step = (t: number) => {
      const p = Math.min((t - start) / props.animationDuration, 1)
      animatedProgress.value = 1 - Math.pow(1 - p, 3)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60)
    const m = Math.round(min % 60)
    if (!h) return `${m}m`
    if (!m) return `${h}h`
    return `${h}h ${m}m`
  }

  onMounted(resetAndStartAnimation)
  watch(() => props.segments, resetAndStartAnimation, { deep: true })
</script>
