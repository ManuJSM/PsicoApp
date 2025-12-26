<script setup lang="ts">
import RegTable from '../components/RegTable.vue'

const userRole = 'paciente'
</script>
<template>
  <main
    class="flex-1 pb-safe-sm px-4 py-6 md:px-8 md:py-8 w-full overflow-y-auto self-center max-w-4xl"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div
        class="rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] p-5 shadow-sm flex flex-row md:flex-row items-center justify-between gap-4"
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
        <p class="text-3xl font-bold text-gray-900 dark:text-white">7h 04m</p>
      </div>
      <div
        class="rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] p-5 shadow-sm flex flex-row md:flex-row items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3">
          <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600">
            <span class="material-symbols-outlined text-[24px]">battery_charging_full</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
              >Promedio Eficiencia</span
            >
            <span class="text-xs text-gray-400">Objetivo: &gt;85%</span>
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">88%</p>
      </div>
    </div>
    <RegTable :userRole="userRole" class="pb-4" />
  </main>
</template>
