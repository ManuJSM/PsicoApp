<template>
  <article class="flex w-full flex-col items-center justify-center py-12 px-6 min-h-[40vh]">
    <div class="relative mb-6 group">
      <div
        class="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-500"
      ></div>
      <div
        class="relative bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-6 ring-1 ring-slate-100 dark:ring-white/5 flex items-center justify-center"
      >
        <span
          class="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors duration-300"
          style="
            font-size: 48px;
            font-variation-settings:
              'FILL' 0,
              'wght' 200;
          "
        >
          inbox
        </span>
      </div>
    </div>
    <h4 class="text-slate-900 dark:text-white font-bold text-lg mb-2 text-center">
      Bandeja de Notificaciones
    </h4>
    <p class="text-slate-500 dark:text-slate-400 text-sm text-center">
      No tienes notificaciones por ahora. <br />Te avisaremos cuando haya novedades.
    </p>
  </article>
</template>
