<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RecordCard from './components/RecordCard.vue'
import type { SleepCardModel, SleepCardView } from './utils/types'
import FormCard from './components/FormCard.vue'
import { scModelToView } from './utils/utils'
import { useToast } from '@/composables/useToast'
import { ToastType } from '@/types/types'
import { deleteAllArray } from '../components/utils/utils'

const { setToast } = useToast()
const fechaHoy = 'Martes, 28 de Mayo'
const comentario = ref<string>('')

const sleepRecords = ref<SleepCardModel[]>([
  {
    type: 'sleep',
    startTime: {
      hour: '23:30',
      day: 'today',
    },
    endTime: {
      hour: '04:15',
      day: 'tomorrow',
    },
  },
  {
    type: 'bed',
    startTime: {
      hour: '04:15',
      day: 'tomorrow',
    },
    endTime: {
      hour: '05:30',
      day: 'tomorrow',
    },
  },
  {
    type: 'sleep',
    startTime: {
      hour: '05:30',
      day: 'tomorrow',
    },
    endTime: {
      hour: '07:45',
      day: 'tomorrow',
    },
  },
  {
    type: 'out',
    startTime: {
      hour: '08:00',
      day: 'tomorrow',
    },
    endTime: {
      hour: '12:30',
      day: 'tomorrow',
    },
  },
  {
    type: 'bed',
    startTime: {
      hour: '14:00',
      day: 'today',
    },
    endTime: {
      hour: '15:30',
      day: 'today',
    },
  },
  {
    type: 'sleep',
    startTime: {
      hour: '22:00',
      day: 'today',
    },
    endTime: {
      hour: '23:30',
      day: 'today',
    },
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

const handleDeleteAll = async () => {
  await deleteAllArray(sleepRecordsView.value)
}

const handleSave = () => {}
const handleAddCard = (sleepCardModel: SleepCardModel) => {
  const id = nextId++

  const SleepCardView = <SleepCardView>scModelToView(sleepCardModel, id)
  console.log(SleepCardView)

  sleepRecordsView.value.push(SleepCardView)
  setToast(ToastType.Success, 'Registro agregado correctamente')
  // sleepRecordsView.value.sort(sortCards)
}
</script>
<template>
  <main
    class="relative flex w-full flex-col font-display dark group/design-root overflow-y-auto px-4 md:px-40"
  >
    <div class="layout-container flex h-full grow flex-col">
      <div class="flex flex-1 justify-center py-5 sm:px-4">
        <div class="layout-content-container flex flex-col flex-1">
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
          <div class="">
            <div class="flex items-center justify-center mb-2 gap-2 lg:mt-0 mt-4">
              <h3
                class="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-primary">list_alt</span>
                Registros
              </h3>
              <button
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:cursor-pointer dark:hover:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-800"
                @click="handleDeleteAll"
              >
                <span class="material-symbols-outlined text-[18px]">delete</span>
                Borrar Todos
              </button>
              <span
                class="text-xs font-bold text-primary bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800"
                >{{ sleepRecordsView.length }} eventos</span
              >
            </div>
            <TransitionGroup name="list" tag="div" class="flex flex-col gap-2 overflow-hidden">
              <RecordCard
                v-for="record in sleepRecordsView"
                :key="record.id"
                :record="record"
                @delete="deleteRecord"
              />
            </TransitionGroup>
            <div class="md:flex-5 mt-2">
              <FormCard
                @submit="handleAddCard"
                :sleepRecords="sleepRecordsView.map((record) => record.sleepCardModel)"
              />
              <div class="flex flex-col gap-6 p-4 pb-20">
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
                      class="w-full min-h-[220px] rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 text-base focus:ring-primary focus:border-primary resize-y"
                      placeholder="Escribe aquí cualquier observación sobre tu sueño de hoy... (ej. me desperté por ruido, tuve pesadillas, etc.)"
                      v-model="comentario"
                    ></textarea>
                    <div
                      class="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none"
                    >
                      Opcional
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
