<script lang="ts" setup>
  //TODO: Add version from package.json or config and name
  import { version } from '@/../package.json'
  import { name } from '@/../package.json'
  const appName = name.toUpperCase()
</script>

<template>
  <footer
    class="hidden md:flex justify-center pb-1 mt-1 bg-gray-50 dark:bg-background-dark"
  >
    <div
      class="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
    >
      <div class="size-6 bg-primary rounded-full p-0.5">
        <img
          src="@/assets/appIcon.svg"
          alt="Logo"
          class="w-full h-full object-contain"
        />
      </div>
      <span class="text-xs font-medium text-gray-500 dark:text-gray-400"
        >{{ appName }} {{ version }}</span
      >
    </div>
  </footer>
</template>
