<script setup lang="ts">
  import { computed } from 'vue'
  import SleepUserChart from '@/views/components/Metrics/SleepUserChart.vue'
  import { type CharData, type Metrics } from '@/types/metrics.types'
  import DonutChart, {
    type DonutSegment,
  } from '@/views/components/Metrics/DonutChart.vue'

  import type { MetricCardProps } from '@/views/components/Metrics/MetricCard.vue'
  import MetricCard from '@/views/components/Metrics/MetricCard.vue'
  import {
    getCardsValues,
    getDonutSegments,
    type ViewConfig,
  } from '@/utils/metrics.utils'

  const props = defineProps<{
    metrics: Metrics
    config: ViewConfig
    sleepData: CharData
  }>()
  const sleepChartData = computed(() => ({
    chartColor: '#035fe0',
    type: 'Media Dormido',
    chartData: props.sleepData.data,
    avg: props.metrics.avgSleep.current.formatted,
    trend: props.metrics.avgSleep.trendPercentaje,
    comparison: props.config.comparisonText,
    title: props.config.title,
  }))

  const metricCardsData = computed<MetricCardProps[]>(() =>
    getCardsValues(props.metrics, props.config.comparisonText)
  )

  const donutChartData = computed<DonutSegment[]>(() =>
    getDonutSegments(
      props.metrics.avgSleep.current.raw,
      props.metrics.avgInBed.current.raw,
      props.metrics.avgAwake.current.raw
    )
  )
</script>
<template>
  <section class="flex flex-col gap-6 px-4 py-2 max-w-7xl mx-auto w-full">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-8">
        <SleepUserChart
          :comparison="sleepChartData.comparison"
          :title="sleepChartData.title"
          :data="sleepChartData.chartData"
          :main-value="sleepChartData.avg"
          :type="sleepChartData.type"
          :trend="sleepChartData.trend"
          :color="sleepChartData.chartColor"
        />
      </div>

      <div class="lg:col-span-4">
        <DonutChart
          class="h-full"
          title="Distribución"
          subtitle="Promedio"
          center-subtitle="Total"
          :segments="donutChartData"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        v-for="(metric, index) in metricCardsData"
        :key="index"
        :title="metric.title"
        :value="metric.value"
        :trend="metric.trend"
      />
    </div>
  </section>
</template>
