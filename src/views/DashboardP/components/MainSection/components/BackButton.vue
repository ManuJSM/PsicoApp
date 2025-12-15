<script setup lang="ts">
const emit = defineEmits(['click'])

defineProps({
  label: {
    type: String,
    default: 'Volver',
  },
})
</script>

<template>
  <button
    @click="emit('click')"
    class="group flex cursor-pointer items-center gap-2 p-4 text-primary hover:text-primary/80 transition-colors duration-200"
  >
    <span
      class="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform duration-200"
      >arrow_back</span
    >
    <span>{{ label }}</span>
  </button>
</template>
