<script setup lang="ts">
  import IntervalList from './IntervalList.vue'
  import PacientFeed from './PacientFeed.vue'
  import PsicoFeed from './PsicoFeed.vue'
  import TimelineSection from './TimelineSection.vue'
  import { SleepState, type Interval } from '@/types/sleepReg.types'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const props = defineProps<{
    selectedDate: string
  }>()

  const handleEdit = () => {
    router.push({ name: 'UserEditReg', params: { date: props.selectedDate } })
  }
  const mockSleepIntervals: Interval[] = [
    {
      state: SleepState.INBED,
      hours: 0,
      minutes: 15,
      startTime: new Date('2024-10-24T23:15:00'),
      endTime: new Date('2024-10-24T23:30:00'),
    },
    {
      state: SleepState.ASLEEP,
      hours: 3,
      minutes: 45,
      startTime: new Date('2024-10-24T23:30:00'),
      endTime: new Date('2024-10-25T03:15:00'),
    },
    {
      state: SleepState.AWAKE,
      hours: 0,
      minutes: 10,
      startTime: new Date('2024-10-25T03:15:00'),
      endTime: new Date('2024-10-25T03:25:00'),
    },
    {
      state: SleepState.ASLEEP,
      hours: 3,
      minutes: 45,
      startTime: new Date('2024-10-25T03:25:00'),
      endTime: new Date('2024-10-25T07:10:00'),
    },
  ]
</script>
<template>
  <div
    class="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 xl:px-20 md:overflow-y-auto pb-2 h-full content-center"
  >
    <!-- <MetricCard
          title="Sueño Real"
          value="7h 20m"
          :trend="{
            value: '+5m',
            direction: 'up',
            comparisonText: 'vs. ayer +5m',
          }"
          class="md:col-span-1 lg:col-span-3"
        />

        <MetricCard
          title="Eficiencia"
          value="88%"
          :trend="{
            value: 'Óptima',
            direction: 'up',
            comparisonText: 'Percentil 85',
          }"
          class="md:col-span-1 lg:col-span-3"
        />

        <MetricCard
          title="Latencia"
          value="14 min"
          :trend="{
            value: '-2m',
            direction: 'down',
            comparisonText: 'Tiempo en dormirse',
          }"
          class="md:col-span-1 lg:col-span-3"
        />

        <MetricCard
          title="Ritmo Cardíaco"
          value=""
          :trend="{
            value: '',
            direction: 'stable',
            comparisonText: '',
          }"
          no-data
          class="md:col-span-1 lg:col-span-3"
        /> -->

    <div class="lg:col-span-8">
      <TimelineSection
        :intervals="mockSleepIntervals"
        :bedtime-date="mockSleepIntervals[0]?.startTime"
        :wakeup-date="
          mockSleepIntervals[mockSleepIntervals.length - 1]?.endTime
        "
        :empty-message="'No hay datos de sueño registrados'"
        :footer-text="'El gráfico representa los estados técnicos registrados por el dispositivo médico durante el ciclo completo.'"
      />
    </div>
    <div class="lg:col-span-4 lg:row-span-2">
      <IntervalList
        :intervals="mockSleepIntervals"
        empty-message="No hay intervalos para este día"
        @edit="handleEdit"
      />
    </div>
    <div class="lg:col-span-4">
      <PsicoFeed
        doctor-avatar="https://media.tenor.com/n-AuQVkJZOkAAAAM/anime-crying.gif"
        feedback="Proverbio chino:
El mejor momento para plantar
un árbol fue hace 20 años.
El segundo mejor momento es
ahora
No pospongas las cosas.

Si deseas éxito y crecimiento en
el futuro, el mejor momento
para actuar es ahora."
      />
    </div>
    <div class="lg:col-span-4">
      <PacientFeed comment="barriga pocha" />
    </div>
  </div>
</template>
