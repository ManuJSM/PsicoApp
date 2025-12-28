<script setup lang="ts">
import { ref, computed } from 'vue'
import NotiCard from './components/NotiCard.vue'
import type { Notification } from '@/types'
import AppNav from './components/AppMenu/MainView.vue'
import MenuButton from './components/MenuButton.vue'
import HeaderLogo from './components/HeaderLogo.vue'
import NotificationBell from './components/NotificationBell.vue'
import { useAsideMenu } from '@/composables/useAsideMenu'
import { deleteAllArray } from '@/views/components/utils/utils'

const { open } = useAsideMenu()

const emit = defineEmits<{
  (e: 'notification-click'): void
}>()

const appName = 'Insomnia'

const avatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAhLF07NBPn2dCqJ0ay3UNdqC3Pye7J919BXFbFt9JbqCA099JXQll6wUcOG3ulXHBBEG5ZK7BojMC99RfGs7-Iei4nINtTBdqoIdRfNrJdEF-WFBLZ1rpqt13EigORRsUEJwi69yEsJmbFOYKg7au74Jm5WJpyRC2Y0Mn683aMldH02asvU9ODjbbNCP_WMrMTOjNjZsvKL2Rm978jH2gdM4_gxC6Ri-5oRl2LnxV5Yn4Et7oefWobfW6WiDbmnKOTJg8VzxZGFCE'

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

const isNotificationActive = ref(false)
const unreadNotifications = computed<boolean>(() => {
  return notifications.value.some((notification) => !notification.read)
})

const handleNotificationClick = () => {
  isNotificationActive.value = !isNotificationActive.value
  emit('notification-click')
}
const handleDeleteAll = async () => {
  await deleteAllArray(notifications.value)
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
    class="relative flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 dark:border-white/10 px-6 py-3 shrink-0"
  >
    <div class="flex items-center gap-4 text-white">
      <MenuButton @click="open" />
      <HeaderLogo />
      <h2
        class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]"
      >
        {{ appName }}
      </h2>
    </div>
    <div class="flex flex-1 justify-end gap-4">
      <div>
        <NotificationBell
          :is-active="isNotificationActive"
          :has-unread="unreadNotifications"
          @click="handleNotificationClick"
        />
        <div
          v-if="isNotificationActive"
          class="fixed inset-0 z-40"
          @click="isNotificationActive = false"
        ></div>
        <NotiCard
          v-if="isNotificationActive"
          @close="isNotificationActive = false"
          @markRead="handleMarkRead"
          @deleteAll="handleDeleteAll"
          :notifications="notifications"
        />
      </div>
      <div
        class="bg-center bg-no-repeat aspect-square size-10 bg-cover rounded-full"
        data-alt="Profile picture"
        :style="{ backgroundImage: `url(${avatar})` }"
      ></div>
    </div>
    <AppNav />
  </header>
</template>
