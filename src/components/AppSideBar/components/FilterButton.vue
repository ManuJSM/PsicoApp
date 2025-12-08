<script setup lang="ts">
defineProps<{ label: string }>()
</script>
<template>
  <button
    class="flex h-8 shrink-0 items-center justify-center rounded-lg bg-primary pl-2 pr-2 text-white"
  >
    <p class="text-sm font-medium leading-normal">{{ label }}</p>
  </button>
</template>
