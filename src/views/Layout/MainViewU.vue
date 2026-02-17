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

<template>
  <div
    class="relative flex h-full md:h-screen flex-col bg-background-light dark:bg-background-dark pt-safe-top pb-safe-sm"
  >
    <AppMenu />
    <router-view />
  </div>
</template>
