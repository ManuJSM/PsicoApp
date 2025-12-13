<script setup lang="ts">
defineEmits(['back'])
</script>
<template>
  <button @click="$emit('back')" class="group flex cursor-pointer items-center gap-2 p-4 text-primary hover:text-primary/80 transition-colors duration-200">
      <span class="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform duration-200">arrow_back</span>
      <span>Volver</span>
    </button>
  <h1 class = 'text-primary'>MainSection Edit</h1>
</template>
