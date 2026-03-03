<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import type {
    Notification,
    NotificationType,
  } from '@/types/notification.types'
  import { useNotificationsStore } from '@/stores/notification.store'
  import { formatCreatedAt } from '@/utils/date.utils'

  // Control de visibilidad (v-model)
  const model = defineModel<boolean>({ required: true })
  const notificationsStore = useNotificationsStore()

  const handleNotificationClick = (id: string) => {
    notificationsStore.markAsRead(id)
  }
  onMounted(async () => {
    await notificationsStore.fetchNotifications()
  })

  const getIcon = (tipo: NotificationType) => {
    switch (tipo) {
      // case 'warning':
      //   return 'warning'
      // case 'error':
      //   return 'error'
      // case 'success':
      //   return 'check_circle'
      default:
        return 'info'
    }
  }

  const getIconColor = (tipo: NotificationType) => {
    switch (tipo) {
      // case 'warning':
      //   return 'text-orange-400'
      // case 'error':
      //   return 'text-red-400'
      // case 'success':
      //   return 'text-green-400'
      default:
        return 'text-primary'
    }
  }
  const ultimaActualizacion = computed(() => {
    return new Date().toLocaleString('es', {
      hour: '2-digit',
      minute: '2-digit',
    })
  })

  const handleClearAll = () => {
    console.log('clear all')
  }
</script>

<template>
  <aside
    class="fixed top-0 right-0 h-full w-full md:w-[400px] bg-card-dark border-l border-border-dark shadow-2xl z-50 transition-transform duration-500 flex flex-col"
    :class="model ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="p-6 border-b border-border-dark">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-white">Notificaciones</h2>
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full"
          >
            {{ notificationsStore.unreadCount }} nuevas
          </span>
        </div>
        <button
          class="text-white/60 hover:text-white transition-colors"
          @click="model = false"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="flex items-center justify-between text-sm">
        <button
          @click="handleClearAll"
          class="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-sm">delete_sweep</span>
          Limpiar todas
        </button>
        <span class="text-gray-500 text-xs italic">
          Última actualización:
          {{ ultimaActualizacion }}
        </span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
      <div
        v-if="notificationsStore.items.length === 0"
        class="h-full flex flex-col items-center justify-center text-gray-500 space-y-2"
      >
        <span class="material-symbols-outlined text-4xl opacity-20"
          >notifications_off</span
        >
        <p>No tienes notificaciones</p>
      </div>

      <div
        v-for="notif in notificationsStore.items"
        :key="notif.id"
        @click="handleNotificationClick(notif.id)"
        class="p-4 rounded-lg border transition-all cursor-pointer group"
        :class="[
          notif.isRead
            ? 'bg-transparent border-border-dark opacity-60'
            : 'bg-white/5 border-primary/30 hover:border-primary/60 shadow-lg',
        ]"
      >
        <div class="flex gap-3">
          <span
            class="material-symbols-outlined mt-1"
            :class="getIconColor(notif.type)"
          >
            {{ getIcon(notif.type) }}
          </span>

          <div class="flex-1">
            <div class="flex justify-between items-start">
              <h4
                class="font-bold text-sm"
                :class="notif.isRead ? 'text-gray-400' : 'text-white'"
              >
                {{ notif.title }}
              </h4>
              <span class="text-[10px] text-gray-500 uppercase font-medium">
                {{ formatCreatedAt(notif.createdAt) }}
              </span>
            </div>
            <p class="text-sm text-gray-400 mt-1 leading-snug">
              {{ notif.message }}
            </p>
          </div>

          <div v-if="!notif.isRead" class="flex flex-col justify-center">
            <div
              class="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden md:block p-4 border-t border-border-dark bg-black/20">
      <button
        @click="model = false"
        class="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded text-sm font-bold transition-colors"
      >
        Cerrar panel
      </button>
    </div>
  </aside>
</template>
