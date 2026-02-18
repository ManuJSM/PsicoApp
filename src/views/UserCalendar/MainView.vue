<script setup lang="ts">
  import { ref } from 'vue'
  import UserCalendar from './components/UserCalendar.vue'
  import MetricCard from './components/MetricCard.vue'
  import TimelineSection from './components/TimelineSection.vue'
  import { SleepState, type Interval } from '@/types/sleepReg.types'
  import IntervalList from './components/IntervalList.vue'
  import PacientFeed from './components/PacientFeed.vue'
  import PsicoFeed from './components/PsicoFeed.vue'

  const isDrawerOpen = ref<boolean>(false)
  const selectDate = ref<string>(
    new Date().toISOString().split('T')[0] as string
  )

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }
  const registros = ref([
    { fecha: '2025-01-04T00:00:00.000Z', notification: true },
    { fecha: '2025-01-12T00:00:00.000Z', notification: true },
    { fecha: '2025-01-20T00:00:00.000Z', notification: true },
    { fecha: '2025-01-25T00:00:00.000Z', notification: true },
    { fecha: '2024-12-15T00:00:00.000Z', notification: true },
    { fecha: '2024-11-03T00:00:00.000Z', notification: true },
  ])
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
  <main class="flex-1 h-full min-h-0 flex justify-center">
    <div class="w-full flex flex-col gap-4">
      <div
        class="sticky md:relative top-0 z-10 backdrop-blur-md md:px-4 xl:px-20 flex pt-4 flex-col justify-center items-center lg:flex-row lg:justify-between lg:items-end gap-6"
      >
        <div class="flex flex-col gap-1">
          <h1
            class="text-white text-3xl font-black leading-tight tracking-tight"
          >
            Vista Diaria Detallada
          </h1>
        </div>
        <div
          class="flex flex-wrap justify-center items-center gap-4 p-1.5 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm"
        >
          <button
            class="bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25"
          >
            Día
          </button>
          <button
            class="text-[#9dabb9] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-white transition-all"
          >
            Semana
          </button>
          <button
            class="text-[#9dabb9] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-white transition-all"
          >
            Mes
          </button>
          <button
            class="text-[#9dabb9] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-white transition-all"
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
          <span>{{ selectDate }}</span>
        </button>
      </div>
      <div
        class="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 xl:px-20 md:overflow-y-auto pb-2"
      >
        <MetricCard
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
        />

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
        <div class="lg:col-span-4">
          <PsicoFeed
            doctor-avatar="https://100k-faces.vercel.app/api/random-image"
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
        <div class="lg:col-span-5">
          <PacientFeed comment="barriga pocha" />
        </div>
        <div class="lg:col-span-7">
          <IntervalList
            :intervals="mockSleepIntervals"
            empty-message="No hay intervalos para este día"
          />
        </div>
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
        :registros="registros"
        v-model:selected-date="selectDate"
      />
    </Teleport>
  </main>
</template>
