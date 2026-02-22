<script setup lang="ts">
  import SideFinder from './components/SideFinder.vue'
  import FilterButton from './components/FilterButton.vue'
  import CardList from './components/CardList.vue'
  import { type Patient } from '@/types/types'
  type Filtro = 'all' | 'active' | 'inactive'
  import { ref, computed } from 'vue'
  const searchQuery = ref<string>('')
  const filterButton = ref<Filtro>('active')

  const props = defineProps<{ patients: Patient[] }>()
  const emits = defineEmits(['add'])

  // Filtrar pacientes
  const filteredPatients = computed<Patient[]>(() => {
    const currentFilter =
      filterButton.value === 'all'
        ? props.patients
        : props.patients.filter((patient: Patient) =>
            filterButton.value === 'active' ? patient.active : !patient.active
          )

    if (!searchQuery.value) return currentFilter
    return currentFilter.filter(
      (patient: Patient) =>
        patient.fullName
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
</script>
<template>
  <aside class="flex h-full flex-1 min-h-0 flex-col border-r border-white/10">
    <div
      class="p-4 space-y-4 border-b border-white/10 dark:bg-background-dark sticky top-16"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-white">Pacientes</h3>
        <button
          @click="emits('add')"
          class="text-primary hover:text-blue-400 hover:cursor-pointer"
        >
          <span class="material-symbols-outlined">person_add</span>
        </button>
      </div>
      <!-- Buscador -->
      <SideFinder
        v-model:searchQuery="searchQuery"
        placeholder="Buscar paciente"
      />
      <div class="flex gap-3 pb-1">
        <FilterButton
          label="Activos"
          :active="filterButton === 'active'"
          @click="filterButton = 'active'"
        />
        <FilterButton
          label="Inactivos"
          :active="filterButton === 'inactive'"
          @click="filterButton = 'inactive'"
        />
        <FilterButton
          label="Todos"
          :active="filterButton === 'all'"
          @click="filterButton = 'all'"
        />
      </div>
    </div>

    <CardList :patients="filteredPatients" />
  </aside>
</template>
