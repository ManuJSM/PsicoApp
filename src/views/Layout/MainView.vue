<script setup lang="ts">
import AppMenu from './AppHeader/MainView.vue'
</script>
<template>
  <div
    class="relative flex h-screen flex-col bg-background-light dark:bg-background-dark overflow-y-auto"
  >
    <AppMenu />
    <router-view />
  </div>
</template>
