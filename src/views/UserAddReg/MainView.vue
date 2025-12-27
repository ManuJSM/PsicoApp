<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RecordCard from './components/RecordCard.vue'
import { scModelToView, type SleepCardModel, type SleepCardView } from './utils/types'
import FormCard from './components/FormCard.vue'

const pacientName = 'Samuelillo'
const fechaHoy = 'Martes, 28 de Mayo'

const sleepRecords = ref<SleepCardModel[]>([
  {
    type: 'sleep',
    startTime: '23:30',
    endTime: '04:15',
    day: 'today',
  },
  {
    type: 'bed',
    startTime: '04:15',
    endTime: '05:30',
    day: 'today',
  },
  {
    type: 'sleep',
    startTime: '05:30',
    endTime: '07:45',
    day: 'today',
  },
  {
    type: 'out',
    startTime: '08:00',
    endTime: '12:30',
    day: 'today',
  },
  {
    type: 'bed',
    startTime: '14:00',
    endTime: '15:30',
    day: 'today',
  },
  {
    type: 'sleep',
    startTime: '22:00',
    endTime: '23:30',
    day: 'tomorrow',
  },
])
const sleepRecordsView = ref<SleepCardView[]>([])
let nextId = 1

onMounted(() => {
  sleepRecordsView.value = sleepRecords.value.map((record) => scModelToView(record, nextId++))
})

const deleteRecord = (id: number) => {
  sleepRecordsView.value = sleepRecordsView.value.filter((record) => record.id !== id)
}
const handleSave = () => {}
const handleAddCard = (event: Event) => {
  const data = new FormData(event.target as HTMLFormElement)
  const type = data.get('interval_type')
  const startTime = data.get('start_time')
  const endTime = data.get('end_time')
  const day = data.get('day')
  const id = nextId++

  const SleepCardView = <SleepCardView>scModelToView(
    {
      type: type as SleepCardModel['type'],
      startTime: startTime as string,
      endTime: endTime as string,
      day: day as SleepCardModel['day'],
    },
    id,
  )

  sleepRecordsView.value.push(SleepCardView)
  sleepRecordsView.value.sort((a, b) => {
    if (a.day === 'today' && b.day === 'tomorrow') return -1
    if (a.day === 'tomorrow' && b.day === 'today') return 1
    return a.startTime.localeCompare(b.startTime)
  })
}
</script>
<template>
  <main
    class="relative flex w-full h-screen flex-col font-display dark group/design-root overflow-y-auto px-4 md:px-40"
  >
    <div class="layout-container flex h-full grow flex-col">
      <div class="flex flex-1 justify-center py-5 sm:px-4">
        <div class="layout-content-container flex flex-col flex-1">
          <div class="flex flex-wrap items-center justify-between gap-4 p-4">
            <div class="flex min-w-72 flex-col gap-2">
              <h1 class="text-gray-900 dark:text-white tracking-tight text-3xl font-bold">
                Editar Registro de Sueño
              </h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Paciente: {{ pacientName }}
              </p>
            </div>
          </div>
          <div
            class="flex flex-col md:flex-row items-center justify-between gap-4 p-4 mb-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark sticky top-0 z-10"
          >
            <p class="text-gray-900 dark:text-white text-lg font-semibold text-center">
              {{ fechaHoy }}
            </p>
            <div class="md:self-end flex gap-2">
              <button
                class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-allbg-gray-200"
                @click="handleSave"
              >
                <span>Guardar Cambios</span>
              </button>

              <button
                class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                @click="$router.back()"
              >
                <span>Cerrar</span>
              </button>
            </div>
          </div>
          <FormCard @submit="handleAddCard" />
          <div class="flex flex-col gap-6 p-4 pb-40">
            <div v-show="sleepRecordsView.length > 0" class="flex items-center gap-4">
              <div class="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
              <span class="text-xs font-medium text-gray-400 uppercase tracking-widest"
                >Registros del Día</span
              >
              <div class="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
            </div>
            <div class="flex flex-col gap-3">
              <RecordCard
                v-for="record in sleepRecordsView"
                :key="record.id"
                :record="record"
                @delete="deleteRecord"
              />
            </div>
            <div class="h-px w-full bg-gray-200 dark:bg-gray-800"></div>
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2 mb-1">
                <span class="material-symbols-outlined text-gray-500 dark:text-gray-400"
                  >notes</span
                >
                <h2 class="text-gray-900 dark:text-white text-lg font-bold">Comentario</h2>
              </div>
              <div class="relative">
                <textarea
                  class="w-full min-h-[120px] rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 text-base focus:ring-primary focus:border-primary resize-y"
                  placeholder="Escribe aquí cualquier observación sobre tu sueño de hoy... (ej. me desperté por ruido, tuve pesadillas, etc.)"
                ></textarea>
                <div class="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                  Opcional
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
