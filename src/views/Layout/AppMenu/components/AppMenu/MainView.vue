<script setup lang="ts">
  import AsideMenu from './components/AsideMenu.vue'
  import MovilMenu from './components/MovilMenu.vue'
  import { useAsideMenu } from '@/composables/useAsideMenu'
  import type { MenuItems } from '@/types/types'
  import { inject } from 'vue'

  const menuItems = inject<MenuItems[]>('menuItems', [])

  const { isOpen, close } = useAsideMenu()
</script>
<template>
  <AsideMenu v-show="isOpen" @close="close" :menuItems="menuItems" />
  <MovilMenu :menuItems="menuItems" />
</template>
