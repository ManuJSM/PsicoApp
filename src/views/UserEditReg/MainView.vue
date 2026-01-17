<script setup lang="ts">
  import Step1 from './components/Step1/MainView.vue'
  import Step2 from './components/Step2/MainView.vue'
  import Step3 from './components/Step3/MainView.vue'
  import { ref } from 'vue'
  const step = ref(2)
  const percentage = Math.floor((step.value / 3) * 100)
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
          -&gt; PASO {{ step }} DE 3
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
          <span class="text-sm font-bold text-primary">{{ percentage }}%</span>
        </div>
        <div
          class="h-1.5 w-full progress-container rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-primary rounded-full"
            :style="{ width: percentage + '%' }"
          ></div>
        </div>
      </div>
    </div>
    <Step1 v-if="step === 1" />
    <Step2 v-if="step === 2" />
    <Step3 v-if="step === 3" />
  </main>
</template>
