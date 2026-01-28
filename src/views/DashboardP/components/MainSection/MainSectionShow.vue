<script setup lang="ts">
  import BackButton from './components/BackButton.vue'
  import { type Patient } from '@/types/types'
  import { ref } from 'vue'

  import MetricCard from './components/MetricCard.vue'
  import DateMenu from './components/DateMenu.vue'
  import SleepChart from '@/views/MiCuenta/components/SleepChart.vue'
  import DetailSleep from './components/DetailSleep.vue'
  import { SleepState, type Reg } from '@/types/regEdit.types'
  import DonutChart from '@/views/MiCuenta/components/DonutChart.vue'
  import { DashboardViews } from '@/types/dashboardP.types'

  const regs: Reg[] = []

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
  const showDetails = ref<boolean>(false)

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
      title: 'Despertares',
      value: '1.4',
      icon: 'visibility',
      trend: {
        value: '-0.5',
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
  const periodText = ref('18 — 24 NOV, 2024')
  const selectedView = ref<DashboardViews>(DashboardViews.DIARIA)

  const handleViewChange = (view: DashboardViews) => {
    console.log('Vista cambiada a:', view)
    selectedView.value = view
    // Aquí puedes cambiar los datos según la vista
  }

  const openCalendar = () => {
    console.log('Abrir calendario')
  }

  const mockReg: Reg = {
    fecha: new Date('2024-01-20'),
    bedtime: new Date('2024-01-19T23:00:00'),
    wakeup: new Date('2024-01-20T07:15:00'),
    intervals: [
      {
        state: SleepState.INBED,
        hours: 0,
        minutes: 15,
        startTime: new Date('2024-01-19T23:00:00'),
        endTime: new Date('2024-01-19T23:15:00'),
      },
      {
        state: SleepState.ASLEEP,
        hours: 3,
        minutes: 45,
        startTime: new Date('2024-01-19T23:15:00'),
        endTime: new Date('2024-01-20T03:00:00'),
      },
      {
        state: SleepState.AWAKE,
        hours: 0,
        minutes: 20,
        startTime: new Date('2024-01-20T03:00:00'),
        endTime: new Date('2024-01-20T03:20:00'),
      },
      {
        state: SleepState.ASLEEP,
        hours: 3,
        minutes: 55,
        startTime: new Date('2024-01-20T03:20:00'),
        endTime: new Date('2024-01-20T07:15:00'),
      },
    ],
    observaciones:
      'Me costó un poco conciliar el sueño por el ruido de los vecinos, pero una vez dormida descansé bien hasta que me despertó una pesadilla a las 3 de la mañana. Después volví a dormirme rápido y me desperté sintiéndome bastante renovada.',
  }
  const sleepRecords = ref([
    {
      date: new Date(2024, 10, 18), // 18 Nov 2024 (Lunes)
      isLive: false,
      isComplete: true, // Completado (sin punto)
    },
    {
      date: new Date(2024, 10, 19), // 19 Nov 2024 (Martes)
      isLive: false,
      isComplete: true, // Completado
    },
    {
      date: new Date(2024, 10, 20), // 20 Nov 2024 (Miércoles)
      isLive: false,
      isComplete: false, // INCOMPLETO (estilo diferente)
    },
    {
      date: new Date(2024, 10, 21), // 21 Nov 2024 (Jueves)
      isLive: false,
      isComplete: true,
    },
    {
      date: new Date(2024, 10, 22), // 22 Nov 2024 (Viernes)
      isLive: false,
      isComplete: false, // INCOMPLETO
    },
    {
      date: new Date(2024, 10, 23), // 23 Nov 2024 (Sábado)
      isLive: false,
      isComplete: true,
    },
    {
      date: new Date(2024, 10, 24), // 24 Nov 2024 (Domingo)
      isLive: true, // Registro en curso (punto pulsante)
      isComplete: false, // INCOMPLETO (pero hoy es especial)
    },
  ])

  // Datos de ejemplo para eficiencia
  const latencyHour = [
    { label: 'Lun', value: 2.2 },
    { label: 'Mar', value: 1.5 },
    { label: 'Mié', value: 1.1 },
    { label: 'Jue', value: 2.4 },
    { label: 'Vie', value: 1.8 },
    { label: 'Sáb', value: 2.9 },
    { label: 'Dom', value: 1.9 },
  ]
</script>
<template>
  <section
    class="md:col-span-2 xl:col-span-3 flex flex-col bg-background-light dark:bg-background-dark h-full"
  >
    <BackButton @click="$emit('exit')" label="Cerrar" />
    <div class="p-6 space-y-6 overflow-y-auto">
      <div class="flex flex-wrap items-center gap-4 justify-between">
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
        @calendar-click="openCalendar"
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
      <DetailSleep v-else :reg="mockReg" />
    </div>
  </section>
</template>
