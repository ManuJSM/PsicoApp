<script setup lang="ts">
  import { ref, watch } from 'vue'
  import IntervalList from './IntervalList.vue'
  import PacientFeed from './PacientFeed.vue'
  import PsicoFeed from './PsicoFeed.vue'
  import TimelineSection from './TimelineSection.vue'
  import { type SleepReg } from '@/types/sleepReg.types'
  import { useRouter } from 'vue-router'
  import { fetchMeDailyReg } from '@/api/SleepData/me.api'

  const router = useRouter()
  const props = defineProps<{
    selectedDate: string
  }>()
  const loading = ref<boolean>(false)

  const handleEdit = () => {
    router.push({ name: 'UserEditReg', params: { date: props.selectedDate } })
  }

  const dayReg = ref<SleepReg | null>(null)
  watch(
    () => props.selectedDate,
    async (newDate, oldDate) => {
      loading.value = true
      if (newDate !== oldDate) {
        const data = await fetchMeDailyReg({ day: new Date(newDate) })
        dayReg.value = data
      }
      loading.value = false
    },
    { immediate: true }
  )
</script>
<template>
  <div
    v-if="!loading"
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
        :intervals="dayReg?.intervals ?? []"
        :bedtime-date="dayReg?.intervals[0]?.startTime"
        :wakeup-date="dayReg?.intervals[dayReg.intervals.length - 1]?.endTime"
        :empty-message="'No hay datos de sueño registrados'"
        :footer-text="'El gráfico representa los estados técnicos registrados por el dispositivo médico durante el ciclo completo.'"
      />
    </div>
    <div class="lg:col-span-4 lg:row-span-2">
      <IntervalList
        :intervals="dayReg?.intervals ?? []"
        empty-message="No hay intervalos para este día"
        @edit="handleEdit"
        @add="handleEdit"
      />
    </div>
    <div class="lg:col-span-4">
      <PsicoFeed
        doctor-avatar="https://media.tenor.com/n-AuQVkJZOkAAAAM/anime-crying.gif"
        :feedback="dayReg?.psicoComment"
        empty-message="Tu psicologo no te aprecia lo suficiente como para ponerte un comentario"
      />
    </div>
    <div class="lg:col-span-4">
      <PacientFeed :comment="dayReg?.observaciones" />
    </div>
  </div>
</template>
