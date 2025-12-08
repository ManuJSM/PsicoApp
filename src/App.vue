<script setup lang="ts">
import { provide, ref } from 'vue'
import type { Patient } from '@/types'
import SideBar from './components/AppSideBar/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import AppMainSection from './components/AppMainSection.vue'

const selectedPatient = ref<Patient | null>(null)
provide('selectedPatient', selectedPatient)
const activePatientId = ref<number>()
provide('activePatientId', activePatientId)

const buttonTitle: string = 'Añadir Nuevo Paciente'
const buttonIcon: string = 'add'
const handleBack = () => {
  selectedPatient.value = null
  activePatientId.value = 0
}
</script>

<template>
  <div
    class="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden"
  >
    <AppHeader />
    <!-- Mobile: Show either sidebar or main section -->
    <div class="md:hidden flex-1 overflow-hidden">
      <SideBar v-if="!selectedPatient" />
      <AppMainSection v-else :patient="selectedPatient" @back="handleBack" />
    </div>

    <!-- Desktop: Show both side by side -->
    <div class="hidden md:flex flex-1 overflow-hidden">
      <div class="w-1/3 lg:w-1/4 overflow-y-auto">
        <SideBar />
      </div>
      <div class="flex-1 overflow-y-auto">
        <AppMainSection v-if="selectedPatient" :patient="selectedPatient" @back="handleBack" />
      </div>
    </div>
    <button
      class="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      :title="buttonTitle"
    >
      <span class="material-symbols-outlined">{{ buttonIcon }}</span>
    </button>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  font-size: 20px;
}
</style>
