<script setup lang="ts">
import SideFinder from './components/SideFinder.vue'
import FilterButton from './components/FilterButton.vue'
import CardList from './components/CardList.vue'
import type { Patient } from '@/types'
import { ref, computed } from 'vue'
const title: string = 'Pacientes'
const searchQuery = ref<string>('')
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
    status: 'active',
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
    status: 'active',
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
    status: 'active',
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
    status: 'inactive',
  },
])
// Filtrar pacientes
const filteredPatients = computed<Patient[]>(() => {
  if (!searchQuery.value) return patients.value
  return patients.value.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})
</script>
<template>
  <aside
    class="col-span-1 flex flex-col border-r border-white/10 bg-slate-100/30 dark:bg-white/5 h-full overflow-y-auto"
  >
    <div
      class="p-4 space-y-4 sticky top-0 bg-slate-100/80 dark:bg-background-dark/80 backdrop-blur-sm z-10 border-b border-white/10"
    >
      <h3 class="text-xl font-bold text-slate-900 dark:text-white px-2">{{ title }}</h3>
      <!-- Buscador -->
      <SideFinder v-model:searchQuery="searchQuery" placeholder="Buscar paciente" />
      <div class="flex gap-3 overflow-x-auto pb-1">
        <FilterButton label="Todos" />
        <FilterButton label="Activos" />
        <FilterButton label="Inactivos" />
      </div>
    </div>

    <CardList :patients="filteredPatients" />
  </aside>
</template>
