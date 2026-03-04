<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import type { NotificationType } from '@/types/notification.types'
  import { useNotificationsStore } from '@/stores/notification.store'
  import { formatCreatedAt } from '@/utils/date.utils'

  const model = defineModel<boolean>({ required: true })
  const notificationsStore = useNotificationsStore()

  const handleNotificationClick = (id: string) => {
    notificationsStore.markAsRead(id)
  }

  onMounted(async () => {
    await notificationsStore.fetchNotifications()
  })

  // TUS FUNCIONES ORIGINALES
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

  const handleClearAll = async () => {
    await notificationsStore.clearAll()
  }
</script>
<template>
  <aside
    class="fixed top-0 right-0 h-full w-full md:w-[420px] bg-card-dark border-l border-border-dark shadow-2xl z-50 transition-transform duration-500 flex flex-col"
    :class="model ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- HEADER -->
    <div class="p-6 border-b border-border-dark bg-white/2 flex-none">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold text-white tracking-tight">
            Notificaciones
          </h2>
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="bg-primary/20 text-primary text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-primary/30"
          >
            {{ notificationsStore.unreadCount }} nuevas
          </span>
        </div>

        <button
          @click="model = false"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50"
        >
          <span class="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      <div class="flex items-center justify-between text-sm">
        <button
          @click="handleClearAll"
          :disabled="notificationsStore.items.length === 0"
          class="text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 font-medium disabled:opacity-30"
        >
          <span class="material-symbols-outlined text-lg">delete_sweep</span>
          Limpiar todas
        </button>

        <span class="text-gray-600 text-xs font-light">
          Actualizado: {{ ultimaActualizacion }}
        </span>
      </div>
    </div>

    <!-- BODY -->
    <div
      class="flex-1 overscroll-y-contain transition-all ease-in-out duration-100 overflow-y-auto p-4 overflow-x-hidden relative min-h-0"
    >
      <TransitionGroup name="notif" tag="div" class="relative">
        <div
          v-for="notif in notificationsStore.items"
          :key="notif.id"
          @click="handleNotificationClick(notif.id)"
          class="notif-card relative group cursor-pointer rounded-xl border flex flex-col w-full mb-3"
          :class="[
            notif.isRead
              ? 'bg-transparent border-white/5 opacity-60 hover:opacity-100 hover:border-white/10'
              : 'bg-white/3 border-white/10 shadow-lg hover:bg-white/6 hover:border-primary/30',
          ]"
        >
          <div
            v-if="!notif.isRead"
            class="absolute -left-0.5 top-6 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]"
          ></div>

          <div class="p-4 flex gap-4">
            <div class="shrink-0">
              <div
                class="w-11 h-11 rounded-lg flex items-center justify-center ring-1 ring-inset"
                :class="
                  notif.isRead
                    ? 'bg-gray-400/40 ring-white/5'
                    : 'bg-primary/10 ring-primary/20 group-hover:bg-primary/30'
                "
              >
                <span
                  class="material-symbols-outlined text-[22px]"
                  :class="getIconColor(notif.type)"
                >
                  {{ getIcon(notif.type) }}
                </span>
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start mb-1">
                <h4
                  class="text-sm font-semibold truncate"
                  :class="notif.isRead ? 'text-gray-400' : 'text-gray-100'"
                >
                  {{ notif.title }}
                </h4>

                <time class="text-[10px] font-medium text-gray-500">
                  {{ formatCreatedAt(notif.createdAt) }}
                </time>
              </div>

              <p
                class="text-sm leading-snug line-clamp-2"
                :class="notif.isRead ? 'text-gray-500' : 'text-gray-400'"
              >
                {{ notif.message }}
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center p-1">
            <span
              class="text-[8px] px-2 py-0.5 rounded bg-white/5 text-gray-500 font-bold uppercase border border-white/5"
            >
              {{ notif.type }}
            </span>
            <transition name="fade">
              <span
                v-show="notif.isRead"
                class="material-symbols-outlined text-[16px]! text-emerald-500/30"
              >
                done_all
              </span>
            </transition>
          </div>
        </div>
      </TransitionGroup>
      <div
        v-if="notificationsStore.items.length === 0"
        class="h-full flex flex-col items-center justify-center text-gray-400 space-y-2"
      >
        <span class="material-symbols-outlined text-4xl opacity-20"
          >notifications_off</span
        >
        <p>No tienes notificaciones</p>
      </div>
    </div>

    <!-- FOOTER -->
    <div
      class="hidden md:block p-4 border-t border-border-dark bg-card-dark flex-none"
    >
      <button
        @click="model = false"
        class="w-full py-2.5 bg-white/3 hover:bg-white/8 border border-white/10 text-white/70 rounded-lg text-sm font-bold transition-all"
      >
        Cerrar Panel
      </button>
    </div>
  </aside>
</template>
<style scoped>
  /* ENTER */
  .notif-enter-active,
  .notif-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .notif-enter-from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }

  .notif-enter-to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  /* LEAVE */
  .notif-leave-from {
    opacity: 1;
    transform: translateY(0);
  }

  .notif-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }

  .notif-move {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .notif-leave-active {
    position: absolute;
    width: 100%;
  }
</style>
