<script setup lang="ts">
import MenuButton from './MenuButton.vue'
import HeaderLogo from './HeaderLogo.vue'
const appName = 'SleepHealth'
const emit = defineEmits(['close'])
</script>
<template>
  <aside>
    <div
      @click="emit('close')"
      class="fixed inset-0 bg-gray-900/60 backdrop-blur-[1px] transition-opacity"
    ></div>
    <section
      class="fixed inset-y-0 left-0 z-50 flex flex-col w-full lg:w-1/4 md:w-1/3 h-full bg-white dark:bg-background-dark border-r border-white/10 dark:border-white/10 shrink-0 transition-transform duration-300 ease-in-out transform"
    >
      <!-- header -->
      <div
        class="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 py-3 px-6 dark:border-white/10 shrink-0"
      >
        <div class="flex items-center gap-4 text-white">
          <MenuButton @click="emit('close')" />
          <HeaderLogo />
          <h2
            class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]"
          >
            {{ appName }}
          </h2>
        </div>
      </div>
      <!-- navigation -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <a
          class="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-primary dark:hover:text-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          href="#"
        >
          <span class="material-symbols-outlined group-hover:text-primary transition-colors"
            >groups</span
          >
          Dashboard de Pacientes
        </a>
        <a
          class="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          href="#"
        >
          <span
            class="material-symbols-outlined group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
            >person</span
          >
          Mi Perfil
        </a>
        <a
          class="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          href="#"
        >
          <span
            class="material-symbols-outlined group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
            >settings</span
          >
          Ajustes
        </a>
        <a
          class="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          href="#"
        >
          <span
            class="material-symbols-outlined group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
            >help</span
          >
          Ayuda y Soporte
        </a>
      </nav>
    </section>
  </aside>
</template>
