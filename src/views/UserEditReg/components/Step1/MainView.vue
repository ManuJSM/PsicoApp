<script setup lang="ts">
  import { ref, computed } from 'vue'
  import InstructionsPanel from '../InstructionsPanel.vue'
  import HourSelector from './HourSelector.vue'
  import type { TimeValue } from '@/types/regEdit.types'
  const today = new Date(2024, 0, 1)

  const emits = defineEmits(['next'])
  const instruccionesTimePicker = [
    'Desliza las ruedas de horas y minutos para ajustar tu horario.',
    'Usa el selector superior para alternar entre AM y PM.',
    'Puedes usar los botones de ±15m para ajustes rápidos de precisión.',
    'También puedes hacer clic directamente en los números para seleccionarlos.',
  ]
  const bedtime = ref<TimeValue>({
    hour: 10,
    minute: 30,
    amPm: 'pm',
  })

  const wakeup = ref<TimeValue>({
    hour: 7,
    minute: 15,
    amPm: 'am',
  })
  const bedtimeDate = computed(() => {
    const hour24 = to24Hour(bedtime.value)
    const date = new Date(today)
    date.setHours(hour24, bedtime.value.minute)
    return date
  })

  const wakeupDate = computed(() => {
    const hour24 = to24Hour(wakeup.value)
    const date = new Date(today)
    date.setHours(hour24, wakeup.value.minute)
    if (date <= bedtimeDate.value) date.setDate(date.getDate() + 1)
    return date
  })

  // Formatos y cálculos
  const formattedBedtime = computed<string>(() => {
    return `${bedtime.value.hour.toString().padStart(2, '0')}:${bedtime.value.minute.toString().padStart(2, '0')} ${bedtime.value.amPm.toUpperCase()}`
  })

  const formattedWakeup = computed<string>(() => {
    return `${wakeup.value.hour.toString().padStart(2, '0')}:${wakeup.value.minute.toString().padStart(2, '0')} ${wakeup.value.amPm.toUpperCase()}`
  })
  const to24Hour = (time: TimeValue): number => {
    let timeHour24 = time.hour
    if (time.amPm === 'pm' && timeHour24 !== 12) timeHour24 += 12
    if (time.amPm === 'am' && timeHour24 === 12) timeHour24 = 0
    return timeHour24
  }
  const totalTimeInBed = computed(() => {
    const diffMs = wakeupDate.value.getTime() - bedtimeDate.value.getTime()
    const diffDate = new Date(diffMs)
    const hours = diffDate.getUTCHours()
    const minutes = diffDate.getUTCMinutes()
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`
  })

  const nextStep = (): void => {
    // Aquí iría la lógica para ir al siguiente paso
    console.log(bedtimeDate.value, wakeupDate.value)
    emits('next')
  }
</script>
<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div class="lg:col-span-8 space-y-6">
      <div
        class="bg-card-dark border border-border-dark rounded-xl p-8 shadow-sm"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <HourSelector v-model:time="bedtime" :title="'Hora Acostado'" />
          <HourSelector v-model:time="wakeup" :title="'Hora Levantado'" />
        </div>
      </div>
      <div
        class="bg-card-dark/40 border border-border-dark rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div class="flex items-center gap-4">
          <div
            class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"
          >
            <span class="material-symbols-outlined">timer</span>
          </div>
          <div>
            <p
              class="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              Tiempo Total de hoy
            </p>
            <p class="text-2xl font-black text-white">{{ totalTimeInBed }}</p>
          </div>
        </div>
        <div class="h-px w-full md:h-12 md:w-px bg-border-dark"></div>
        <div class="flex items-center gap-8">
          <div class="text-center">
            <span class="block text-[10px] font-bold text-slate-500 uppercase"
              >Inicio</span
            >
            <span class="text-sm font-bold">{{ formattedBedtime }}</span>
          </div>
          <div class="text-center">
            <span class="block text-[10px] font-bold text-slate-500 uppercase"
              >Fin</span
            >
            <span class="text-sm font-bold">{{ formattedWakeup }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="lg:col-span-4 space-y-6">
      <InstructionsPanel :instructions="instruccionesTimePicker" />
      <div
        class="p-4 rounded-xl border border-dashed border-border-dark bg-primary/5"
      >
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-primary">lightbulb</span>
          <p class="text-xs text-slate-400 leading-relaxed italic">
            Establecer una ventana de descanso coherente ayuda al sistema a
            calcular mejor tu eficiencia de sueño en el paso 3.
          </p>
        </div>
      </div>
      <div
        class="mt-12 mb-2 pt-8 border-t border-border-dark flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button
          @click="nextStep"
          class="w-full sm:w-[240px] bg-primary hover:cursor-pointer hover:brightness-110 text-white font-bold py-4 rounded-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
        >
          Siguiente Paso
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>
