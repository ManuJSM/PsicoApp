<script setup lang="ts">
import { ref } from 'vue'
import MenuButton from './components/MenuButton.vue'
import UserHeader from './components/UserHeader.vue'
import SleepC from './components/SleepC.vue'
import AppFooter from './components/AppFooter.vue'
import NotifiShow from './components/NotifiShow.vue'

const showNotifications = ref(false)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}
</script>
<template>
  <div class="bg-background-light dark:bg-background-dark font-display">
    <div class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div class="layout-container flex h-full grow flex-col">
        <div class="flex flex-1 justify-center p-0 sm:p-5">
          <div
            class="layout-content-container flex w-full flex-col max-w-[500px] flex-1 bg-white dark:bg-background-dark sm:rounded-xl sm:shadow-lg sm:overflow-hidden"
          >
            <UserHeader @notification-click="toggleNotifications" />
            <main v-if="!showNotifications" class="flex flex-col flex-1 px-6 pt-6 pb-10 gap-6">
              <div class="flex flex-col gap-1">
                <h1
                  class="text-gray-900 dark:text-white tracking-tight text-2xl font-bold leading-tight"
                >
                  ¿Listo para NO dormir?
                </h1>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal">
                  Bienvenido al club de los Insomnes
                </p>
              </div>
              <SleepC />
              <div class="flex flex-col gap-3 mt-2">
                <h4
                  class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1"
                >
                  Ajustes de cuenta
                </h4>
                <MenuButton
                  icon="person"
                  icon-background="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300"
                  title="Mi Cuenta"
                  description="Datos personales y perfil"
                  hover-color="hover:bg-blue-50 dark:hover:bg-blue-500/20"
                />
                <MenuButton
                  icon="help_outline"
                  icon-background="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300"
                  hover-color="hover:bg-purple-50 dark:hover:bg-purple-500/20"
                  title="Ayuda y Soporte"
                  description="FAQ y contacto"
                />

                <MenuButton
                  icon="logout"
                  icon-background="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                  hover-color="hover:bg-red-50 dark:hover:bg-red-500/20"
                  title="Cerrar Sesión"
                  description=""
                  :show-chevron="false"
                />
              </div>
            </main>
            <Transition name="slide-fade">
              <NotifiShow v-if="showNotifications" />
            </Transition>
            <AppFooter />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Enter and leave animations */
.slide-fade-enter-active {
  transition:
    transform 0.3s cubic-bezier(1, 0.5, 0.8, 1),
    opacity 0.3s ease-out;
}

/* Same transform and opacity for both enter and leave */
.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateX(0);
  opacity: 1;
}
</style>
