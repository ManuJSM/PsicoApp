<script setup lang="ts">
import MenuButton from '@/views/Layout/AppHeader/components/MenuButton.vue'
import HeaderLogo from '@/views/Layout/AppHeader/components/HeaderLogo.vue'
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import type { MenuItems } from '@/types'
import menuUtils from './utils'

const appName = 'SleepHealth'
const emit = defineEmits(['close'])
const route = useRoute()
const props = defineProps<{ menuItems: MenuItems[] }>()
</script>
<template>
  <aside>
    <div
      @click="emit('close')"
      class="fixed inset-0 bg-gray-900/60 backdrop-blur-[1px] z-20 transition-opacity"
    ></div>
    <section
      class="fixed inset-y-0 left-0 z-40 flex flex-col lg:w-1/4 md:w-1/3 h-full bg-white dark:bg-background-dark border-r border-white/10 dark:border-white/10 shrink-0 transition-transform duration-300 ease-in-out transform"
    >
      <!-- header -->
      <div
        class="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 py-3 px-6 dark:border-white/10 shrink-0"
      >
        <div class="flex items-center gap-4 text-white">
          <MenuButton @click="emit('close')" />
          <HeaderLogo />
          <h2
            class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]"
          >
            {{ appName }}
          </h2>
        </div>
      </div>
      <!-- navigation -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <router-link
          v-for="(item, index) in props.menuItems"
          :key="index"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          :class="menuUtils.getLinkSelected(item.routeName, route.name as string)"
          :to="{ name: item.routeName }"
          @click="emit('close')"
        >
          <span class="material-symbols-outlined transition-colors">{{ item.icon }}</span>
          {{ item.title }}
        </router-link>
      </nav>
    </section>
  </aside>
</template>
