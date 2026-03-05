<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { DASHBOARD_P_ROOT } from '@/router/psico.route'

  import SideBar from './components/AppSideBar/AppSidebar.vue'
  import MainSectionShow from './components/SleepCalendar/MainView.vue'
  import MainSectionAdd from './components/MainSection/MainSectionAdd.vue'
  import MainSectionEdit from './components/MainSection/MainSectionEdit.vue'

  import { usePatients } from '@/composables/usePatients'

  const props = defineProps<{
    currentTab?: 'sleepCalendar' | 'add' | 'edit'
    id?: string
  }>()

  const router = useRouter()
  const {
    patients,
    loading,
    loadPatients,
    handleAdd,
    handleSave,
    handleDelete,
  } = usePatients()

  type ViewMode = 'show' | 'add' | 'edit'
  const currentView = ref<ViewMode>('show')

  onMounted(loadPatients)

  const selectedPatient = computed(() =>
    patients.value.find(p => p.id === Number(props.id))
  )

  const handleBack = () => (currentView.value = 'show')
  const handleExit = () => router.push({ name: DASHBOARD_P_ROOT })

  const onAdd = async (data: any) => {
    const success = await handleAdd(data)
    if (success) currentView.value = 'show'
  }

  const onSave = async (data: any) => {
    const success = await handleSave(data)
    if (success) currentView.value = 'show'
  }

  const onDelete = async () => {
    const success = await handleDelete(Number(props.id))
    if (success) handleExit()
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
      <SideBar :patients="patients" @add="currentView = 'add'" />
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
        @edit="currentView = 'edit'"
      />

      <MainSectionAdd
        v-else-if="currentView === 'add'"
        @back="handleBack"
        @save="onAdd"
      />

      <MainSectionEdit
        v-else-if="currentView === 'edit' && selectedPatient"
        :patient="selectedPatient"
        @back="handleBack"
        @save="onSave"
        @delete="onDelete"
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
