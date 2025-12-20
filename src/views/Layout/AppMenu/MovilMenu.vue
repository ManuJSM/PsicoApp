<script setup lang="ts"></script>
<template>
  <nav
    class="md:hidden fixed left-0 right-0 z-10 translate-z-0 bottom-0 opacity-90 bg-white/80 backdrop-blur-md dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
  >
    <div class="grid grid-cols-3 h-16 items-center">
      <a
        class="flex flex-col items-center justify-center gap-1 h-full text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        href="#"
      >
        <span class="material-symbols-outlined text-[24px]">groups</span>
        <span class="text-[10px] font-bold">Pacientes</span>
      </a>
      <a
        class="flex flex-col items-center justify-center gap-1 h-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        href="#"
      >
        <span class="material-symbols-outlined text-[24px]">person</span>
        <span class="text-[10px] font-medium">Mi Perfil</span>
      </a>
      <a
        class="flex flex-col items-center justify-center gap-1 h-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        href="#"
      >
        <span class="material-symbols-outlined text-[24px]">help</span>
        <span class="text-[10px] font-medium">Ayuda</span>
      </a>
    </div>
  </nav>
</template>
