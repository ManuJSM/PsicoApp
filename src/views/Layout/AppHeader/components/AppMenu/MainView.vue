<script setup lang="ts">
import AsideMenu from './components/AsideMenu.vue'
import MovilMenu from './components/MovilMenu.vue'
import { useAsideMenu } from '@/composables/useAsideMenu'
import type { MenuItems } from '@/types'
const menuItems: MenuItems[] = [
  {
    title: 'Pacientes',
    icon: 'groups',
    routeName: 'Dashboard',
  },
  {
    title: 'Mi Perfil',
    icon: 'person',
    routeName: 'User',
  },
  {
    title: 'Ayuda',
    icon: 'help',
    routeName: 'User',
  },
]

const { isOpen, close } = useAsideMenu()
</script>
<template>
  <AsideMenu v-show="isOpen" @close="close" :menuItems="menuItems" />
  <MovilMenu :menuItems="menuItems" />
</template>
