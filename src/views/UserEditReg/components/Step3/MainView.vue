<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
    <div class="lg:col-span-7 flex flex-col">
      <div
        class="bg-card-dark border border-border-dark rounded-xl p-6 shadow-sm flex flex-col grow"
      >
        <label
          class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4"
          >¿Alguna observación sobre esta noche?</label
        >
        <textarea
          v-model="observaciones"
          class="w-full grow bg-background-dark border border-border-dark rounded-lg p-6 text-base text-slate-200 placeholder:text-slate-600 focus:ring-primary focus:border-primary transition-all custom-scrollbar outline-none resize-none"
          placeholder="Describe aquí cualquier factor relevante: pesadillas, ruidos ambientales, interrupciones, consumo de sustancias o cafeína, nivel de estrés previo a dormir, etc. Dispones de todo el espacio necesario para detallar tu experiencia..."
          rows="18"
        ></textarea>
        <p class="mt-4 text-xs text-slate-500 italic">
          Tus comentarios ayudan a tu terapeuta a entender mejor los patrones de
          tu descanso.
        </p>
      </div>
    </div>
    <div class="lg:col-span-5 space-y-6">
      <div
        class="bg-card-dark border border-border-dark rounded-xl p-6 shadow-sm"
      >
        <h3
          class="text-sm font-bold text-slate-400 uppercase mb-6 flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary text-sm"
            >analytics</span
          >
          Resumen de la Noche
        </h3>
        <div class="relative pt-2 pb-2">
          <!-- Línea de tiempo dinámica -->
          <div
            class="h-8 w-full rounded-full custom-inner-shadow flex p-1.5 gap-0.5 mb-2"
          >
            <div
              v-for="(interval, index) in intervals"
              :key="index"
              :class="[
                'h-full timeline-pill',
                getStateClass(interval.state),
                index === 0 ? 'rounded-l-full' : '',
                index === intervals.length - 1 ? 'rounded-r-full' : '',
              ]"
              :style="{
                width: getIntervalWidth(interval, totalTiempoEnCama) + '%',
              }"
            ></div>
          </div>
          <div
            class="flex justify-between text-[10px] font-bold text-slate-500 uppercase px-1"
          >
            <span>{{ formatTime(bedtimeDate) }}</span>
            <span>{{ formatTime(wakeupDate) }}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-8">
          <div
            class="bg-background-dark border border-border-dark rounded-lg p-5"
          >
            <span
              class="block text-[10px] font-bold text-slate-500 uppercase mb-1"
              >Eficiencia Total</span
            >
            <div class="flex items-end gap-2">
              <span class="text-3xl font-black text-white"
                >{{ eficiencia }}%</span
              >

              <span
                class="rounded-full p-1 material-symbols-outlined text-sm"
                :class="[getQualityColor(eficiencia)]"
                >{{ getQualityIcon(eficiencia) }}</span
              >
            </div>
          </div>
          <div
            class="bg-background-dark border border-border-dark rounded-lg p-5"
          >
            <span
              class="block text-[10px] font-bold text-slate-500 uppercase mb-1"
              >Tiempo Real</span
            >
            <div class="flex items-end gap-2">
              <span class="text-3xl font-black text-white">{{
                formatDuration(totalTiempoEnCama)
              }}</span>
            </div>
          </div>
        </div>

        <div class="mt-8 space-y-4">
          <div
            class="flex items-center justify-between text-sm py-3 border-b border-border-dark/50"
          >
            <span class="text-slate-400 flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-state-asleep"></span>
              Tiempo Dormido
            </span>
            <span class="font-bold text-slate-200">{{
              formatDuration(tiempoDormido)
            }}</span>
          </div>
          <div
            class="flex items-center justify-between text-sm py-3 border-b border-border-dark/50"
          >
            <span class="text-slate-400 flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-state-inbed"></span>
              Tiempo en Cama
            </span>
            <span class="font-bold text-slate-200">{{
              formatDuration(tiempoEnCama)
            }}</span>
          </div>
          <div class="flex items-center justify-between text-sm py-3">
            <span class="text-slate-400 flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-state-awake"></span>
              Tiempo Levantado
            </span>
            <span class="font-bold text-slate-200">{{
              formatDuration(tiempoDespierto)
            }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <button
          @click="guardarRegistro"
          class="w-full bg-primary hover:brightness-110 text-white font-bold py-5 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm relative overflow-hidden group"
        >
          <span>Finalizar y Guardar Registro</span>
          <span
            class="material-symbols-outlined group-hover:translate-x-1 transition-transform"
            >check_circle</span
          >
        </button>
        <button
          @click="volverAnterior"
          class="w-full py-4 text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Volver al Paso Anterior
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { SleepState, type Interval } from '@/types/regEdit.types'
  import { getIntervalWidth } from '@/views/UserEditReg/utils/bar.util'
  import { getStateClass } from '@/views/UserEditReg/utils/css.util'
  import {
    getQualityIcon,
    getQualityColor,
  } from '@/views/components/utils/utils'
  import {
    formatTime,
    formatDuration,
  } from '@/views/UserEditReg/utils/time.util'

  const emits = defineEmits(['back', 'save'])

  // Datos mock (en producción vendrían del paso anterior)
  const intervals = ref<Interval[]>([
    {
      state: SleepState.INBED,
      hours: 0,
      minutes: 45,
      startTime: new Date(2024, 0, 1, 22, 30),
      endTime: new Date(2024, 0, 1, 23, 15),
    },
    {
      state: SleepState.ASLEEP,
      hours: 7,
      minutes: 30,
      startTime: new Date(2024, 0, 1, 23, 15),
      endTime: new Date(2024, 0, 2, 3, 45),
    },
    {
      state: SleepState.AWAKE,
      hours: 0,
      minutes: 16,
      startTime: new Date(2024, 0, 2, 3, 45),
      endTime: new Date(2024, 0, 2, 4, 0),
    },
    {
      state: SleepState.ASLEEP,
      hours: 2,
      minutes: 45,
      startTime: new Date(2024, 0, 2, 4, 0),
      endTime: new Date(2024, 0, 2, 6, 45),
    },
    {
      state: SleepState.INBED,
      hours: 0,
      minutes: 30,
      startTime: new Date(2024, 0, 2, 6, 45),
      endTime: new Date(2024, 0, 2, 7, 15),
    },
  ])

  const bedtimeDate = ref(new Date(2024, 0, 1, 22, 30))
  const wakeupDate = ref(new Date(2024, 0, 2, 7, 15))
  const observaciones = ref('')

  // Calcular ancho del intervalo
  const totalTiempoEnCama = computed(() => {
    const diffMs = wakeupDate.value.getTime() - bedtimeDate.value.getTime()
    return Math.floor(diffMs / 60000)
  })

  // Estadísticas calculadas
  const tiempoDormido = computed(() => {
    return intervals.value
      .filter(interval => interval.state === SleepState.ASLEEP)
      .reduce(
        (total, interval) => total + interval.hours * 60 + interval.minutes,
        0
      )
  })

  const tiempoEnCama = computed(() => {
    return intervals.value
      .filter(interval => interval.state === SleepState.INBED)
      .reduce(
        (total, interval) => total + interval.hours * 60 + interval.minutes,
        0
      )
  })

  const tiempoDespierto = computed(() => {
    return intervals.value
      .filter(interval => interval.state === SleepState.AWAKE)
      .reduce(
        (total, interval) => total + interval.hours * 60 + interval.minutes,
        0
      )
  })

  const eficiencia = computed(() => {
    if (totalTiempoEnCama.value === 0) return 0
    return Math.round((tiempoDormido.value / totalTiempoEnCama.value) * 100)
  })

  // Funciones de navegación
  const volverAnterior = () => {
    emits('back')
  }

  const guardarRegistro = () => {
    const registro = {
      fecha: new Date(),
      bedtime: bedtimeDate.value,
      wakeup: wakeupDate.value,
      intervals: intervals.value,
      observaciones: observaciones.value,
      estadisticas: {
        tiempoDormido: tiempoDormido.value,
        tiempoEnCama: tiempoEnCama.value,
        tiempoDespierto: tiempoDespierto.value,
        eficiencia: eficiencia.value,
      },
    }

    console.log('Registro guardado:', registro)
    alert('✅ Registro guardado exitosamente!')
    emits('save', registro)
  }
</script>
