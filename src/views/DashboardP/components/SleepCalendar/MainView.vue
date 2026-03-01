<script setup lang="ts">
  import BackButton from '../MainSection/components/BackButton.vue'
  import { ToastType, type Patient } from '@/types/types'
  import { computed, ref, watch } from 'vue'
  import MetricCard, {
    type MetricCardProps,
  } from '../../../components/Metrics/MetricCard.vue'
  import DateMenu from '../MainSection/components/DateMenu.vue'
  import SleepUserChart from '@/views/components/Metrics/SleepUserChart.vue'
  import DetailSleep from './components/DetailSleep.vue'
  import { DashboardViews } from '@/types/dashboard.types'
  import { type SleepReg } from '@/types/sleepReg.types'
  import {
    type CharData,
    type Metrics,
    type RegCalendar,
  } from '@/types/metrics.types'
  import DonutChart, {
    type DonutSegment,
  } from '@/views/components/Metrics/DonutChart.vue'
  import { formatDateRange } from '../../../../utils/date.utils'
  import {
    fetchCalendar,
    fetchDailyReg,
    formatDate,
    updatePsicoComment,
  } from '@/api/SleepData/sleepReg.api'
  import { useRoute, useRouter } from 'vue-router'
  import { fetchSleepData, fetchMetrics } from '@/api/SleepData/metricData.api'
  import UserCalendar from '@/views/UserCalendar/components/UserCalendar.vue'
  import { useToast } from '@/composables/useToast'
  import {
    getCardsValues,
    getDonutSegments,
    getViewConfig,
    type ViewConfig,
  } from '@/utils/metrics.utils'
  import { DASHBOARD_P_ID } from '@/router/psico.route'
  const toast = useToast()
  const router = useRouter()
  const route = useRoute()

  defineProps<{
    patient: Patient
  }>()
  defineEmits(['exit', 'edit'])

  const date = computed({
    get: () => route.params.date as string,
    set: (newDate: string) => {
      router.push({
        name: DASHBOARD_P_ID,
        params: { date: newDate },
      })
    },
  })
  const selectedDate = computed<Date>(() => new Date(date.value))

  const selectedView = ref<DashboardViews>(DashboardViews.DIARIA)

  const handleViewChange = (view: DashboardViews) => {
    selectedView.value = view
  }

  const isOpenCalendar = ref(false)
  const dayReg = ref<SleepReg | null>(null)
  const loading = ref(false)

  const sleepChartData = computed(() => ({
    chartColor: '#035fe0',
    type: 'Media Dormido',
    chartData: newSleepData.value.data,
    avg: newMetrics.value.avgSleep.current.formatted,
    trend: newMetrics.value.avgSleep.trendPercentaje,
    comparison: newConfig.value.comparisonText,
    title: newConfig.value.title,
  }))

  const metricCardsData = computed<MetricCardProps[]>(() =>
    getCardsValues(newMetrics.value, newConfig.value.comparisonText)
  )

  const donutChartData = computed<DonutSegment[]>(() =>
    getDonutSegments(
      newMetrics.value.avgSleep.current.raw,
      newMetrics.value.avgInBed.current.raw,
      newMetrics.value.avgAwake.current.raw
    )
  )
  const newMetrics = ref<Metrics>({} as Metrics)
  const newSleepData = ref<CharData>({} as CharData)
  const newConfig = ref<ViewConfig>({} as ViewConfig)

  const fetchPeriodData = async (view: DashboardViews) => {
    newConfig.value = getViewConfig(view, selectedDate.value)

    const [sleepData, metrics] = await Promise.all([
      fetchSleepData({
        userId: Number(route.params.id),
        start: newConfig.value.dateRange.start,
        end: newConfig.value.dateRange.end,
        type: 'sleep',
        groupBy: newConfig.value.groupBy,
      }),
      fetchMetrics({
        userId: Number(route.params.id),
        start: newConfig.value.dateRange.start,
        end: newConfig.value.dateRange.end,
      }),
    ])
    newSleepData.value = sleepData
    newMetrics.value = metrics
  }
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
        case DashboardViews.MENSUAL:
        case DashboardViews.ANUAL:
          await fetchPeriodData(view)
          break
      }
    } finally {
      loading.value = false
    }
  }

  const calendarDays = ref<RegCalendar[]>([])
  const periodText = computed<string>(() => {
    if (selectedView.value === DashboardViews.DIARIA)
      return formatDate(selectedDate.value)
    else {
      return formatDateRange(newConfig.value?.dateRange)
    }
  })

  const saveObservation = async (observation: string) => {
    if (!dayReg.value) return
    const data = await updatePsicoComment({
      regId: dayReg.value.id as number,
      psicoComment: observation,
    })
    if (data.success) {
      toast.setToast(ToastType.SUCCESS, 'Observación guardada con exito')
      dayReg.value.psicoComment = observation
    } else {
      toast.setToast(ToastType.ERROR, 'Error al guardar la observación')
    }
  }

  watch(
    [selectedView, selectedDate, () => Number(route.params.id)],
    async ([newView, newDate, newId], [oldView, oldDate, oldId]) => {
      if (newId !== oldId) {
        loading.value = true
        dayReg.value = null
        calendarDays.value = await fetchCalendar({ userId: newId })
        return fetchDataForView(newView, newDate)
      }
      if (newDate !== oldDate) {
        return fetchDataForView(newView, newDate)
      }

      if (newView !== oldView) {
        return fetchDataForView(newView, newDate)
      }
    },
    { immediate: true }
  )
