<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import NotificationToast from '@/views/components/NotificationToast.vue'
  import { useToast } from '@/composables/useToast.ts'

  const { showToast, toastType, toastMessage } = useToast()
</script>

<template>
  <Router-view v-slot="{ Component }">
    <transition name="slide-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </Router-view>

  <NotificationToast
    v-model:show="showToast"
    :type="toastType"
    :message="toastMessage"
  />
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
