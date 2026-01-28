<script setup lang="ts">
  import type { Reg } from '@/types/regEdit.types'
  import Step1 from './components/Step1/MainView.vue'
  import Step2 from './components/Step2/MainView.vue'
  import Step3 from './components/Step3/MainView.vue'
  import { ref, computed, provide } from 'vue'
  import { useRouter } from 'vue-router'
  const step = ref(1)
  const percentage = computed(() => Math.floor((step.value / 3) * 100))
  const header = [
    {
      title: 'Ventana de Descanso',
      text: 'Define las horas principales en las que te acostaste y te levantaste para establecer el marco de tu registro.',
    },
    {
      title: 'Registro de Sueño',
      text: 'Añade los intervalos secuenciales. Visualiza el rango exacto en las estadísticas antes de confirmar.',
    },
    {
      title: 'Finalizar Registro',
      text: 'Añade observaciones adicionales y revisa el resumen de tu noche antes de guardar.',
    },
  ]
  const router = useRouter()
  //FIXME se pasara por prop
  const fecha = new Date()

  const registro: Reg = {
    fecha: fecha,
    bedtime: null,
    wakeup: null,
    intervals: [],
    psicoComment: '',
  }
  provide<Reg>('registro', registro)

  const saveReg = () => {
    router.back()
    //TODO guardarlo en BD
    console.log('Registro guardado')
  }
</script>
<template>
  <main class="pb-safe-sm p-2 mb-2 sm:px-6 lg:px-8 h-full overflow-y-auto">
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
          {{ header[step - 1]?.title }}
        </h2>
        <p class="text-slate-400 max-w-lg">
          {{ header[step - 1]?.text }}
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
    <Step1 v-if="step === 1" @next="step++" />
    <Step2 v-if="step === 2" @next="step++" @back="step--" />
    <Step3 v-if="step === 3" @back="step--" @save="saveReg" />
  </main>
</template>
