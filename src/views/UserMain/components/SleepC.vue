<script lang="ts"></script>
<template>
  <div
    class="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#4b39ef] to-[#39d2c0] dark:from-primary dark:to-[#39d2c0] shadow-lg shadow-indigo-500/20 dark:shadow-primary/20 text-white cursor-pointer group transition-transform active:scale-[0.98]"
  >
    <div class="absolute top-0 right-0 -mr-8 -mt-8 size-48 rounded-full bg-white/10 blur-2xl"></div>
    <div
      class="absolute bottom-0 left-0 -ml-8 -mb-8 size-32 rounded-full bg-white/10 blur-2xl"
    ></div>
    <div class="relative p-6 flex flex-col items-center justify-center text-center gap-4 py-10">
      <div
        class="bg-white/20 p-4 rounded-full backdrop-blur-sm shadow-inner ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-300"
      >
        <span
          class="material-symbols-outlined text-[48px] leading-none"
          style="font-size: 48px; font-variation-settings: 'FILL' 1"
          >bedtime</span
        >
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-xl font-bold">Mi Calendario de Sueño</h3>
        <p class="text-white/80 text-sm">Registra y visualiza tu descanso diario</p>
      </div>
      <button
        class="mt-2 bg-white text-[#4b39ef] text-sm font-bold py-2.5 px-6 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
      >
        Abrir Calendario
      </button>
    </div>
  </div>
</template>
