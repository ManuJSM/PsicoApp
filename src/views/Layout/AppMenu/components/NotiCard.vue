<script setup lang="ts">
  import type { Notification } from '@/types/types'

  const notificationIcons = {
    comment: 'chat_bubble',
    reminder: 'calendar_month',
  } as const

  const props = defineProps<{ notifications: Notification[] }>()

  const emit = defineEmits<{
    (e: 'markRead', id: number): void
    (e: 'deleteAll'): void
  }>()
</script>

<template>
  <div
    class="absolute left-0 right-0 md:left-auto top-full m-2 md:w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/60 z-40 overflow-hidden origin-top-right"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/90"
    >
      <h3 class="font-bold text-slate-900 dark:text-white text-base">
        Notificaciones
      </h3>
      <button
        class="text-xs font-semibold text-primary hover:cursor-pointer transition-colors py-1 px-2 rounded"
        @click="emit('deleteAll')"
      >
        Borrar Todas
      </button>
    </div>

    <!-- Notifications List -->
    <!-- https://vuejs.org/guide/built-ins/transition-group -->
    <transition-group
      name="list"
      tag="article"
      class="min-h-[40vh] md:max-h-[40vh] overflow-x-hidden overflow-y-auto"
    >
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
            <p
              class="text-sm font-bold text-slate-900 dark:text-white truncate"
            >
              {{ notification.title }}
            </p>
            <span
              class="text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap"
            >
              {{ notification.timeAgo }}
            </span>
          </div>
          <p
            class="text-xs text-slate-600 dark:text-slate-400 whitespace-normal"
          >
            {{ notification.message }}
          </p>
        </div>
      </div>
      <div v-if="props.notifications.length == 0">
        <div class="flex flex-col items-center justify-center gap-2 py-12">
          <div class="relative">
            <div
              class="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"
            ></div>
            <div
              class="relative size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700"
            >
              <span class="material-symbols-outlined text-slate-400 text-4xl"
                >notifications_off</span
              >
            </div>
          </div>
          <div class="text-center">
            <h3 class="text-slate-900 dark:text-white font-bold text-lg mb-1">
              No hay notificaciones
            </h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm">
              Todo está en orden por ahora
            </p>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>
