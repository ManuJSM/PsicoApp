<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { type Patient, Status, ToastType } from '@/types'
import SideBar from './components/AppSideBar/AppSidebar.vue'
import AppHeader from './components/AppHeader/AppHeader.vue'
import MainSectionShow from './components/MainSection/MainSectionShow.vue'
import MainSectionAdd from './components/MainSection/MainSectionAdd.vue'
import MainSectionEdit from './components/MainSection/MainSectionEdit.vue'
import NotificationToast from './components/MainSection/components/NotificationToast.vue'
const patients = ref<Patient[]>([
  {
    id: 1,
    name: 'Ana García',
    email: 'ana.garcia@email.com',
    phone: '+1 (555) 123-4567',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDi7DjWBgArlAw_noUDTky-yNcT25lMvPN9HSz-DexcpzcR5WcnGa-krB0KNT6yh_KC7XrKgfgGnErbQyw2t88uOsDrkLO9Y6RWsS_t2KYdFCc5Xal2tZY-72YqNeyGy4qFQkAs7t4BDP9CQgOgnWkxoP3150lTcfiLLr22wfWeYdaIvQG0-1xJxQZgnGAX5q3WZ-uVfUSuobBizFyiE4o0W139BA61WM4fmQTo2j8tFOrcZXECG6VaL5T6E8SvoaXFAyeb2LSwkbA',
    sleepAverage: '7h 15m',
    lastNote: 'Hace 2d',
    consistency: '82%',
    status: Status.Active,
  },
  {
    id: 2,
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+1 (555) 987-6543',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvQ5iQvliShWSS_jRnMjHheMaly86tSDZxjFhHIJ5SCeyUggZ1NQhSQBKO_3_bMwLhkg9Wpw8XdOW9yMu5-r-WrCStluttF3_G0ECWTPszfJOTyv9f28LaCoWQ2_k56Q1E2jvz497rdNiTB-92lKZGUeOaJ1GcCFf1HNMEk7IsNUtKGGvTJnf8RwMJc_l2PN7QobwQZ-8zwLze8HIbc_BV4pa0W8QLn-_UeZDY2D4IkBmv-UlEEbEu_U8HmxOeKVREUd7TeSL292A',
    sleepAverage: '6h 45m',
    lastNote: 'Ayer',
    consistency: '75%',
    status: Status.Active,
  },
  {
    id: 3,
    name: 'Luisa Martínez',
    email: 'luisa.martinez@email.com',
    phone: '+1 (555) 456-7890',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDlnhGmTqlOgCPoUbdUhornc9Iwwqxa81WdliD-Fhn3gtwc7wwGLmSnEpwVySXvfj-OZ4I4aRGRKX_DlI4Ead3zfkLSi_Rs28ze0HAMa6CZg4ESdRSknTjc2UN4CASbAKZFGQriHQx5laCDAYWKAVe049r4wTUOmhtttP0ObSr4kgbtfEgViG_YcYgSaArraZuAG0u0Z6TO-TzhxSpxOsK9Kp19F6t_hQftfldVHL0yALfFwWbH1cskBT-UgUz7rGmNPirYa1eiQOI',
    sleepAverage: '8h 05m',
    lastNote: 'Hace 3d',
    consistency: '88%',
    status: Status.Active,
  },
  {
    id: 4,
    name: 'Javier Gómez',
    email: 'javier.gomez@email.com',
    phone: '+1 (555) 111-2233',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGcb2FTBhhzil5rU1G7Qt9Mx-5ivpKjIwWleJb7UzI4L4Ps3grl9uAhf2QXgYVy3UvcPgXZt1tRzfNDWHacqXLOy8vQL0rLjHf4Ku0HncHvmIFvh3vLIHgvuJ5B-hsPkc2UxpPd0TU7XWn_XEhQ3oP5FnQssDVOadlNsNp2YJz7ny-4CC7B2ROTvd_b0v2ygoRU0EMz8n6RsZjiOm1nXzCeSdISyMG_dWfikNOTSBF6_dmxEL5Su01h24Wv-fm97c3vwWl7PkqAio',
    sleepAverage: '5h 50m',
    lastNote: 'Hace 5d',
    consistency: '65%',
    status: Status.Inactive,
  },
])

