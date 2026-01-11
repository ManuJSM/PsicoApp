<script setup lang="ts">
import RegTable from '../components/RegTable.vue'
import { calculateDuration, getBorderColor, getQualityColor } from '@/views/components/utils/utils'
import { role } from '@/types/types'

const userRole = role.user
const eficiencia = 98
const hours = 7.34
const duration = calculateDuration(hours)
</script>
<template>
  <main class="flex-1 pb-safe-sm px-4 py-6 md:py-8 w-full overflow-y-auto self-center md:px-40">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div
        class="rounded-xl border border-gray-200 dark:border-primary bg-white dark:bg-[#1c2127] p-5 shadow-sm flex flex-row md:flex-row items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-primary">
            <span class="material-symbols-outlined text-[24px]">bedtime</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
              >Promedio de Sueño</span
            >
            <span class="text-xs text-gray-400">7 días</span>
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ duration }}</p>
      </div>
      <div
        class="rounded-xl border bg-white dark:bg-[#1c2127] p-5 shadow-sm flex flex-row md:flex-row items-center justify-between gap-4"
        :class="[getBorderColor(eficiencia)]"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[getQualityColor(eficiencia)]"
            class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl"
          >
            <span class="material-symbols-outlined text-[24px]">battery_charging_full</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
              >Promedio Eficiencia</span
            >
            <span class="text-xs text-gray-400">7 días</span>
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ `${eficiencia}%` }}</p>
      </div>
    </div>
    <RegTable :userRole="userRole" class="pb-4" />
  </main>
</template>
