<script setup lang="ts">
  import SleepC from './components/SleepC.vue'
  import AppFooter from '../components/AppFooter.vue'
</script>
<template>
  <main
    class="flex flex-col flex-1 px-6 pt-6 md:pb-4 gap-6 md:gap-8 w-full mx-auto lg:bg-transparent md:px-20"
  >
    <div class="flex items-center flex-col gap-1 lg:gap-2">
      <h1
        class="text-gray-900 dark:text-white tracking-tight text-2xl lg:text-4xl font-bold leading-tight"
      >
        Tu Centro de Bienestar
      </h1>
      <p
        class="text-gray-500 dark:text-gray-400 text-sm lg:text-base font-normal"
      >
        Accede a tus herramientas de salud y seguimiento.
      </p>
    </div>
    <div class="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 gap-6">
      <SleepC />
      <div
        class="lg:col-span-7 xl:col-span-8 mb-2 flex flex-col gap-3 lg:gap-6"
      >
        <h3 class="text-gray-900 dark:text-white font-bold text-lg lg:text-xl">
          Otras Herramientas
        </h3>
        <div
          class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6"
        >
          <div
            class="bg-white dark:bg-[#1e2936] rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center gap-3 lg:gap-4 text-center cursor-pointer hover:shadow-md hover:border-primary/20 transition-all active:scale-95 group"
          >
            <div
              class="size-12 lg:size-16 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
            >
              <span
                class="material-symbols-outlined lg:text-[32px]"
                style="font-variation-settings: 'FILL' 1"
                >mood</span
              >
            </div>
            <div class="flex flex-col">
              <span
                class="font-bold text-gray-800 dark:text-gray-200 text-sm lg:text-base leading-tight"
                >Registro de Ánimo</span
              >
            </div>
          </div>
          <div
            class="bg-white dark:bg-[#1e2936] rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center gap-3 lg:gap-4 text-center cursor-pointer hover:shadow-md hover:border-primary/20 transition-all active:scale-95 group"
          >
            <div
              class="size-12 lg:size-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
            >
              <span
                class="material-symbols-outlined lg:text-[32px]"
                style="font-variation-settings: 'FILL' 1"
                >self_improvement</span
              >
            </div>
            <div class="flex flex-col">
              <span
                class="font-bold text-gray-800 dark:text-gray-200 text-sm lg:text-base leading-tight"
                >Mindfullness</span
              >
            </div>
          </div>
          <div
            class="bg-white dark:bg-[#1e2936] rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center gap-3 lg:gap-4 text-center cursor-pointer hover:shadow-md hover:border-primary/20 transition-all active:scale-95 group"
          >
            <div
              class="size-12 lg:size-16 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
            >
              <span
                class="material-symbols-outlined lg:text-[32px]"
                style="font-variation-settings: 'FILL' 1"
                >auto_stories</span
              >
            </div>
            <div class="flex flex-col">
              <span
                class="font-bold text-gray-800 dark:text-gray-200 text-sm lg:text-base leading-tight"
                >Diario Terapéutico</span
              >
            </div>
          </div>
          <div
            class="bg-gray-50 dark:bg-[#15202b] rounded-xl p-4 lg:p-6 shadow-none border border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 lg:gap-3 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors h-full lg:min-h-auto"
          >
            <div
              class="size-12 lg:size-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-xl lg:text-2xl"
                >add</span
              >
            </div>
            <span
              class="font-medium text-gray-400 dark:text-gray-500 text-xs lg:text-sm"
              >Más apps</span
            >
          </div>
        </div>
      </div>
    </div>
  </main>
  <AppFooter />
</template>
