<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { type Patient, ToastType } from '@/types/types'
  import SideBar from './components/AppSideBar/AppSidebar.vue'
  import MainSectionShow from './components/SleepCalendar/MainView.vue'
  import MainSectionAdd from './components/MainSection/MainSectionAdd.vue'
  import MainSectionEdit from './components/MainSection/MainSectionEdit.vue'
  import { useToast } from '@/composables/useToast'
  import { useRouter } from 'vue-router'
  import { onMounted } from 'vue'
  import { DASHBOARD_P_ROOT } from '@/router/psico.route'
  import { fetchMePatients } from '@/api/SleepData/me.api'
  const patients = ref<Patient[]>([])
  const props = defineProps<{
    //viene de la url
    currentTab?: 'sleepCalendar' | 'add' | 'edit'
    id?: string
  }>()
  onMounted(async () => {
    const fetchedPatients = await fetchMePatients()
    patients.value = fetchedPatients || []
  })

  const router = useRouter()

  const selectedPatient = computed<Patient | undefined>(() => {
    return patients.value.find(p => p.id === Number(props.id))
  })

  type ViewMode = 'show' | 'add' | 'edit'
  const currentView = ref<ViewMode>('show')

  const { setToast } = useToast()

  const handleBack = () => {
    currentView.value = 'show'
  }
  const handleExit = () => {
    router.push({ name: DASHBOARD_P_ROOT })
  }

  const handleAdd = (patient: Patient) => {
    patients.value.push(patient)
    router.push({ name: DASHBOARD_P_ROOT, params: { id: String(patient.id) } })
    currentView.value = 'show'
    setToast(ToastType.SUCCESS, 'Paciente añadido correctamente')
  }

  const handleSave = (patient: Patient) => {
    patients.value = patients.value.map((p: Patient) => {
      if (p.id === patient.id) {
        p = patient
      }
      return p
    })
    currentView.value = 'show'
    setToast(ToastType.SUCCESS, 'Paciente actualizado correctamente')
  }

  const showEdit = () => {
    currentView.value = 'edit'
  }

  const showAdd = () => {
    currentView.value = 'add'
  }
  const handleDelete = () => {
    patients.value = patients.value.filter(
      (p: Patient) => p.id !== Number(props.id)
    )
    currentView.value = 'show'
    handleExit()
    setToast(ToastType.SUCCESS, 'Paciente eliminado correctamente')
  }
</script>

<template>
  <!-- gracias a min-h-0 permito que el sidebar pueda ser mas pequenio que su contenido con lo que hace que respete el espacio disponible -->
  <div class="flex h-full min-h-0 flex-1">
    <!-- Sidebar -->
    <div
      class="w-full md:w-1/3 lg:w-1/4"
      :class="{
        'hidden md:block': selectedPatient || currentView === 'add',
      }"
    >
      <SideBar :patients="patients" @add="showAdd" />
    </div>

    <!-- Main section -->
    <div
      class="flex h-full flex-1 min-h-0"
      :class="{
        'hidden md:block': !selectedPatient && currentView !== 'add',
      }"
    >
      <MainSectionShow
        v-if="currentView === 'show' && selectedPatient"
        :patient="selectedPatient"
        @exit="handleExit"
        @edit="showEdit"
      />

      <MainSectionAdd
        v-else-if="currentView === 'add'"
        @back="handleBack"
        @save="handleAdd"
      />

      <MainSectionEdit
        v-else-if="currentView === 'edit' && selectedPatient"
        :patient="selectedPatient"
        @back="handleBack"
        @save="handleSave"
        @delete="handleDelete"
      />
    </div>
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
