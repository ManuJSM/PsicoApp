<script setup lang="ts">
import AppHeader from '../DashboardP/components/AppHeader/AppHeader.vue'
</script>
<template>
  <div
    class="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden"
  >
    <AppHeader />
    <slot />
  </div>
</template>
