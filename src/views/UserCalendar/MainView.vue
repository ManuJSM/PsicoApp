<script setup lang="ts">
  import { computed, ref } from 'vue'
  import UserCalendar from './components/UserCalendar.vue'
  import VistaDiaria from './components/VistaDiaria/MainView.vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const isDrawerOpen = ref<boolean>(false)
  const props = defineProps<{
    date: string
  }>()
  const selectDate = computed({
    get: () => props.date,
    set: (newDate: string) => {
      router.push({
        name: 'UserCalendar',
        params: { date: newDate },
      })
    },
  })

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
  <main class="flex-1 h-full min-h-0 flex justify-center">
    <div class="w-full flex flex-col gap-4">
      <div
        class="sticky md:relative top-0 z-10 backdrop-blur-md md:px-4 xl:px-20 flex pt-4 flex-col justify-center items-center lg:flex-row lg:justify-between lg:items-end gap-6"
      >
        <div class="flex flex-col gap-1">
          <h1
            class="text-white text-3xl font-black leading-tight tracking-tight"
          >
            Vista Diaria Detallada
          </h1>
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
      <VistaDiaria :selected-date="selectDate" />
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
<style>
  .glass-card {
    background: rgba(28, 33, 39, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(19, 127, 236, 0.15);
  }
  .btn-glow {
    box-shadow: 0 0 20px rgba(19, 127, 236, 0.4);
  }
</style>
