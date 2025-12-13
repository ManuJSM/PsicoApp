<script setup lang="ts">
import { provide, ref } from 'vue'
import type { Patient } from '@/types'
import SideBar from './components/AppSideBar/AppSidebar.vue'
import AppHeader from './components/AppHeader/AppHeader.vue'
import MainSectionShow from './components/MainSection/MainSectionShow.vue'
import MainSectionAdd from './components/MainSection/MainSectionAdd.vue'
import MainSectionEdit from './components/MainSection/MainSectionEdit.vue'

const selectedPatient = ref<Patient | null>(null)
provide('selectedPatient', selectedPatient)
const activePatientId = ref<number>()
provide('activePatientId', activePatientId)

type ViewMode = 'show' | 'add' | 'edit'
const currentView = ref<ViewMode>('show')
const AddButtonT = 'Añadir Nuevo Paciente'

const handleBack = () => {
  currentView.value = 'show'
}
const handleExit = () => {
  selectedPatient.value = null
  activePatientId.value = 0
}

const handleEdit = () => {
  currentView.value = 'edit'
}

const handleAdd = () => {
  currentView.value = 'add'
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
      <MainSectionShow
        v-else-if="currentView === 'show'"
        :patient="selectedPatient"
        @exit="handleExit"
        @edit="handleEdit"
      />
      <MainSectionAdd v-else-if="currentView === 'add'" @back="handleBack" />
      <MainSectionEdit
        v-else-if="currentView === 'edit'"
        :patient="selectedPatient"
        @back="handleBack"
      />
    </div>

    <!-- Desktop: Show both side by side -->
    <div class="hidden md:flex flex-1 overflow-hidden">
      <div class="w-1/3 lg:w-1/4 overflow-y-auto">
        <SideBar />
      </div>
      <div class="flex-1 overflow-y-auto">
        <MainSectionShow
          v-if="selectedPatient && currentView === 'show'"
          :patient="selectedPatient"
          @exit="handleExit"
          @edit="handleEdit"
        />
        <MainSectionAdd v-else-if="currentView === 'add'" @back="handleBack" />
        <MainSectionEdit
          v-else-if="selectedPatient && currentView === 'edit'"
          :patient="selectedPatient"
          @back="handleBack"
        />
      </div>
    </div>
    <button
      v-if="currentView !== 'add'"
      class="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      :title="AddButtonT"
      @click="handleAdd"
    >
      <span class="material-symbols-outlined">add</span>
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
