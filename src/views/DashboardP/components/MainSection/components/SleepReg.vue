<script setup lang="ts">
import { ref } from 'vue'

const tableCellClasses = 'px-2 md:px-4 py-3 whitespace-nowrap'

type SleepRecord = {
  id: number
  day: string
  date: string
  startTime: string
  endTime: string
  duration: string
  quality: number
  hasRecord: boolean
}

const weekRange = ref('18 - 24 Nov')

const sleepRecords = ref<SleepRecord[]>([
  {
    id: 1,
    day: 'Lun',
    date: '18',
    startTime: '22:30',
    endTime: '06:15',
    duration: '7h 45m',
    quality: 85,
    hasRecord: true,
  },
  {
    id: 2,
    day: 'Mar',
    date: '19',
    startTime: '23:00',
    endTime: '06:30',
    duration: '7h 30m',
    quality: 78,
    hasRecord: true,
  },
  {
    id: 3,
    day: 'Mié',
    date: '20',
    startTime: '22:15',
    endTime: '06:15',
    duration: '8h 00m',
    quality: 90,
    hasRecord: false,
  },
  {
    id: 4,
    day: 'Jue',
    date: '21',
    startTime: '',
    endTime: '',
    duration: '',
    quality: 0,
    hasRecord: false,
  },
  {
    id: 5,
    day: 'Vie',
    date: '22',
    startTime: '23:30',
    endTime: '07:30',
    duration: '8h 00m',
    quality: 88,
    hasRecord: false,
  },
  {
    id: 6,
    day: 'Sáb',
    date: '23',
    startTime: '00:15',
    endTime: '09:00',
    duration: '8h 45m',
    quality: 95,
    hasRecord: false,
  },
  {
    id: 7,
    day: 'Dom',
    date: '24',
    startTime: '',
    endTime: '',
    duration: '',
    quality: 0,
    hasRecord: false,
  },
])

const getQualityClass = (quality: number) => {
  if (quality >= 85) return 'text-green-600 dark:text-green-400'
  if (quality >= 70) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const getDurationClass = (duration: string) => {
  if (!duration) return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'

  const hours = parseInt(duration)
  if (isNaN(hours)) return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'

  if (hours >= 8) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  if (hours >= 7) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}
</script>

<template>
  <div class="p-6 rounded-xl bg-slate-100 dark:bg-slate-800/50">
    <div
      class="flex flex-col md:flex-row md:justify-between justify-center items-center mb-6 gap-4"
    >
      <h3 class="text-lg font-bold text-slate-900 dark:text-white">Registro de Sueño Semanal</h3>
      <div class="flex items-center gap-2 sm:self-auto">
        <button
          class="size-8 flex items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <span class="text-sm font-medium text-slate-600 dark:text-slate-400">{{ weekRange }}</span>
        <button
          class="size-8 flex items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
    <div
      class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-center text-sm text-slate-500 dark:text-slate-400">
          <thead
            class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-200"
          >
            <tr>
              <th class="hidden md:table-cell" :class="tableCellClasses" scope="col">Día</th>
              <th :class="tableCellClasses" scope="col">Inicio</th>
              <th :class="tableCellClasses" scope="col">Fin</th>
              <th :class="tableCellClasses" scope="col">Duración</th>
              <th :class="tableCellClasses" scope="col">Calidad</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr
              v-for="record in sleepRecords"
              :key="record.id"
              class="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td
                :class="tableCellClasses"
                class="hidden md:table-cell font-medium text-slate-900 dark:text-white"
              >
                {{ record.day }} {{ record.date }}
              </td>

              <template v-if="record.hasRecord">
                <td :class="tableCellClasses">{{ record.startTime }}</td>
                <td :class="tableCellClasses">{{ record.endTime }}</td>
                <td :class="tableCellClasses">
                  <span
                    v-if="record.duration"
                    class="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                    :class="getDurationClass(record.duration)"
                  >
                    {{ record.duration }}
                  </span>
                </td>
                <td
                  v-if="record.quality > 0"
                  :class="[tableCellClasses, getQualityClass(record.quality)]"
                >
                  {{ record.quality }}%
                </td>
              </template>

              <td v-else class="py-1 px-4" colspan="4">
                <div class="flex">
                  <div
                    class="flex w-full justify-center items-center gap-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-1.5 text-slate-500 dark:text-slate-400"
                  >
                    <span class="material-symbols-outlined">bedtime_off</span>
                    <span class="text-sm font-medium">Día sin registro de sueño</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-size: 18px;
}
</style>
