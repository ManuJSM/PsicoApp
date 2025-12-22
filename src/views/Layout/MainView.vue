<script setup lang="ts">
import AppMenu from './AppHeader/MainView.vue'
</script>
<template>
  <div
    class="flex min-h-dvh md:h-screen flex-col bg-background-light dark:bg-background-dark overflow-hidden"
  >
    <AppMenu />
    <router-view />
  </div>
</template>
