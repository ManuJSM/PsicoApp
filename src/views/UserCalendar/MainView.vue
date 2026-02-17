<script setup lang="ts">
  import { ref } from 'vue'
  import UserCalendar from './components/UserCalendar.vue'
  import MetricCard from './components/MetricCard.vue'
  import TimelineSection from './components/TimelineSection.vue'
  import { SleepState, type Interval } from '@/types/sleepReg.types'

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
  <main class="flex-1 h-full min-h-0 overflow-y-auto flex justify-center">
    <div class="w-full flex flex-col gap-6 p-6 xl:px-20">
      <div
        class="flex flex-col justify-center items-center lg:flex-row lg:justify-between lg:items-end gap-6 px-2"
      >
        <div class="flex flex-col gap-1">
          <h1
            class="text-white text-3xl font-black leading-tight tracking-tight"
          >
            Vista Diaria Detallada
          </h1>
          <p class="text-[#9dabb9] text-sm font-medium flex items-center gap-2">
            Análisis técnico de la jornada para el paciente.
          </p>
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
      <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
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

        <div class="lg:col-span-9">
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
        <div
          class="lg:col-span-3 glass-card rounded-3xl p-6 flex flex-col border-t-2 border-t-neutral-muted/50"
        >
          <div class="flex items-center gap-4 mb-6">
            <div class="relative">
              <div class="size-14 rounded-2xl border-2 border-primary/20 p-0.5">
                <div
                  class="w-full h-full rounded-xl bg-cover grayscale-[0.5]"
                  style="
                    background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKzonXTZDxnTOTfsw26bHQJ1n_BSDIsSb1BxvkUVGQG1LSQoVbTIWWkoIE0JkM8R3A3BnPByzQnyFVCbiBsR7QrijZQQOJ6Y1om2c7s_haTypzbcM2eJTNGcWSxDoAnGHCbJFhRDCekFgL4mokugMhhoBvRz-rDv9S-kQRCV9jOEwXR7RfOUJgKB9DDeg_JHoCfDCcjw0M6dIygYrtMBDfoc92msBfpPqvhuWScaGwHpfpJ46r8jIwxrRg-13jq3Mz0RYe5euocfI');
                  "
                ></div>
              </div>
              <div
                class="absolute -bottom-1 -right-1 size-4 bg-[#637381] border-2 border-card-dark rounded-full"
              ></div>
            </div>
            <div>
              <p class="text-white font-bold text-base">Dra. Elena Ruiz</p>
              <p
                class="text-[#9dabb9] text-[10px] font-black uppercase tracking-widest"
              >
                Feedback Clínico
              </p>
            </div>
          </div>
          <div
            class="bg-white/5 rounded-2xl p-4 border border-white/5 flex-1 flex flex-col justify-center"
          >
            <span
              class="material-symbols-outlined text-[#9dabb9]/20 text-3xl font-thin block mb-2"
              >format_quote</span
            >
            <p class="text-white/80 italic leading-relaxed text-xs">
              "Aún no has registrado tu sueño de anoche. ¡Cuéntame cómo has
              descansado para poder ayudarte!"
            </p>
          </div>
        </div>
        <div
          class="lg:col-span-5 glass-card rounded-3xl p-8 flex flex-col gap-6 opacity-60"
        >
          <div class="flex items-center justify-between">
            <h3
              class="text-[#9dabb9] text-xs font-bold uppercase tracking-widest"
            >
              Valoración del Paciente
            </h3>
            <div class="flex gap-2">
              <span class="material-symbols-outlined text-white/20 text-2xl"
                >sentiment_very_satisfied</span
              >
              <span class="material-symbols-outlined text-white/20 text-2xl"
                >sentiment_satisfied</span
              >
              <span class="material-symbols-outlined text-white/20 text-2xl"
                >sentiment_neutral</span
              >
            </div>
          </div>
          <div
            class="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl py-10"
          >
            <p class="text-[#9dabb9] text-sm italic">
              No hay notas personales para este día.
            </p>
          </div>
        </div>
        <div
          class="lg:col-span-7 glass-card rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px]"
        >
          <div class="flex flex-col items-center gap-6 max-w-sm text-center">
            <div class="relative">
              <div
                class="absolute inset-0 bg-primary/10 blur-3xl rounded-full"
              ></div>
              <span
                class="material-symbols-outlined text-primary/30 text-8xl font-thin relative z-10"
                >bedtime</span
              >
            </div>
            <div class="space-y-2">
              <h3 class="text-white text-xl font-bold">
                Sin registros de intervalos
              </h3>
              <p class="text-[#9dabb9] text-sm leading-relaxed">
                Parece que no hay datos técnicos para este periodo. Puedes
                añadir un registro manual o sincronizar tu dispositivo.
              </p>
            </div>
            <button
              class="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-5 px-8 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 uppercase tracking-[0.15em] btn-glow group"
            >
              <span
                class="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform"
                >add_circle</span
              >
              AÑADIR REGISTRO DE ESTA NOCHE
            </button>
          </div>
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
