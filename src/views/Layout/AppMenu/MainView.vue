<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import NotiCard from './components/NotiCard.vue'
  import type { Notification } from '@/types/types'
  import AppNav from './components/AppMenu/MainView.vue'
  import MenuButton from './components/MenuButton.vue'
  import HeaderLogo from './components/HeaderLogo.vue'
  import NotificationBell from './components/NotificationBell.vue'
  import { useAsideMenu } from '@/composables/useAsideMenu'
  import { deleteAllArray } from '@/views/components/utils/utils'
  import { name } from '@/../package.json'
  import { useMeStore } from '@/stores/me.store'
  import { useNotificationsStore } from '@/stores/notification.store'

  const { open } = useAsideMenu()

  const appName = name.toUpperCase()
  const meStore = useMeStore()
  const notificationsStore = useNotificationsStore()
  onMounted(async () => {
    await meStore.fetchMe()
  })

  const isOpenNotiDrawer = ref<boolean>(false)
</script>
<template>
  <header
    class="fixed top-0 left-0 right-0 md:relative z-40 bg-background-light dark:bg-background-dark/50 backdrop-blur-md flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 dark:border-white/10 px-6 py-3 shrink-0"
  >
    <div class="flex items-center gap-4 text-white">
      <MenuButton @click="open" />
      <RouterLink class="flex items-center gap-2" to="/">
        <HeaderLogo />
        <h2
          class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]"
        >
          {{ appName }}
        </h2>
      </RouterLink>
    </div>
    <div class="flex flex-1 justify-end gap-4">
      <div>
        <NotificationBell
          :is-active="isOpenNotiDrawer"
          :has-unread="notificationsStore.unreadCount > 0"
          @click="isOpenNotiDrawer = !isOpenNotiDrawer"
        />
        <div
          v-if="isOpenNotiDrawer"
          class="fixed inset-0 z-40"
          @click="isOpenNotiDrawer = false"
        ></div>
      </div>
      <RouterLink
        to="/myAccount"
        class="bg-center bg-no-repeat aspect-square size-10 bg-cover rounded-full"
        data-alt="Profile picture"
        :style="{ backgroundImage: `url(${meStore.me?.avatar})` }"
      ></RouterLink>
    </div>
  </header>
  <AppNav />
  <Teleport to="body">
    <div
      class="hidden md:block fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-500 ease-in-out"
      :class="
        isOpenNotiDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'
      "
      @click="isOpenNotiDrawer = false"
    ></div>
    <NotiCard v-model="isOpenNotiDrawer" />
  </Teleport>
</template>
