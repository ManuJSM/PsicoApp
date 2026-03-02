<script lang="ts" setup>
  //TODO: Add version from package.json or config and name
  import { version } from '@/../package.json'
  import { name } from '@/../package.json'
  const appName = name.toUpperCase()
</script>

<template>
  <footer
    class="px-6 md:px-10 py-3 hidden md:block border-t border-[#283039] bg-background-dark/80 backdrop-blur-md mt-auto"
  >
    <div
      class="mx-auto flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <div class="flex items-center gap-2">
        <p
          class="text-[#9dabb9] text-[10px] uppercase font-bold tracking-widest"
        >
          © 2026 {{ appName }} {{ version }} Premium Sleep Analysis Engine
        </p>
      </div>
      <div class="flex gap-6">
        <button
          class="text-white/40 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
        >
          Protocolo Clínico
        </button>
        <button
          class="text-white/40 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
        >
          Privacidad
        </button>
      </div>
    </div>
  </footer>
</template>
