<template>
  <div
    class="bg-card-dark border dark:border-border-dark rounded-xl p-4 md:p-5 flex flex-col gap-4 relative overflow-hidden w-full h-full"
  >
    <div class="absolute top-0 right-0 p-5 flex gap-1">
      <span
        class="bg-[#0bda5b]/10 text-[#0bda5b] text-[8px] font-bold px-2 py-1 rounded-full border border-[#0bda5b]/20 uppercase tracking-tighter flex items-center gap-1"
      >
        <span class="size-1 bg-[#0bda5b] rounded-full animate-pulse"></span>
        {{ type }}
      </span>
    </div>

    <div class="flex justify-between items-start">
      <div class="w-full">
        <h3
          class="text-[#9dabb9] text-[9px] font-bold uppercase tracking-widest mb-1 opacity-80"
        >
          {{ title }}
        </h3>
        <div class="flex items-baseline gap-2">
          <p
            class="text-white text-2xl md:text-3xl font-black leading-none tracking-tight"
          >
            {{ mainValue }}
          </p>
          <div class="flex items-center gap-1">
            <span
              class="text-[10px] font-bold flex items-center transition-colors duration-300"
              :class="trendColor"
            >
              <span class="material-symbols-outlined text-xs mr-0.5">{{
                trendIcon
              }}</span>
              {{ trend === 0 ? '0%' : Math.abs(trend) + '%' }} {{ comparison }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="relative flex-1 w-full mt-auto">
      <div class="h-32 md:h-40 w-full">
        <svg
          class="w-full h-full overflow-visible"
          viewBox="-10 -20 820 220"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient :id="gradientId" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop
                offset="0%"
                :stop-color="lineColor"
                stop-opacity="0.3"
              ></stop>
              <stop
                offset="100%"
                :stop-color="lineColor"
                stop-opacity="0"
              ></stop>
            </linearGradient>

            <clipPath :id="clipId">
              <rect
                x="-10"
                y="-20"
                :width="Math.max(0, 840 * animatedProgress)"
                height="240"
              />
            </clipPath>
          </defs>

          <path
            v-if="pathData.area"
            :d="pathData.area"
            :fill="`url(#${gradientId})`"
            :clip-path="`url(#${clipId})`"
          />

          <path
            v-if="pathData.line"
            ref="lineRef"
            :d="pathData.line"
            fill="none"
            :stroke="lineColor"
            stroke-linecap="round"
            stroke-width="3"
            :style="{
              strokeDasharray: lineLength,
              strokeDashoffset: Math.max(
                0,
                lineLength * (1 - animatedProgress)
              ),
              transition: 'none',
            }"
          />

          <g
            v-if="coords.length"
            class="drop-shadow-[0_0_6px_rgba(19,127,236,0.4)]"
          >
            <circle
              v-for="(point, i) in coords"
              :key="i"
              :cx="point.x"
              :cy="point.y"
              :fill="lineColor"
              r="4"
              :opacity="animatedProgress >= i / (coords.length - 1) ? 1 : 0"
            />
          </g>
        </svg>
      </div>

      <div
        class="flex justify-between items-center px-1 pt-3 text-[#9dabb9] text-[8px] font-bold uppercase tracking-tighter border-t border-white/5 mt-2"
      >
        <span v-for="(point, i) in data" :key="i">{{ point.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CharPoint } from '@/types/metrics.types'
  import { computed, ref, onMounted, watch, nextTick } from 'vue'

  const props = defineProps<{
    title: string
    mainValue: string
    trend: number
    comparison: string
    data: CharPoint[]
    type: string
    color?: string
  }>()

  const gradientId = `grad-${Math.random().toString(36).substring(2, 9)}`
  const clipId = `clip-${Math.random().toString(36).substring(2, 9)}`
  const lineColor = computed(() => props.color || '#137fec')
  const animatedProgress = ref(0)
  const lineLength = ref(2500)
  const lineRef = ref<SVGPathElement | null>(null)

  const trendColor = computed(() =>
    props.trend > 0
      ? 'text-[#0bda5b]'
      : props.trend < 0
        ? 'text-[#f43f5e]'
        : 'text-[#9dabb9]'
  )

  const trendIcon = computed(() =>
    props.trend > 0
      ? 'trending_up'
      : props.trend < 0
        ? 'trending_down'
        : 'remove'
  )

  // Coordenadas calculadas
  const coords = computed(() => {
    const points = props.data
    if (!points || points.length < 2) return []

    const values = points.map(p => p.value)
    const maxVal = Math.max(...values)
    const minVal = Math.min(...values)
    const range = maxVal - minVal || 1

    return points.map((p, i) => ({
      x: (i / (points.length - 1)) * 800,
      y: 180 - ((p.value - minVal) / range) * 140,
    }))
  })

  const pathData = computed(() => {
    const pts = coords.value

    if (!pts || pts.length < 2 || !pts[0]) {
      return { line: '', area: '' }
    }

    const first = pts[0]
    let d = `M ${first.x},${first.y}`

    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i]
      const next = pts[i + 1]

      if (!curr || !next) continue

      const cpX = (curr.x + next.x) / 2
      d += ` Q ${cpX},${curr.y} ${next.x},${next.y}`
    }

    const last = pts[pts.length - 1]
    if (!last) return { line: d, area: d }

    return {
      line: d,
      area: `${d} L ${last.x},200 L ${first.x},200 Z`,
    }
  })

  // Animación blindada
  let animationFrame: number

  const animate = () => {
    // Cancelar animaciones previas si existen
    if (animationFrame) cancelAnimationFrame(animationFrame)

    animatedProgress.value = 0

    if (!props.data || props.data.length < 2) return

    nextTick(() => {
      if (lineRef.value) {
        try {
          lineLength.value = lineRef.value.getTotalLength()
        } catch (e) {
          lineLength.value = 2500
        }
      }

      const duration = 600
      const start = performance.now()

      const step = (now: number) => {
        const elapsed = now - start
        const p = Math.max(0, Math.min(elapsed / duration, 1))

        // Aplicamos el easing asegurando que no baje de 0
        const progress = 1 - Math.pow(1 - p, 3)
        animatedProgress.value = Math.max(0, progress)

        if (p < 1) {
          animationFrame = requestAnimationFrame(step)
        }
      }
      animationFrame = requestAnimationFrame(step)
    })
  }

  onMounted(animate)
  watch(() => props.data, animate, { deep: true })
</script>
