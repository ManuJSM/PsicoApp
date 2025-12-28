<script setup lang="ts">
import { ref } from 'vue'

const start_time = ref<string>('22:00')
const end_time = ref<string>('07:00')
const emit = defineEmits<{
  (e: 'submit', event: SubmitEvent): void
}>()

const handleSubmit = (event: SubmitEvent) => {
  emit('submit', event)
  start_time.value = end_time.value
  end_time.value = ''
}
</script>
<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-4"
  >
    <div class="flex items-center gap-2 mb-1">
      <span class="material-symbols-outlined text-primary">add_circle</span>
      <h2 class="text-gray-900 dark:text-white text-lg font-bold">Añadir Nuevo Intervalo</h2>
    </div>
    <div class="flex flex-col gap-4">
      <div>
        <label
          class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide"
          >Tipo de Intervalo</label
        >
        <div class="grid text-center md:grid-cols-3 items-center gap-3">
          <label class="cursor-pointer">
            <input class="peer sr-only" name="interval_type" checked type="radio" value="sleep" />
            <div
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 peer-checked:ring-1 peer-checked:ring-indigo-500 transition-all shadow-sm"
            >
              <div
                class="flex items-center justify-center size-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shrink-0"
              >
                <span class="material-symbols-outlined text-xl">dark_mode</span>
              </div>
              <span class="text-sm font-bold text-gray-900 dark:text-white flex-1"
                >Tiempo durmiendo</span
              >
              <span
                class="material-symbols-outlined text-indigo-600 dark:text-indigo-400 opacity-0 peer-checked:opacity-100 text-2xl transition-opacity"
                >check_circle</span
              >
            </div>
          </label>
          <label class="cursor-pointer">
            <input class="peer sr-only" name="interval_type" type="radio" value="bed" />
            <div
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 peer-checked:border-amber-500 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-900/20 peer-checked:ring-1 peer-checked:ring-amber-500 transition-all shadow-sm"
            >
              <div
                class="flex items-center justify-center size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0"
              >
                <span class="material-symbols-outlined text-xl">bed</span>
              </div>
              <span class="text-sm font-bold text-gray-900 dark:text-white flex-1"
                >Tiempo en cama sin dormir</span
              >
              <span
                class="material-symbols-outlined text-amber-600 dark:text-amber-400 opacity-0 peer-checked:opacity-100 text-2xl transition-opacity"
                >check_circle</span
              >
            </div>
          </label>
          <label class="cursor-pointer">
            <input class="peer sr-only" name="interval_type" type="radio" value="out" />
            <div
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 peer-checked:ring-1 peer-checked:ring-emerald-500 transition-all shadow-sm"
            >
              <div
                class="flex items-center justify-center size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0"
              >
                <span class="material-symbols-outlined text-xl">directions_walk</span>
              </div>
              <span class="text-sm font-bold text-gray-900 dark:text-white flex-1"
                >Tiempo fuera de la cama</span
              >
              <span
                class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 opacity-0 peer-checked:opacity-100 text-2xl transition-opacity"
                >check_circle</span
              >
            </div>
          </label>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label
            class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide"
            >Día del registro</label
          >
          <div
            class="grid grid-cols-2 gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl h-14 border border-gray-200 dark:border-gray-600 relative z-0"
          >
            <label class="cursor-pointer relative flex-1">
              <input checked class="peer sr-only" name="day" type="radio" value="today" />
              <div
                class="flex items-center justify-center w-full h-full rounded-lg text-sm font-bold text-gray-500 dark:text-gray-400 transition-all duration-200 peer-checked:bg-white dark:peer-checked:bg-gray-600 peer-checked:text-primary dark:peer-checked:text-white peer-checked:shadow-sm"
              >
                Hoy
              </div>
            </label>
            <label class="cursor-pointer relative flex-1">
              <input class="peer sr-only" name="day" type="radio" value="tomorrow" />
              <div
                class="flex items-center justify-center w-full h-full rounded-lg text-sm font-bold text-gray-500 dark:text-gray-400 transition-all duration-200 peer-checked:bg-white dark:peer-checked:bg-gray-600 peer-checked:text-primary dark:peer-checked:text-white peer-checked:shadow-sm"
              >
                Mañana
              </div>
            </label>
          </div>
        </div>
        <div>
          <label
            class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide"
            >Hora Inicio</label
          >
          <input
            class="w-full h-14 rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 text-base focus:ring-primary focus:border-primary block"
            type="time"
            v-model="start_time"
            name="start_time"
          />
        </div>
        <div>
          <label
            class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide"
            >Hora Fin</label
          >
          <input
            class="w-full h-14 rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 text-base focus:ring-primary focus:border-primary block"
            type="time"
            v-model="end_time"
            name="end_time"
          />
        </div>
      </div>
      <button
        type="submit"
        class="flex hover:cursor-pointer items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 transition-colors shadow-sm mt-2"
      >
        <span class="material-symbols-outlined text-xl">add</span>
        Añadir Intervalo
      </button>
    </div>
  </form>
</template>
