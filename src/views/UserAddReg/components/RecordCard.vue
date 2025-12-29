<script setup lang="ts">
import type { SleepCardView } from '../utils/types'
import { restarHoras } from '../utils/utils'
const getTypeStyles = (type: string) => {
  switch (type) {
    case 'bed':
      return {
        bg: 'bg-amber-500',
        iconBg: 'bg-amber-100 dark:bg-amber-900/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        textColor: 'text-amber-600 dark:text-amber-400',
      }
    case 'sleep':
      return {
        bg: 'bg-indigo-500',
        iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        textColor: 'text-indigo-600 dark:text-indigo-400',
      }
    case 'out':
    default:
      return {
        bg: 'bg-emerald-500',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        textColor: 'text-emerald-600 dark:text-emerald-400',
      }
  }
}

const getDuration = (record: SleepCardView) => {
  const duration = restarHoras(
    record.sleepCardModel.startTime.hour,
    record.sleepCardModel.endTime.hour,
  )
  return duration.hh === 0
    ? `${duration.mm} M`
    : `${duration.hh} H , ${String(duration.mm).padStart(2, '0')} M`
}
defineProps<{ record: SleepCardView }>()
defineEmits<{ delete: [id: number] }>()
</script>
<template>
  <section
    class="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden"
  >
    <div
      class="absolute left-0 top-0 bottom-0 w-1.5"
      :class="getTypeStyles(record.sleepCardModel.type).bg"
    ></div>
    <div class="flex w-full items-center gap-4">
      <div
        class="flex items-center justify-center size-10 rounded-full shrink-0"
        :class="[
          getTypeStyles(record.sleepCardModel.type).iconBg,
          getTypeStyles(record.sleepCardModel.type).iconColor,
        ]"
      >
        <span class="material-symbols-outlined text-xl">{{ record.icon }}</span>
      </div>
      <div class="flex w-full flex-col">
        <div class="flex justify-between items-center gap-2">
          <span
            class="text-xs font-medium uppercase"
            :class="getTypeStyles(record.sleepCardModel.type).textColor"
          >
            {{ record.title }}
          </span>
          <span
            class="md:self-end"
            :class="[
              'text-xs font-bold px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/50',
            ]"
            >{{ getDuration(record) }}</span
          >
        </div>
        <div
          class="flex justify-center items-center gap-2 text-gray-900 dark:text-white font-bold text-lg"
        >
          {{ record.sleepCardModel.startTime.hour }}
          <span class="text-gray-400 font-normal">-</span>
          {{ record.sleepCardModel.endTime.hour }}
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <button
        @click="$emit('delete', record.id)"
        class="p-2 rounded-full text-red-500 hover:cursor-pointer"
      >
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>
  </section>
</template>
