<script setup lang="ts">
  import { ref } from 'vue'
  import UserCalendar from './components/UserCalendar.vue'

  const isDrawerOpen = ref<boolean>(false)
  const selectDate = ref<string>(
    new Date().toISOString().split('T')[0] as string
  )

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }
  const registros = ref([
    { fecha: '2025-01-04T00:00:00.000Z', notification: true },
    { fecha: '2025-01-12T00:00:00.000Z', notification: true },
    { fecha: '2025-01-20T00:00:00.000Z', notification: true },
    { fecha: '2025-01-25T00:00:00.000Z', notification: true },
    { fecha: '2024-12-15T00:00:00.000Z', notification: true },
    { fecha: '2024-11-03T00:00:00.000Z', notification: true },
  ])
</script>

<template>
  <main class="flex-1 flex justify-center py-8 px-4 sm:px-10 lg:px-20">
    <div class="w-full flex flex-col gap-6">
      <div
        class="flex flex-col justify-center items-center lg:flex-row lg:justify-between lg:items-end gap-6 px-2"
      >
        <div class="flex flex-col gap-1">
          <h1
            class="text-white text-3xl font-black leading-tight tracking-tight"
          >
            Vista Diaria Detallada
          </h1>
          <p class="text-[#9dabb9] text-sm font-medium flex items-center gap-2">
            Análisis técnico de la jornada para el paciente.
          </p>
        </div>
        <div
          class="flex flex-wrap justify-center items-center gap-4 p-1.5 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm"
        >
          <button
            class="bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25"
          >
            Día
          </button>
          <button
            class="text-[#9dabb9] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-white transition-all"
          >
            Semana
          </button>
          <button
            class="text-[#9dabb9] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-white transition-all"
          >
            Mes
          </button>
          <button
            class="text-[#9dabb9] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-white transition-all"
          >
            Año
          </button>
        </div>
        <button
          class="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-primary/20 group"
          @click="toggleDrawer"
        >
          <span
            class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform"
            >calendar_today</span
          >
          <span>{{ selectDate }}</span>
        </button>
      </div>
    </div>

    <!-- Overlay y Drawer con v-model -->
    <Teleport to="body">
      <div
        class="hidden md:block fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-500 ease-in-out"
        :class="isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        @click="isDrawerOpen = false"
      ></div>
      <UserCalendar
        v-model="isDrawerOpen"
        :registros="registros"
        v-model:selected-date="selectDate"
      />
    </Teleport>
  </main>
</template>
