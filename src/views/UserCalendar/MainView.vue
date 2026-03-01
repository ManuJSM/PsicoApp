<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import UserCalendar from './components/UserCalendar.vue'
  import VistaDiaria from './components/VistaDiaria/MainView.vue'
  import VistaSemanal from './components/VistaSemanal/MainView.vue'
  import { useRouter } from 'vue-router'
  import { fetchMeCalendar, fetchMeDailyReg } from '@/api/SleepData/me.api'
  import {
    type CharData,
    type Metrics,
    type RegCalendar,
  } from '@/types/metrics.types'
  import type { SleepReg } from '@/types/sleepReg.types'
  import { formatDisplayDate } from '../../utils/date.utils'
  import { DashboardViews } from '@/types/dashboard.types'
  import { getViewConfig, type ViewConfig } from '@/utils/metrics.utils'
  import {
    fetchMeMetrics,
    fetchMeSleepData,
  } from '@/api/SleepData/metricData.api'

  const router = useRouter()
  const isDrawerOpen = ref<boolean>(false)
  const props = defineProps<{
    date: string
  }>()
  const loading = ref<boolean>(false)
  const selectedDate = computed({
    get: () => props.date,
    set: (newDate: string) => {
      router.push({
        name: 'UserCalendar',
        params: { date: newDate },
      })
    },
  })
  const handleAdd = () => {
    router.push({
      name: 'UserEditReg',
      params: { date: props.date },
    })
  }
  const selectedView = ref<DashboardViews>(DashboardViews.DIARIA)
  const myMetrics = ref<Metrics | null>(null)
  const mySleepData = ref<CharData | null>(null)
  const config = ref<ViewConfig | null>(null)

  const dayReg = ref<SleepReg | null>(null)
  const fetchPeriodData = async (view: DashboardViews, date: Date) => {
    config.value = getViewConfig(view, date)

    const [sleepData, metrics] = await Promise.all([
      fetchMeSleepData({
        start: config.value.dateRange.start,
        end: config.value.dateRange.end,
        type: 'sleep',
        groupBy: config.value.groupBy,
      }),
      fetchMeMetrics({
        start: config.value.dateRange.start,
        end: config.value.dateRange.end,
      }),
    ])
    mySleepData.value = sleepData
    myMetrics.value = metrics
  }

  const fetchDataForView = async (view: DashboardViews, date: Date) => {
    loading.value = true

    try {
      switch (view) {
        case DashboardViews.DIARIA:
          dayReg.value = await fetchMeDailyReg({ day: date })
          break

        case DashboardViews.SEMANAL:
        case DashboardViews.MENSUAL:
        case DashboardViews.ANUAL:
          await fetchPeriodData(view, date)
          break
      }
    } finally {
      loading.value = false
    }
  }
  watch(
    [selectedView, () => new Date(props.date)],
    async ([newView, newDate], [oldView, oldDate]) => {
      if (newDate !== oldDate) {
        return fetchDataForView(newView, newDate)
      }
      if (newView !== oldView) {
        return fetchDataForView(newView, newDate)
      }
    },
    { immediate: true }
  )

  const calendar = ref<RegCalendar[]>([])
  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }
  onMounted(async () => {
    calendar.value = await fetchMeCalendar()
  })
</script>

<template>
  <main class="flex-1 h-full min-h-0 flex justify-center md:overflow-y-auto">
    <div class="w-full flex flex-col gap-4">
      <div
        class="sticky md:relative top-0 z-10 backdrop-blur-sm md:px-4 xl:px-20 flex pt-4 flex-col justify-center items-center lg:flex-row lg:justify-between lg:items-end gap-6"
      >
        <div class="flex flex-col gap-1">
          <h1
            class="text-white text-3xl font-black leading-tight tracking-tight"
          >
            Vista Diaria Detallada
          </h1>
        </div>
        <div
          class="flex flex-wrap justify-center items-center gap-4 p-1.5 rounded-2xl bg-primary/10 border border-primary/20"
        >
          <button
            class="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
            :class="
              selectedView === DashboardViews.DIARIA
                ? 'bg-primary text-white'
                : 'text-[#9dabb9]'
            "
            @click="selectedView = DashboardViews.DIARIA"
          >
            Día
          </button>
          <button
            class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-white transition-all"
            :class="
              selectedView === DashboardViews.SEMANAL
                ? 'bg-primary text-white'
                : 'text-[#9dabb9]'
            "
            @click="selectedView = DashboardViews.SEMANAL"
          >
            Semana
          </button>
          <button
            class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-white transition-all"
            :class="
              selectedView === DashboardViews.MENSUAL
                ? 'bg-primary text-white'
                : 'text-[#9dabb9]'
            "
            @click="selectedView = DashboardViews.MENSUAL"
          >
            Mes
          </button>
          <button
            class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-white transition-all"
            :class="
              selectedView === DashboardViews.ANUAL
                ? 'bg-primary text-white'
                : 'text-[#9dabb9]'
            "
            @click="selectedView = DashboardViews.ANUAL"
          >
            Año
          </button>
        </div>
        <button
          class="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-primary/20 group"
          @click="toggleDrawer"
        >
          <span
            class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform"
            >calendar_today</span
          >
          <span>{{ selectedDate }}</span>
        </button>
      </div>
      <div class="flex-1 flex items-center justify-center" v-if="!loading">
        <VistaDiaria
          v-if="selectedView === DashboardViews.DIARIA && dayReg"
          :dayReg="dayReg"
        />
        <VistaSemanal
          v-else-if="selectedView !== DashboardViews.DIARIA"
          :config="config as ViewConfig"
          :metrics="myMetrics as Metrics"
          :sleepData="mySleepData as CharData"
        />
        <section
          v-else="!dayReg"
          class="flex flex-col gap-2 h-full items-center p-4 justify-center text-center"
        >
          <div class="">
            <div
              class="size-32 md:size-40 rounded-full bg-[#0d1117] border-2 border-white/10 flex items-center justify-center mb-6"
            >
              <span class="material-symbols-outlined text-5xl text-slate-600">
                nights_stay
              </span>
            </div>
          </div>

          <h2 class="text-2xl md:text-3xl font-bold text-slate-300">
            Sin registro para esta fecha
          </h2>

          <p class="text-slate-500 max-w-md">
            {{ `(${formatDisplayDate(new Date(props.date))})` }}
          </p>
          <button
            class="flex items-center gap-2 px-6 py-3 bg-transparent cursor-pointer border-2 border-dashed border-primary/50 text-primary hover:border-primary hover:bg-primary/5 rounded-lg transition-all duration-200 group"
            @click="handleAdd"
          >
            <span class="material-symbols-outlined"> add </span>
            <span class="font-medium">Añadir registro</span>
          </button>
        </section>
      </div>
    </div>

    <!-- Overlay y Drawer con v-model -->
    <Teleport to="body">
      <div
        class="hidden md:block fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-500 ease-in-out"
        :class="isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        @click="isDrawerOpen = false"
      ></div>
      <UserCalendar
        v-model="isDrawerOpen"
        :registros="calendar"
        v-model:selected-date="selectedDate"
      />
    </Teleport>
  </main>
</template>
<style>
  .glass-card {
    background: rgba(28, 33, 39, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(19, 127, 236, 0.15);
  }
  .btn-glow {
    box-shadow: 0 0 20px rgba(19, 127, 236, 0.4);
  }
</style>
