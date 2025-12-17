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
    class="max-w-4 flex cursor-pointer gap-2 p-4 text-primary hover:text-primary/80 transition-colors duration-200"
    @click="emit('click')"
  >
    <span
      class="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform duration-200"
      >arrow_back</span
    >
    <span>{{ label }}</span>
  </button>
</template>
