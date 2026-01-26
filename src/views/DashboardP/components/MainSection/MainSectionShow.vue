<script setup lang="ts">
  import BackButton from './components/BackButton.vue'
  import { type Patient } from '@/types/types'
  import { ref } from 'vue'

  import MetricCard from './components/MetricCard.vue'
  import DateMenu from './components/DateMenu.vue'
  import SleepBarChart from '@/views/MiCuenta/components/SleepBarChart.vue'
  import WeeklyTable from './components/WeeklyTable.vue'
  import SleepChart from '@/views/MiCuenta/components/SleepChart.vue'
  import DetailSleep from './components/DetailSleep.vue'
  import type { Reg } from '@/types/regEdit.types'

  const regs: Reg[] = []

  const sleepData = [
    { day: 'Lun', value: 480 }, // 8 horas = 480 minutos
    { day: 'Mar', value: 420 }, // 7 horas
    { day: 'Mié', value: 540 }, // 9 horas
    { day: 'Jue', value: 390 }, // 6.5 horas
    { day: 'Vie', value: 510 }, // 8.5 horas
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

  defineProps<{
    patient: Patient
  }>()
  defineEmits(['exit', 'edit'])
  const periodText = ref('18 — 24 NOV, 2024')

  const handleViewChange = (view: string) => {
    console.log('Vista cambiada a:', view)
    // Aquí puedes cambiar los datos según la vista
  }

  const openCalendar = () => {
    console.log('Abrir calendario')
  }
  const handleShowReg = (index: number) => {
    console.log(`viewing ${index}`)
    showDetails.value = true
  }
  const sleepRecords = [
    {
      date: new Date(2024, 10, 18), // 18 Nov 2024 (Lunes)
      efficiency: 88,
      isLive: false,
    },
    {
      date: new Date(2024, 10, 19), // 19 Nov 2024 (Martes)
      efficiency: 92,
      isLive: false,
    },
    {
      date: new Date(2024, 10, 20), // 20 Nov 2024 (Miércoles)
      efficiency: 85,
      isLive: false,
    },
    {
      date: new Date(2024, 10, 21), // 21 Nov 2024 (Jueves)
      efficiency: 78,
      isLive: false,
    },
    {
      date: new Date(2024, 10, 22), // 22 Nov 2024 (Viernes)
      efficiency: 95,
      isLive: false,
    },
    {
      date: new Date(2024, 10, 23), // 23 Nov 2024 (Sábado)
      efficiency: 82,
      isLive: false,
    },
    {
      date: new Date(2024, 10, 24), // 24 Nov 2024 (Domingo)
      efficiency: 91,
      isLive: true, // Registro en curso (hoy)
    },
  ]
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

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          v-for="metric in metrics"
          :key="metric.title"
          :title="metric.title"
          :value="metric.value"
          :icon="metric.icon"
          :trend="metric.trend"
        />
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div class="flex flex-col gap-4">
          <SleepBarChart
            title="Latencia de Sueño"
            subtitle="Tiempo que tarda en dormirse la primera vez"
            :chart-data="latencyHour"
            value-suffix="h"
            gradient-type="blue"
          />
          <SleepChart
            title="Tiempo Dormido"
            :chart-data="sleepData"
            :previous-period-data="previousWeekData"
          ></SleepChart>
        </div>
        <WeeklyTable
          class="xl:col-span-2"
          :records="sleepRecords"
          @view="handleShowReg"
        />
      </div>
    </div>
    <DetailSleep
      :is-open="showDetails"
      @close="showDetails = false"
    ></DetailSleep>
  </section>
</template>
