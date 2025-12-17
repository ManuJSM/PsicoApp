<script setup lang="ts">
import type { Notification } from '@/types'

const props = defineProps<{ notifications: Notification[] }>()

// const emit = defineEmits<{
//   markAllRead: () => void
//   viewAll: () => void
//   clickNotification: (id: number) => void
// }>()

const handleMarkAll = () => {}
const handleViewAll = () => {}
const handleClick = () => {}
</script>

<template>
  <div
    class="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden z-50 origin-top-right"
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
    <div class="max-h-[60vh] overflow-y-auto">
      <div
        v-for="notification in props.notifications"
        :key="notification.id"
        class="flex gap-4 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-100 dark:border-slate-700/50 cursor-pointer group"
        @click="handleClick()"
      >
        <div class="shrink-0 mt-1">
          <div
            v-if="notification.unread"
            class="h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white dark:ring-slate-800 shadow-sm"
          ></div>
        </div>
        <div class="flex flex-col gap-1 flex-1 min-w-0">
          <div class="flex justify-between items-baseline gap-2">
            <p class="text-sm font-bold text-slate-900 dark:text-white truncate">
              {{ notification.title }}
            </p>
            <span
              class="text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap"
            >
              {{ notification.time }}
            </span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {{ notification.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="p-3 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-100 dark:border-slate-700/50 text-center"
    >
      <button
        class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors py-1"
        @click="handleViewAll"
      >
        Ver todas las notificaciones
      </button>
    </div>
  </div>
</template>
