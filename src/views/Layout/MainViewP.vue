<script setup lang="ts">
import AppMenu from './AppMenu/MainView.vue'
import type { MenuItems } from '@/types/types'
import { provide } from 'vue'
const menuItems: MenuItems[] = [
  {
    title: 'Pacientes',
    icon: 'groups',
    routeName: 'DashboardP',
  },
  {
    title: 'Mi Perfil',
    icon: 'person',
    routeName: 'myAccountP',
  },
  {
    title: 'Ayuda',
    icon: 'help',
    routeName: 'HelpP',
  },
]
provide('menuItems', menuItems)
</script>
<template>
  <div
    class="relative flex h-screen flex-col bg-background-light dark:bg-background-dark overflow-y-auto"
  >
    <AppMenu />
    <router-view />
  </div>
</template>
