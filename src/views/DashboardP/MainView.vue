<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { type Patient, Status, ToastType } from '@/types/types'
  import SideBar from './components/AppSideBar/AppSidebar.vue'
  import MainSectionShow from './components/MainSection/MainSectionShow.vue'
  import MainSectionAdd from './components/MainSection/MainSectionAdd.vue'
  import MainSectionEdit from './components/MainSection/MainSectionEdit.vue'
  import { useToast } from '@/composables/useToast'
  import { useRouter } from 'vue-router'
  import { onMounted } from 'vue'
  import { DASHBOARD_P } from '@/router/psico.route'
  const patients = ref<Patient[]>([
    {
      id: 1,
      name: 'Ana García',
      email: 'ana.garcia@email.com',
      phone: '+1 (555) 123-4567',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDi7DjWBgArlAw_noUDTky-yNcT25lMvPN9HSz-DexcpzcR5WcnGa-krB0KNT6yh_KC7XrKgfgGnErbQyw2t88uOsDrkLO9Y6RWsS_t2KYdFCc5Xal2tZY-72YqNeyGy4qFQkAs7t4BDP9CQgOgnWkxoP3150lTcfiLLr22wfWeYdaIvQG0-1xJxQZgnGAX5q3WZ-uVfUSuobBizFyiE4o0W139BA61WM4fmQTo2j8tFOrcZXECG6VaL5T6E8SvoaXFAyeb2LSwkbA',
      status: Status.ACTIVE,
    },
    {
      id: 2,
      name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+1 (555) 987-6543',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCvQ5iQvliShWSS_jRnMjHheMaly86tSDZxjFhHIJ5SCeyUggZ1NQhSQBKO_3_bMwLhkg9Wpw8XdOW9yMu5-r-WrCStluttF3_G0ECWTPszfJOTyv9f28LaCoWQ2_k56Q1E2jvz497rdNiTB-92lKZGUeOaJ1GcCFf1HNMEk7IsNUtKGGvTJnf8RwMJc_l2PN7QobwQZ-8zwLze8HIbc_BV4pa0W8QLn-_UeZDY2D4IkBmv-UlEEbEu_U8HmxOeKVREUd7TeSL292A',
      status: Status.ACTIVE,
    },
    {
      id: 5,
      name: 'Luisa Martínez',
      email: 'luisa.martinez@email.com',
      phone: '+1 (555) 456-7890',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDlnhGmTqlOgCPoUbdUhornc9Iwwqxa81WdliD-Fhn3gtwc7wwGLmSnEpwVySXvfj-OZ4I4aRGRKX_DlI4Ead3zfkLSi_Rs28ze0HAMa6CZg4ESdRSknTjc2UN4CASbAKZFGQriHQx5laCDAYWKAVe049r4wTUOmhtttP0ObSr4kgbtfEgViG_YcYgSaArraZuAG0u0Z6TO-TzhxSpxOsK9Kp19F6t_hQftfldVHL0yALfFwWbH1cskBT-UgUz7rGmNPirYa1eiQOI',
      status: Status.ACTIVE,
    },
    {
      id: 4,
      name: 'Javier Gómez',
      email: 'javier.gomez@email.com',
      phone: '+1 (555) 111-2233',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCGcb2FTBhhzil5rU1G7Qt9Mx-5ivpKjIwWleJb7UzI4L4Ps3grl9uAhf2QXgYVy3UvcPgXZt1tRzfNDWHacqXLOy8vQL0rLjHf4Ku0HncHvmIFvh3vLIHgvuJ5B-hsPkc2UxpPd0TU7XWn_XEhQ3oP5FnQssDVOadlNsNp2YJz7ny-4CC7B2ROTvd_b0v2ygoRU0EMz8n6RsZjiOm1nXzCeSdISyMG_dWfikNOTSBF6_dmxEL5Su01h24Wv-fm97c3vwWl7PkqAio',
      status: Status.INACTIVE,
    },
  ])
  const props = defineProps<{
    //viene de la url
    id?: string
  }>()
  onMounted(() => {})

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
    router.push({ name: DASHBOARD_P })
  }

  const handleAdd = (patient: Patient) => {
    patients.value.push(patient)
    router.push({ name: DASHBOARD_P, params: { id: String(patient.id) } })
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
  <div class="flex flex-1 overflow-y-auto">
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
      class="flex-1"
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
