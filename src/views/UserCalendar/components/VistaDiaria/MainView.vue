<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import IntervalList from './IntervalList.vue'
  import PacientFeed from './PacientFeed.vue'
  import PsicoFeed from './PsicoFeed.vue'
  import TimelineSection from './TimelineSection.vue'
  import { type SleepReg } from '@/types/sleepReg.types'
  import { useMeStore } from '@/stores/me.store'

  const meStore = useMeStore()
  const props = defineProps<{
    dayReg: SleepReg
  }>()

  onMounted(async () => {
    await meStore.fetchMe()
  })
</script>
<template>
  <div
    class="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 self-center max-w-7xl md:overflow-y-auto pb-2 h-full content-center"
  >
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
      />
    </div>
    <div class="lg:col-span-4">
      <PsicoFeed
        :doctor-name="meStore.me?.psico?.fullName"
        :doctor-avatar="meStore.me?.psico?.avatar"
        :feedback="dayReg?.psicoComment"
        empty-message="Tu psicologo no te aprecia lo suficiente como para ponerte un comentario"
      />
    </div>
    <div class="lg:col-span-4">
      <PacientFeed :comment="dayReg?.observaciones" />
    </div>
  </div>
</template>
