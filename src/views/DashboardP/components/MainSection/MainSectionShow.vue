<script setup lang="ts">
  import BackButton from './components/BackButton.vue'
  import { type Patient } from '@/types/types'
  import { computed, ref, watch } from 'vue'

  import MetricCard, { type MetricCardProps } from './components/MetricCard.vue'
  import DateMenu from './components/DateMenu.vue'
  import SleepChart, {
    type SleepLineChartProps,
  } from '@/views/MiCuenta/components/SleepChart.vue'
  import DetailSleep from './components/DetailSleep.vue'
  import { type SleepReg } from '@/types/sleepReg.types'
  import { DashboardViews } from '@/types/dashboardP.types'
  import DonutChart, {
    type DonutSegment,
  } from '@/views/MiCuenta/components/DonutChart.vue'
  import DatePicker from './components/DatePicker.vue'
  import { dailySleepData, monthlyData, weeklyData } from './utils/mocks'
  import {
    formatDateRange,
    formatDay,
    getMonthRange,
    getWeekRange,
    type DateRange,
  } from './utils/date.utils'
  import { fetchDailyReg } from '@/api/SleepData/sleepReg.api'
  import { useRoute } from 'vue-router'

  const sleepChartData = ref<SleepLineChartProps>({
    chartData: [],
    averageTimeAsleep: '0h ',
    chartColor: '#935fe0',
  })

  const donutChartData = ref<[DonutSegment, DonutSegment, DonutSegment]>([
    { value: 0, color: '#4f46e5', label: 'Asleep' },
    { value: 0, color: '#d97706', label: 'InBed' },
    { value: 0, color: '#059669', label: 'Awake' },
  ])
  const trendDefault = {
    value: '',
    direction: 'stable' as const,
    comparisonText: '',
  }

  const metricCardsData = ref<MetricCardProps[]>([
    {
      title: 'Tiempo en Cama',
      value: '',
      icon: 'bed',
      trend: trendDefault,
    },
    {
      title: 'Hora Media Sueño',
      value: '',
      icon: 'schedule',
      trend: trendDefault,
    },
    {
      title: 'Eficiencia Media',
      value: '',
      icon: 'bolt',
      trend: trendDefault,
    },
    {
      title: 'Latencia al Sueño',
      value: '',
      icon: 'visibility',
      trend: trendDefault,
    },
  ])

  defineProps<{
    patient: Patient
  }>()
  defineEmits(['exit', 'edit'])

  const selectedDate = ref<Date>(new Date())
  const weekRange = computed<DateRange>(() => getWeekRange(selectedDate.value))
  const monthRange = computed<DateRange>(() =>
    getMonthRange(selectedDate.value)
  )
  const periodText = computed<string>(() => {
    switch (selectedView.value) {
      case DashboardViews.DIARIA:
        return formatDay(selectedDate.value)
      case DashboardViews.SEMANAL:
        return formatDateRange(weekRange.value)
      case DashboardViews.MENSUAL:
        return formatDateRange(monthRange.value)
      case DashboardViews.ANUAL:
        return selectedDate.value.getFullYear().toString()
      default:
        return formatDay(selectedDate.value)
    }
  })

  const selectedView = ref<DashboardViews>(DashboardViews.DIARIA)

  const handleViewChange = (view: DashboardViews) => {
    selectedView.value = view
  }

  const isOpenCalendar = ref(false)
  const dayReg = ref<SleepReg | null>(null)
  const loading = ref(false)

  const checkIfHasDataForView = (view: DashboardViews): boolean => {
    switch (view) {
      case DashboardViews.DIARIA:
        return dayReg.value !== null
      case DashboardViews.SEMANAL:
        return sleepChartData.value.periodType === 'day'
      case DashboardViews.MENSUAL:
        return sleepChartData.value.periodType === 'week'
      case DashboardViews.ANUAL:
        return sleepChartData.value.periodType === 'month'
      default:
        return false
    }
  }
  function fillDonut(avgAsleep: number, avgInBed: number, avgAwake: number) {
    donutChartData.value[0].value = avgAsleep
    donutChartData.value[1].value = avgInBed
    donutChartData.value[2].value = avgAwake
  }
  function fillMetric(
    metric: MetricCardProps,
    avg: string,
    trendValue: string,
    direction: 'up' | 'down' | 'stable',
    comparisonText: string
  ): void {
    metric.value = avg
    metric.trend.value = trendValue
    metric.trend.direction = direction
    metric.trend.comparisonText = comparisonText
  }

  const route = useRoute()
  const fetchDataForView = async (view: DashboardViews, date: Date) => {
    loading.value = true

    try {
      switch (view) {
        case DashboardViews.DIARIA:
          dayReg.value = await fetchDailyReg({
            userId: Number(route.params.id),
            day: date,
          })
          break

        case DashboardViews.SEMANAL:
          // const weekResult = await fetchWeek(date)
          sleepChartData.value = {
            ...sleepChartData.value,
            chartData: dailySleepData,
            periodType: 'day',
            displayCount: 7,
            // averageTimeAsleep: weekResult.averageFormatted,
            // changePercent: weekResult.changePercent,
            title: `Semana del ${periodText.value}`,
          }
          fillDonut(123, 134, 800)
          fillMetric(
            metricCardsData.value[0] as MetricCardProps,
            '0h 00m',
            '+0%',
            'stable',
            'vs semana anterior'
          )

          break

        case DashboardViews.MENSUAL:
          // const monthResult = await fetchMonth(date)
          sleepChartData.value = {
            ...sleepChartData.value,
            chartData: weeklyData,
            periodType: 'week',
            displayCount: 4,
            // averageTimeAsleep: monthResult.averageFormatted,
            // changePercent: monthResult.changePercent,
            title: `Mes del ${periodText.value}`,
          }
          fillDonut(300, 123, 78)
          break
        case DashboardViews.ANUAL:
          // const anualResult = await fetchMonth(date)
          sleepChartData.value = {
            ...sleepChartData.value,
            chartData: monthlyData,
            periodType: 'month',
            displayCount: 12,
            // averageTimeAsleep: monthResult.averageFormatted,
            // changePercent: monthResult.changePercent,
            title: `Anio ${periodText.value}`,
          }
          fillDonut(400, 150, 100)
          break
      }
    } finally {
      loading.value = false
    }
  }
  function refreshChartData() {
    sleepChartData.value.chartData = []
    dayReg.value = null
    donutChartData.value.map(item => {
      item.value = 0
    })
  }

  watch(
    [selectedView, selectedDate],
    async ([newView, newDate], [oldView, oldDate]) => {
      if (newDate !== oldDate) {
        refreshChartData()
        return fetchDataForView(newView, newDate)
      }

      if (newView !== oldView) {
        const hasData = checkIfHasDataForView(newView)
        if (!hasData) {
          return fetchDataForView(newView, newDate)
        }
      }
    },
    { immediate: true }
  )

  const handleDateSelected = (day: Date) => {
    selectedDate.value = day
  }
