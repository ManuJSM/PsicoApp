<script setup lang="ts">
import BackButton from './components/BackButton.vue'
defineEmits(['back'])
</script>
<template>
  <BackButton @click="$emit('back')" label="Cerrar" />
  <h1 class="text-primary">Main Section Add</h1>
</template>
