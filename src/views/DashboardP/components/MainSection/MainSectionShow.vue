<script setup lang="ts">
  import BackButton from './components/BackButton.vue'
  import { type Patient } from '@/types/types'
  import { computed, ref, watch } from 'vue'

  import MetricCard from './components/MetricCard.vue'
  import DateMenu from './components/DateMenu.vue'
  import SleepChart from '@/views/MiCuenta/components/SleepChart.vue'
  import DetailSleep from './components/DetailSleep.vue'
  import { type Reg } from '@/types/regEdit.types'
  import { DashboardViews } from '@/types/dashboardP.types'
  import DonutChart from '@/views/MiCuenta/components/DonutChart.vue'
  import { mockReg } from './utils/mocks'
  import DatePicker from './components/DatePicker.vue'
  import {
    formatDateRange,
    formatDay,
    getMonthRange,
    getWeekRange,
    type DateRange,
  } from './utils/date.utils'

  const sleepData = [
    { day: 'Lun', value: 480 }, // 8 horas = 480 minutos
    { day: 'Mar', value: 420 }, // 7 horas
    { day: 'Sáb', value: 600 }, // 10 horas
    { day: 'Dom', value: 540 }, // 9 horas
  ]

  const previousWeekData = [
    { day: 'Lun', value: 450 },
    { day: 'Mar', value: 430 },
    { day: 'Mié', value: 460 },
    { day: 'Jue', value: 420 },
    { day: 'Vie', value: 480 },
    { day: 'Sáb', value: 520 },
    { day: 'Dom', value: 490 },
  ]

  const metrics = [
    {
      title: 'Tiempo en Cama',
      value: '8h 50m',
      icon: 'bed',
      trend: {
        value: '',
        direction: 'stable' as const,
        comparisonText: 'Estable',
      },
    },
    {
      title: 'Hora Media Sueño',
      value: '7h 45m',
      icon: 'schedule',
      trend: {
        value: '+15m',
        direction: 'up' as const,
        comparisonText: 'vs sem. ant.',
      },
    },
    {
      title: 'Eficiencia Media',
      value: '88%',
      icon: 'bolt',
      trend: {
        value: '+2%',
        direction: 'up' as const,
        comparisonText: 'vs sem. ant.',
      },
    },
    {
      title: 'Latencia al Sueño',
      value: '45m',
      icon: 'visibility',
      trend: {
        value: '+5m',
        direction: 'down' as const,
        comparisonText: 'vs sem. ant.',
      },
    },
  ]
  const sleepSegments = [
    { value: 100, color: '#059669', label: 'Awake' }, // 5h 30m
    { value: 100, color: '#d97706', label: 'InBed' }, // 3h
    { value: 132, color: '#4f46e5', label: 'Asleep' }, // h
  ]

  defineProps<{
    patient: Patient
  }>()
  defineEmits(['exit', 'edit'])

  const selectedDate = ref<Date>(new Date())
  const periodText = computed<string>(() => {
    switch (selectedView.value) {
      case DashboardViews.DIARIA:
        return formatDay(selectedDate.value)
      case DashboardViews.SEMANAL:
        return formatDateRange(weekRange.value)
      case DashboardViews.MENSUAL:
        return formatDateRange(monthRange.value)
    }
    return formatDay(selectedDate.value)
  })

  const selectedView = ref<DashboardViews>(DashboardViews.DIARIA)

  const handleViewChange = (view: DashboardViews) => {
    selectedView.value = view
  }

  const isOpenCalendar = ref(false)
  const dayReg = ref<Reg | null>(mockReg)
  // const weekReg = ref<Reg[]>([])
  // const monthReg = ref<Reg[]>([])
  // const loading = ref(false)
  const weekRange = computed<DateRange>(() => getWeekRange(selectedDate.value))
  const monthRange = computed<DateRange>(() =>
    getMonthRange(selectedDate.value)
  )

  // watch(
  //   selectedView,
  //   async v => {
  //     loading.value = true
  //     try {
  //       if (v === DashboardViews.DIARIA && dayReg.value === null) {
  //         // dayReg.value = await fetchDay(selectedDate.value)
  //       }
  //       if (v === DashboardViews.SEMANAL && weekReg.value.length === 0) {
  //         // statRegs.value = await fetchWeek(selectedDate.value)
  //       }
  //       if (v === DashboardViews.MENSUAL && monthReg.value.length === 0) {
  //         // statRegs.value = await fetchMonth(selectedDate.value)
  //       }
  //     } finally {
  //       loading.value = false
  //     }
  //   },
  //   { immediate: true }
  // )

  // watch(selectedDate, async () => {
  //   dayReg.value = null
  //   weekReg.value = []
  //   monthReg.value = []

  //   loading.value = true
  //   try {
  //     switch (selectedView.value) {
  //       case DashboardViews.DIARIA:
  //         // dayReg.value = await fetchDay(selectedDate.value)
  //         break
  //       case DashboardViews.SEMANAL:
  //         // statRegs.value = await fetchWeek(selectedDate.value)
  //         break
  //       case DashboardViews.MENSUAL:
  //         // statRegs.value = await fetchMonth(selectedDate.value)
  //         break
  //     }
  //   } finally {
  //     loading.value = false
  //   }
  // })

  const maxDate = new Date(2021, 11, 11)

  const handleRangeSelected = (day: Date) => {
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
      <div class="border-b border-white/10">
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
      </div>
      <DateMenu
        :period-text="periodText"
        @view-change="handleViewChange"
        @calendar-click="isOpenCalendar = true"
      />
      <div
        v-if="selectedView != DashboardViews.DIARIA"
        class="grid lg:grid-cols-2 gap-4"
      >
        <DonutChart
          title="Distribución del Sueño"
          subtitle="Análisis semanal promedio"
          :segments="sleepSegments"
          center-subtitle="Total Noche"
        />
        <SleepChart
          title="Tiempo Dormido"
          :chart-data="sleepData"
          :previous-period-data="previousWeekData"
        />
        <div class="grid grid-cols-2 lg:col-span-2 lg:grid-cols-4 gap-4">
          <MetricCard
            v-for="metric in metrics"
            :key="metric.title"
            :title="metric.title"
            :value="metric.value"
            :icon="metric.icon"
            :trend="metric.trend"
          />
        </div>
      </div>
      <DetailSleep
        v-if="dayReg !== null && selectedView === DashboardViews.DIARIA"
        :reg="dayReg"
      />
      <DatePicker
        :is-open="isOpenCalendar"
        :view-type="selectedView"
        :min-date="maxDate"
        :selected-date="selectedDate"
        @close="isOpenCalendar = false"
        @date-selected="handleRangeSelected"
      />
    </div>
  </section>
</template>
