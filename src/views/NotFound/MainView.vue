<script setup lang="ts"></script>
<template>
  <div
    class="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-6"
  >
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
      ></div>
    </div>
    <div
      class="layout-container relative z-10 flex h-full grow flex-col items-center justify-center w-full max-w-[960px]"
    >
      <div
        class="layout-content-container flex flex-col w-full max-w-[540px] border border-border-github bg-white/5 dark:bg-[#161b22] p-8 md:p-12 rounded-xl backdrop-blur-sm shadow-2xl items-center text-center"
      >
        <div class="mb-8 relative group">
          <div
            class="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-100 opacity-60"
          ></div>
          <div
            class="relative flex items-center justify-center size-24 border-2 border-primary/30 rounded-full text-primary animate-swing-slow origin-center"
          >
            <span
              class="material-symbols-outlined text-[48px]!"
              style="
                font-variation-settings:
                  'FILL' 0,
                  'wght' 200,
                  'GRAD' 0,
                  'opsz' 48;
              "
            >
              bedtime
            </span>
          </div>
        </div>
        <h1
          class="text-slate-800 dark:text-white tracking-tight text-[84px] font-extrabold leading-none pb-2"
        >
          404
        </h1>
        <h3
          class="text-slate-700 dark:text-slate-300 tracking-tight text-xl font-medium leading-relaxed max-w-[400px] mb-10"
        >
          Parece que esta página se ha quedado dormida... o simplemente no
          existe.
        </h3>
        <div class="flex flex-col gap-4 w-full px-4">
          <a
            class="flex items-center justify-center h-10 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-semibold transition-colors group"
            href="#"
          >
            <span class="material-symbols-outlined mr-2 text-[18px]"
              >support_agent</span
            >
            Contactar soporte
          </a>
        </div>
      </div>
    </div>
    <div
      class="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-border-github/30 to-transparent"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-border-github/30 to-transparent"
    ></div>
  </div>
</template>
