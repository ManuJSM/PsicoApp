<script setup lang="ts">
import type { Notification } from '@/types'

const notificationIcons = {
  comment: 'chat_bubble',
  reminder: 'calendar_month',
} as const

const props = defineProps<{ notifications: Notification[] }>()

const emit = defineEmits<{
  (e: 'markRead', id: number): void
  //   viewAll: () => void
  //   clickNotification: (id: number) => void
}>()

const handleMarkAll = () => {}
// const handleClick = () => {}
</script>

<template>
  <div
    class="absolute right-0 top-full m-2 md:w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/60 z-40 overflow-hidden origin-top-right"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/90"
    >
      <h3 class="font-bold text-slate-900 dark:text-white text-base">Notificaciones</h3>
      <button
        class="text-xs font-semibold text-primary hover:text-blue-600 transition-colors py-1 px-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
        @click="handleMarkAll"
      >
        Marcar todo leído
      </button>
    </div>

    <!-- Notifications List -->
    <div class="md:max-h-[40vh] overflow-y-auto">
      <div
        v-for="notification in props.notifications"
        :key="notification.id"
        class="flex gap-4 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-100 dark:border-slate-700/50 cursor-pointer group"
        @mouseenter="emit('markRead', notification.id)"
      >
        <div class="shrink-0 mt-1">
          <div
            v-show="!notification.read"
            class="h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white dark:ring-slate-800 shadow-sm ease-in-out"
          ></div>
        </div>
        <div class="flex flex-col gap-1 flex-1 min-w-0">
          <div
            class="flex items-center justify-center rounded-full size-10 shrink-0"
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
          <div class="flex justify-between items-baseline gap-2">
            <p class="text-sm font-bold text-slate-900 dark:text-white truncate">
              {{ notification.title }}
            </p>
            <span
              class="text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap"
            >
              {{ notification.timeAgo }}
            </span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400 whitespace-normal">
            {{ notification.message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
