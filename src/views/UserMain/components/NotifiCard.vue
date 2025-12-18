<script setup lang="ts">
import { ref } from 'vue'
import type { Notification } from '@/types'

const notificationIcons = {
  comment: 'chat_bubble',
  reminder: 'calendar_month',
} as const

const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'comment',
    title: 'Nuevo comentario',
    message: 'Tu psicólogo ha añadido un comentario a tu registro del lunes.',
    timeAgo: 'Hace 2 horas',
    read: false,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Recordatorio de sesión',
    message: 'Mañana tienes una sesión programada a las 16:00 con el Dr. Martínez.',
    timeAgo: 'Ayer',
    read: true,
  },
  {
    id: 3,
    type: 'comment',
    title: 'Has comentado a tus muertos',
    message: 'Hello putitas',
    timeAgo: 'Hace 3 días',
    read: true,
  },
])

const markAllAsRead = () => {
  notifications.value = notifications.value.map((notification) => ({
    ...notification,
    read: true,
  }))
}

const markAsRead = (id: number) => {
  notifications.value = notifications.value.map((notification) => {
    if (notification.id === id) {
      notification.read = true
    }
    return notification
  })
}
</script>

<template>
  <main class="flex flex-col">
    <div class="px-6 pt-6 pb-4 mb-2 border-b-2 border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h1 class="text-gray-900 dark:text-white tracking-tight text-2xl font-bold leading-tight">
          Notificaciones
        </h1>
        <button
          class="text-sm font-semibold text-primary hover:text-blue-600 transition-colors active:scale-95"
        >
          <button @click="markAllAsRead">Marcar todo como leído</button>
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="group flex flex-col gap-3 p-4 rounded-xl border cursor-pointer active:scale-[0.98] transition-all"
        :class="[
          notification.read
            ? 'bg-white dark:bg-gray-800/40 border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800'
            : {
                'bg-blue-50/60 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30':
                  notification.type === 'comment',
                'bg-purple-50/60 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30':
                  notification.type === 'reminder',
              },
          'hover:shadow-sm',
        ]"
      >
        <div class="flex items-start gap-4" @mouseenter="markAsRead(notification.id)">
          <div
            class="flex items-center justify-center rounded-full size-12 shrink-0"
            :class="{
              'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400':
                notification.type === 'comment',
              'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400':
                notification.type === 'reminder',
            }"
          >
            <span class="material-symbols-outlined">{{
              notificationIcons[notification.type]
            }}</span>
          </div>
          <div class="flex flex-1 flex-col gap-1.5">
            <div class="flex justify-between items-start">
              <p class="text-gray-900 dark:text-white text-sm font-bold leading-snug">
                {{ notification.title }}
              </p>
              <span
                v-if="!notification.read"
                class="size-2.5 bg-primary rounded-full mt-1.5 shrink-0 shadow-sm shadow-primary/30"
              ></span>
            </div>
            <p class="text-sm leading-relaxed font-medium text-gray-600 dark:text-gray-300">
              {{ notification.message }}
            </p>
            <p class="text-xs text-gray-400 mt-1 font-medium">{{ notification.timeAgo }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
