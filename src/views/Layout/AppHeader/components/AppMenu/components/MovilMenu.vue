<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { MenuItems } from '@/types/types'
import menuUtils from './utils'
const route = useRoute()

const props = defineProps<{ menuItems: MenuItems[] }>()
</script>
<template>
  <nav
    class="md:hidden fixed left-0 right-0 bottom-0 z-40 opacity-90 bg-white/80 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
  >
    <div :class="['grid', 'grid-cols-3', 'h-16', 'items-center']">
      <router-link
        v-for="(item, index) in props.menuItems"
        :key="index"
        :to="{ name: item.routeName }"
        class="flex flex-col items-center justify-center gap-1 h-full transition-colors"
        :class="menuUtils.getLinkSelected(item.routeName, route.name as string)"
      >
        <span class="material-symbols-outlined text-[24px]">{{ item.icon }}</span>
        <span class="text-[10px]">{{ item.title }}</span>
      </router-link>
    </div>
  </nav>
</template>
