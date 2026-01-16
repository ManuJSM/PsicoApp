<script setup lang="ts">
  import { provide } from 'vue'
  import AppMenu from './AppMenu/MainView.vue'
  import type { MenuItems } from '@/types/types'
  const menuItems: MenuItems[] = [
    {
      title: 'Apps',
      icon: 'apps',
      routeName: 'DashboardU',
    },
    {
      title: 'Mi Perfil',
      icon: 'person',
      routeName: 'myAccountU',
    },
    {
      title: 'Ayuda',
      icon: 'help',
      routeName: 'HelpU',
    },
  ]
  provide('menuItems', menuItems)
</script>

<!-- class="relative flex h-screen flex-col bg-background-light dark:bg-background-dark overflow-y-auto" -->
<template>
  <div
    class="relative flex h-screen flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100"
  >
    <AppMenu />
    <router-view />
  </div>
</template>
