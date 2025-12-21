<script lang="ts"></script>
<template>
  <div class="lg:col-span-5 xl:col-span-4 flex flex-col">
    <div
      class="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#4b39ef] to-[#39d2c0] dark:from-primary dark:to-[#39d2c0] shadow-lg shadow-indigo-500/20 dark:shadow-primary/20 text-white cursor-pointer group transition-transform active:scale-[0.98] h-full min-h-[250px] lg:min-h-[340px] flex flex-col"
    >
      <div
        class="absolute top-0 right-0 -mr-8 -mt-8 size-48 rounded-full bg-white/10 blur-2xl"
      ></div>
      <div
        class="absolute bottom-0 left-0 -ml-8 -mb-8 size-32 rounded-full bg-white/10 blur-2xl"
      ></div>
      <div
        class="relative p-6 flex flex-col items-center justify-center text-center gap-4 py-8 h-full"
      >
        <div
          class="bg-white/20 p-4 rounded-full backdrop-blur-sm shadow-inner ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-300"
        >
          <span
            class="material-symbols-outlined text-[48px] lg:text-[64px] leading-none"
            style="font-variation-settings: 'FILL' 1"
            >bedtime</span
          >
        </div>
        <div class="flex flex-col gap-1 lg:gap-2">
          <h3 class="text-xl lg:text-2xl font-bold">Calendario de Sueño</h3>
          <p class="text-white/80 text-sm lg:text-base max-w-[220px] lg:max-w-[260px] mx-auto">
            Registra tu descanso diario y mejora tus hábitos nocturnos.
          </p>
        </div>
        <button
          class="mt-2 lg:mt-4 bg-white text-[#4b39ef] text-xs lg:text-sm font-bold py-2.5 px-6 lg:px-8 rounded-full shadow-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
        >
          Abrir
        </button>
      </div>
    </div>
  </div>
</template>
