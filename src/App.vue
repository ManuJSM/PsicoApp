<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <Router-view v-slot="{ Component }">
    <transition name="slide-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </Router-view>
</template>

<style>
/* Animación de entrada */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
