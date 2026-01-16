<script setup lang="ts">
  import { ref, computed } from 'vue'
  import HourSelector from './components/HourSelector.vue'
  import type { TimeValue } from '@/types/regEdit.types'

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

  // Formatos y cálculos
  const formattedBedtime = computed<string>(() => {
    return `${bedtime.value.hour.toString().padStart(2, '0')}:${bedtime.value.minute.toString().padStart(2, '0')} ${bedtime.value.amPm.toUpperCase()}`
  })

  const formattedWakeup = computed<string>(() => {
    return `${wakeup.value.hour.toString().padStart(2, '0')}:${wakeup.value.minute.toString().padStart(2, '0')} ${wakeup.value.amPm.toUpperCase()}`
  })

  const totalTimeInBed = computed<string>(() => {
    // Convertir a horas 24
    let bedtimeHour24 = bedtime.value.hour
    if (bedtime.value.amPm === 'pm' && bedtimeHour24 !== 12) bedtimeHour24 += 12
    if (bedtime.value.amPm === 'am' && bedtimeHour24 === 12) bedtimeHour24 = 0

    let wakeupHour24 = wakeup.value.hour
    if (wakeup.value.amPm === 'pm' && wakeupHour24 !== 12) wakeupHour24 += 12
    if (wakeup.value.amPm === 'am' && wakeupHour24 === 12) wakeupHour24 = 0

    // Calcular diferencia
    const bedtimeMinutesTotal = bedtimeHour24 * 60 + bedtime.value.minute
    const wakeupMinutesTotal = wakeupHour24 * 60 + wakeup.value.minute

    let diffMinutes = wakeupMinutesTotal - bedtimeMinutesTotal
    if (diffMinutes < 0) diffMinutes += 24 * 60 // Si pasa de medianoche

    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60

    return `${hours}h ${minutes.toString().padStart(2, '0')}m`
  })

  const nextStep = (): void => {
    // Aquí iría la lógica para ir al siguiente paso
    alert(
      `Configuración guardada:\nAcostado: ${formattedBedtime.value}\nLevantado: ${formattedWakeup.value}\nTotal en cama: ${totalTimeInBed.value}`
    )
  }
</script>
<template>
  <main
    class="max-w-7xl mx-auto pb-safe-sm px-4 py-8 mb-2 sm:px-6 lg:px-8 overflow-y-auto"
  >
    <div
      class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
    >
      <div class="space-y-2">
        <div
          class="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]"
        >
          -&gt; PASO 1 DE 3
        </div>
        <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight">
          Ventana de Descanso
        </h2>
        <p class="text-slate-400 max-w-lg">
          Define las horas principales en las que te acostaste y te levantaste
          para establecer el marco de tu registro.
        </p>
      </div>
      <div class="w-full md:w-72 space-y-2.5">
        <div class="flex justify-between items-end">
          <span
            class="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
            >PROGRESO ACTUAL</span
          >
          <span class="text-sm font-bold text-primary">33%</span>
        </div>
        <div
          class="h-1.5 w-full progress-container rounded-full overflow-hidden"
        >
          <div class="h-full bg-primary rounded-full" style="width: 33%"></div>
        </div>
      </div>
    </div>
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
        <div class="bg-card-dark border border-border-dark rounded-xl p-6">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">info</span>
            Instrucciones
          </h3>
          <ul class="space-y-4">
            <li class="flex gap-3">
              <span class="text-primary font-bold">01.</span>
              <p class="text-sm text-slate-400">
                Desliza las ruedas de horas y minutos para ajustar tu horario.
              </p>
            </li>
            <li class="flex gap-3">
              <span class="text-primary font-bold">02.</span>
              <p class="text-sm text-slate-400">
                Usa el selector superior para alternar entre AM y PM.
              </p>
            </li>
            <li class="flex gap-3">
              <span class="text-primary font-bold">03.</span>
              <p class="text-sm text-slate-400">
                Puedes usar los botones de ±15m para ajustes rápidos de
                precisión.
              </p>
            </li>
            <li class="flex gap-3">
              <span class="text-primary font-bold">04.</span>
              <p class="text-sm text-slate-400">
                También puedes hacer clic directamente en los números para
                seleccionarlos.
              </p>
            </li>
          </ul>
        </div>
        <div
          class="p-4 rounded-xl border border-dashed border-border-dark bg-primary/5"
        >
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary"
              >lightbulb</span
            >
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
            class="w-full sm:w-[240px] bg-primary hover:brightness-110 text-white font-bold py-4 rounded-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
          >
            Siguiente Paso
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
