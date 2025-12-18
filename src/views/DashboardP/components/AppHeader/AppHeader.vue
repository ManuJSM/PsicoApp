<script setup lang="ts">
import { ref, computed } from 'vue'
import NotiCard from './components/NotiCard.vue'
import type { Notification } from '@/types'
import AsideMenu from './components/AsideMenu.vue'
import MenuButton from './components/MenuButton.vue'
import HeaderLogo from './components/HeaderLogo.vue'

const emit = defineEmits<{
  (e: 'notification-click'): void
}>()

const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'comment',
    title: 'Registro de Sueño',
    message:
      'Calidad de sueño baja reportada (2/5). Comentario: "Tuve pesadillas y desperté varias veces."',
    timeAgo: 'Hace 15 min',
    read: false,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Recordatorio de Sesión',
    message: 'Sesión de seguimiento con Carlos Rodriguez en 30 minutos.',
    timeAgo: 'Hace 30 min',
    read: false,
  },
  {
    id: 3,
    type: 'comment',
    title: 'Actualización del Sistema',
    message: 'Nuevas métricas de consistencia de sueño disponibles en los reportes semanales.',
    timeAgo: 'Ayer',
    read: true,
  },
  {
    id: 4,
    type: 'comment',
    title: 'Nuevo Comentario',
    message: 'El paciente ha respondido a tu último mensaje.',
    timeAgo: 'Ayer',
    read: true,
  },
])

const showMenu = ref(false)
const asideMenuClose = () => {
  showMenu.value = false
}

const isNotificationActive = ref(false)
const unreadNotifications = computed<boolean>(() => {
  return notifications.value.some((notification) => !notification.read)
})

const handleNotificationClick = () => {
  isNotificationActive.value = !isNotificationActive.value
  emit('notification-click')
}

const handleMarkRead = (id: number) => {
  notifications.value = notifications.value.map((notification) => {
    if (notification.id === id) {
      notification.read = true
    }
    return notification
  })
}
</script>
<template>
  <header
    class="flex relative items-center justify-between whitespace-nowrap border-b border-solid border-white/10 dark:border-white/10 px-6 py-3 shrink-0"
  >
    <div class="flex items-center gap-4 text-white">
      <MenuButton @click="showMenu = !showMenu" />
      <HeaderLogo />
      <h2
        class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]"
      >
        Dashboard
      </h2>
    </div>
    <div class="flex flex-1 justify-end gap-4">
      <div>
        <button
          @click="handleNotificationClick"
          :class="[
            'relative flex items-center justify-center size-10 rounded-full transition-all duration-100 ease-in-out',
            isNotificationActive
              ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary ring-1 ring-primary/20'
              : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300',
            unreadNotifications
              ? 'text-primary dark:text-primary'
              : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300',
          ]"
        >
          <span class="material-symbols-outlined">notifications</span>
          <span v-show="unreadNotifications" class="absolute top-2.5 right-2.5 flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </button>

        <div
          v-if="isNotificationActive"
          class="fixed inset-0 z-40"
          @click="isNotificationActive = false"
        ></div>
        <NotiCard
          v-if="isNotificationActive"
          @close="isNotificationActive = false"
          @markRead="handleMarkRead"
          :notifications="notifications"
        />
      </div>
      <!-- <div>
        <button
          class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          data-alt="User profile picture"
          style="
            background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhLF07NBPn2dCqJ0ay3UNdqC3Pye7J919BXFbFt9JbqCA099JXQll6wUcOG3ulXHBBEG5ZK7BojMC99RfGs7-Iei4nINtTBdqoIdRfNrJdEF-WFBLZ1rpqt13EigORRsUEJwi69yEsJmbFOYKg7au74Jm5WJpyRC2Y0Mn683aMldH02asvU9ODjbbNCP_WMrMTOjNjZsvKL2Rm978jH2gdM4_gxC6Ri-5oRl2LnxV5Yn4Et7oefWobfW6WiDbmnKOTJg8VzxZGFCE');
          "
        ></button>
      </div> -->
    </div>
  </header>

  <AsideMenu v-show="showMenu" @close="asideMenuClose" />
</template>