</script>
<template>
  <section
    class="md:col-span-2 xl:col-span-3 flex flex-col bg-background-light dark:bg-background-dark h-full"
  >
    <BackButton @click="$emit('exit')" label="Cerrar" />
    <div class="p-6 space-y-6 overflow-y-auto">
      <div class="md:hidden flex flex-wrap items-center gap-4 justify-between">
        <div class="flex items-center gap-6">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 shrink-0"
            :data-alt="`Profile picture of ${patient.name}`"
            :style="{ backgroundImage: `url(${patient.avatar})` }"
          ></div>
          <div class="grow">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
              {{ patient.name }}
            </h1>
            <p class="text-slate-600 dark:text-slate-400 mt-1">
              {{ patient.email }} • {{ patient.phone }}
            </p>
          </div>
        </div>
        <button
          class="flex items-center justify-center gap-2 rounded-lg hover:bg-primary/80 hover:cursor-pointer bg-primary h-10 px-4 text-white text-sm font-bold w-full sm:w-auto"
          @click="$emit('edit')"
        >
          <span class="material-symbols-outlined">edit</span>
          <span>Editar Perfil</span>
        </button>
      </div>
      <div class="flex justify-between border-b border-white/10">
        <nav class="flex gap-6 -mb-px">
          <a
            class="py-3 px-1 border-b-2 border-primary text-primary font-semibold"
            href="#"
            >Calendario de Sueño</a
          >
          <a
            class="py-3 px-1 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            href="#"
            >Otras Apps</a
          >
        </nav>
        <button
          class="hidden md:flex items-center justify-center gap-2 rounded-lg hover:bg-primary/80 hover:cursor-pointer bg-primary h-10 px-4 text-white text-sm font-bold w-full sm:w-auto"
          @click="$emit('edit')"
        >
          <span class="material-symbols-outlined">edit</span>
          <span>Editar Perfil</span>
        </button>
      </div>
      <DateMenu
        :period-text="periodText"
        @view-change="handleViewChange"
        @calendar-click="isOpenCalendar = true"
      />
      <div
        v-if="selectedView != DashboardViews.DIARIA && loading === false"
        class="grid lg:grid-cols-2 gap-4"
      >
        <DonutChart
          title="Distribución del Sueño"
          subtitle="Análisis promedio"
          :segments="donutChartData"
          center-subtitle="Total Noche"
        />
        <SleepChart v-bind="sleepChartData" />
        <div class="grid grid-cols-2 lg:col-span-2 lg:grid-cols-4 gap-4">
          <MetricCard
            v-for="metric in metricCardsData"
            :key="metric.title"
            :title="metric.title"
            :value="metric.value"
            :icon="metric.icon"
            :trend="metric.trend"
          />
        </div>
      </div>
      <DetailSleep
        v-if="selectedView === DashboardViews.DIARIA && loading === false"
        :date="selectedDate"
        :dayReg="dayReg"
      />
      <DatePicker
        :is-open="isOpenCalendar"
        :selected-date="selectedDate"
        @close="isOpenCalendar = false"
        @date-selected="handleDateSelected"
      />
    </div>
  </section>
</template>
