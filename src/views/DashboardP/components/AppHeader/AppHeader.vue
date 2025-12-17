<script setup lang="ts">
import { ref } from 'vue'
import NotiCard from './components/NotiCard.vue'

const emit = defineEmits<{
  (e: 'notification-click'): void
}>()
const notifications = [
  {
    id: 1,
    title: 'Registro de Sueño: Ana García',
    description:
      'Calidad de sueño baja reportada (2/5). Comentario: "Tuve pesadillas y desperté varias veces."',
    time: 'Hace 15 min',
    unread: true,
  },
  {
    id: 2,
    title: 'Recordatorio de Sesión',
    description: 'Sesión de seguimiento con Carlos Rodriguez en 30 minutos.',
    time: '09:30 AM',
    unread: true,
  },
  {
    id: 3,
    title: 'Actualización del Sistema',
    description: 'Nuevas métricas de consistencia de sueño disponibles en los reportes semanales.',
    time: 'Ayer',
    unread: false,
  },
]

const isNotificationActive = ref(false)

const handleNotificationClick = () => {
  isNotificationActive.value = !isNotificationActive.value
  emit('notification-click')
}
</script>
<template>
  <header
    class="flex relative items-center justify-between whitespace-nowrap border-b border-solid border-white/10 dark:border-white/10 px-6 py-3 shrink-0"
  >
    <div class="flex items-center gap-4 text-white">
      <div class="size-10 bg-primary rounded-full flex justify-center items-center">
        <img src="@/assets/appIcon.svg" alt="" />
      </div>
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
            'flex items-center justify-center size-10 rounded-full transition-all duration-300 ease-in-out',
            isNotificationActive
              ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary ring-2 ring-primary/20'
              : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300',
          ]"
        >
          <span class="material-symbols-outlined">notifications</span>
        </button>

        <div
          v-if="isNotificationActive"
          class="fixed inset-0 z-40"
          @click="isNotificationActive = false"
        ></div>
        <NotiCard
          v-if="isNotificationActive"
          @close="isNotificationActive = false"
          :notifications="notifications"
          @click.self="isNotificationActive = false"
        />
      </div>
      <div>
        <button
          class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          data-alt="User profile picture"
          style="
            background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhLF07NBPn2dCqJ0ay3UNdqC3Pye7J919BXFbFt9JbqCA099JXQll6wUcOG3ulXHBBEG5ZK7BojMC99RfGs7-Iei4nINtTBdqoIdRfNrJdEF-WFBLZ1rpqt13EigORRsUEJwi69yEsJmbFOYKg7au74Jm5WJpyRC2Y0Mn683aMldH02asvU9ODjbbNCP_WMrMTOjNjZsvKL2Rm978jH2gdM4_gxC6Ri-5oRl2LnxV5Yn4Et7oefWobfW6WiDbmnKOTJg8VzxZGFCE');
          "
        ></button>
        <div
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 z-20 hidden group-hover:block"
        >
          <a
            class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            href="#"
            >Mi Perfil</a
          >
          <a
            class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            href="#"
            >Ajustes</a
          >
          <div class="my-1 border-t border-slate-200 dark:border-slate-700"></div>
          <a
            class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            href="#"
            >Cerrar Sesión</a
          >
        </div>
      </div>
    </div>
  </header>
</template>
