<script setup lang="ts">
defineProps<{ label: string, active: boolean }>()
</script>
<template>
  <button
    class="group flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary pl-2 pr-2 text-white transition-all duration-200 hover:bg-primary/80"
    :class="{ 'bg-primary/50': active }"
  >
    <p class="text-sm font-medium leading-normal text-white group-hover:text-gray-100">{{ label }}</p>
  </button>
</template>
