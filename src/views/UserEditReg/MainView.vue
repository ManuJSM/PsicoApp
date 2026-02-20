<script setup lang="ts">
  import type { SleepReg } from '@/types/sleepReg.types'
  import Step1 from './components/Step1/MainView.vue'
  import Step2 from './components/Step2/MainView.vue'
  import Step3 from './components/Step3/MainView.vue'
  import { ref, computed, provide, onMounted, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { fetchMeDailyReg } from '@/api/SleepData/me.api'
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
  const props = defineProps<{
    date: string
  }>()
  const fecha = new Date(props.date)

  const registro = reactive<SleepReg>({
    fecha: fecha,
    bedtime: null,
    wakeup: null,
    observaciones: '',
    intervals: [],
    psicoComment: '',
  })
  const loading = ref<boolean>(false)
  onMounted(async () => {
    loading.value = true
    const reg = await fetchMeDailyReg({ day: fecha })
    if (reg !== null) {
      Object.assign(registro, reg)
    }
    loading.value = false
  })

  provide<SleepReg>('registro', registro)

  const saveReg = async () => {
    router.back()
    //TODO guardarlo en BD
    console.log('Registro guardado')
  }
</script>
<template>
  <main
    class="flex-1 p-4 xl:px-20 sm:px-6 lg:px-8 flex flex-col gap-4 md:overflow-y-auto"
  >
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="flex flex-col gap-1">
        <div
          class="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]"
        >
          -&gt; PASO {{ step }} DE 3 | {{ props.date }}
        </div>
        <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight">
          {{ header[step - 1]?.title }}
        </h2>
        <p class="text-slate-400 max-w-lg">
          {{ header[step - 1]?.text }}
        </p>
      </div>
      <div class="w-full md:w-72 flex flex-col gap-2">
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
    <div v-if="!loading" class="grid h-full min-h-0">
      <Step1 v-if="step === 1" @next="step++" />
      <Step2 v-if="step === 2" @next="step++" @back="step--" />
      <Step3 v-if="step === 3" @back="step--" @save="saveReg" />
    </div>
  </main>
</template>