// const selectedPatient = ref<Patient | null>(null)
// provide('selectedPatient', selectedPatient)

const selectedPatient = computed<Patient | undefined>(() => {
  return patients.value.find((p) => p.id === activePatientId.value)
})
const activePatientId = ref<number>()
provide('activePatientId', activePatientId)

type ViewMode = 'show' | 'add' | 'edit'
const currentView = ref<ViewMode>('show')
const AddButtonT = 'Añadir Nuevo Paciente'

const showToast = ref<boolean>(false)
const toastType = ref<ToastType>(ToastType.Success)
const toastMessage = ref<string>('')

const setToast = (type: ToastType, message: string) => {
  toastType.value = type
  toastMessage.value = message
  showToast.value = true
}

const handleBack = () => {
  currentView.value = 'show'
}
const handleExit = () => {
  // selectedPatient.value = null
  activePatientId.value = 0
}

const handleAdd = (patient: Patient) => {
  patients.value.push(patient)
  activePatientId.value = patient.id
  currentView.value = 'show'
  setToast(ToastType.Success, 'Paciente añadido correctamente')
}

const handleSave = (patient: Patient) => {
  // selectedPatient.value = patient
  patients.value = patients.value.map((p: Patient) => {
    if (p.id === patient.id) {
      p = patient
    }
    return p
  })
  currentView.value = 'show'
  setToast(ToastType.Success, 'Paciente actualizado correctamente')
}

const handleEdit = () => {
  currentView.value = 'edit'
}

const showAdd = () => {
  currentView.value = 'add'
}
const handleDelete = () => {
  patients.value = patients.value.filter((p: Patient) => p.id !== activePatientId.value)
  // selectedPatient.value = null
  activePatientId.value = 0
  setToast(ToastType.Success, 'Paciente eliminado correctamente')
}
</script>

<template>
  <div
    class="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden"
  >
    <AppHeader />
    <!-- Mobile: Show either sidebar or main section -->
    <div class="md:hidden flex-1 overflow-hidden">
      <SideBar v-if="!selectedPatient && currentView !== 'add'" :patients="patients" />
      <MainSectionShow
        v-else-if="currentView === 'show' && selectedPatient"
        :patient="selectedPatient"
        @exit="handleExit"
        @edit="handleEdit"
      />
      <MainSectionAdd v-else-if="currentView === 'add'" @back="handleBack" @save="handleAdd" />
      <MainSectionEdit
        v-else-if="currentView === 'edit' && selectedPatient"
        :patient="selectedPatient"
        @back="handleBack"
        @save="handleSave"
        @delete="handleDelete"
      />
    </div>

    <!-- Desktop: Show both side by side -->
    <div class="hidden md:flex flex-1 overflow-hidden">
      <div class="w-1/3 lg:w-1/4 overflow-y-auto">
        <SideBar :patients="patients" />
      </div>
      <div class="flex-1 overflow-y-auto">
        <MainSectionShow
          v-if="selectedPatient && currentView === 'show'"
          :patient="selectedPatient"
          @exit="handleExit"
          @edit="handleEdit"
        />
        <MainSectionAdd v-else-if="currentView === 'add'" @save="handleAdd" @back="handleBack" />
        <MainSectionEdit
          v-else-if="selectedPatient && currentView === 'edit'"
          :patient="selectedPatient"
          @save="handleSave"
          @back="handleBack"
          @delete="handleDelete"
        />
      </div>
    </div>
    <button
      v-if="currentView !== 'add'"
      class="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      :title="AddButtonT"
      @click="showAdd"
    >
      <span class="material-symbols-outlined">add</span>
    </button>
    <NotificationToast
      :show="showToast"
      :type="toastType"
      :message="toastMessage"
      @close="showToast = false"
    />
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