</script>
<template>
  <section class="flex min-h-0 flex-1 h-full flex-col">
    <BackButton @click="$emit('exit')" label="Cerrar" />
    <div class="flex flex-col gap-4 h-full min-h-0 overflow-y-auto p-4">
      <div class="md:hidden flex flex-wrap items-center gap-4 justify-between">
        <div class="flex items-center gap-4">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 shrink-0"
            :data-alt="`Profile picture of ${patient.fullName}`"
            :style="{ backgroundImage: `url(${patient.avatar})` }"
          ></div>
          <div class="grow">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
              {{ patient.fullName }}
            </h1>

            <div
              class="flex flex-wrap items-center gap-4 mt-3 text-slate-600 dark:text-slate-400"
            >
              <!-- Email -->
              <div class="flex items-center gap-2">
                <span
                  class="material-symbols-outlined text-primary-500 text-xl"
                >
                  mail
                </span>
                <a
                  href="mailto:{{ patient.email }}"
                  class="hover:text-primary-600 transition-colors"
                >
                  {{ patient.email }}
                </a>
              </div>

              <!-- Phone -->
              <div class="flex items-center gap-2">
                <span
                  class="material-symbols-outlined text-primary-500 text-xl"
                >
                  call
                </span>
                <a
                  href="tel:{{ patient.phone }}"
                  class="hover:text-primary-600 transition-colors"
                >
                  {{ patient.phone }}
                </a>
              </div>
            </div>
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
        <nav class="flex gap-6">
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
      <section class="min-h-0 h-full" v-if="loading === false">
        <div
          v-if="selectedView != DashboardViews.DIARIA"
          class="grid lg:grid-cols-2 gap-4 content-around h-full"
        >
          <DonutChart
            title="Distribución del Sueño"
            subtitle="Análisis promedio"
            :segments="donutChartData"
            center-subtitle="Total Noche"
          />
          <!-- <SleepChart v-bind="sleepChartData" /> -->
          <SleepUserChart
            :data="sleepChartData.chartData"
            :main-value="sleepChartData.avg"
            :type="sleepChartData.type"
            :trend="sleepChartData.trend"
            :title="sleepChartData.title"
            :comparison="sleepChartData.comparison"
            :color="sleepChartData.chartColor"
          />
          <div class="grid grid-cols-2 lg:col-span-2 lg:grid-cols-4 gap-4">
            <MetricCard
              v-for="metric in metricCardsData"
              :key="metric.title"
              :title="metric.title"
              :value="metric.value"
              :trend="metric.trend"
            />
          </div>
        </div>
        <div class="grid h-full min-h-0" v-else>
          <DetailSleep
            :date="selectedDate"
            :dayReg="dayReg"
            @update:observations="saveObservation"
          />
        </div>
      </section>
      <Teleport to="body">
        <div
          class="hidden md:block fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-500 ease-in-out"
          :class="
            isOpenCalendar ? 'opacity-100' : 'opacity-0 pointer-events-none'
          "
          @click="isOpenCalendar = false"
        ></div>
        <UserCalendar
          v-model="isOpenCalendar"
          :key="Number(route.params.id)"
          :registros="calendarDays"
          v-model:selected-date="date"
        />
      </Teleport>
    </div>
  </section>
</template>
