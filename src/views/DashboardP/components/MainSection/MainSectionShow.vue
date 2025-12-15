<script setup lang="ts">
import type { Patient } from '@/types'

defineProps<{
  patient: Patient
}>()

defineEmits(['exit', 'edit'])
</script>
<template>
  <section
    class="md:col-span-2 xl:col-span-3 flex flex-col bg-background-light dark:bg-background-dark h-full overflow-y-auto"
  >
    <!-- TODO sacar el boton a component -->
    <button
      @click="$emit('exit')"
      class="group flex cursor-pointer items-center gap-2 p-4 text-primary hover:text-primary/80 transition-colors duration-200"
    >
      <span
        class="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform duration-200"
        >arrow_back</span
      >
      <span>Cerrar</span>
    </button>
    <div class="flex-1 overflow-y-auto p-6 space-y-6">
      <div class="flex flex-wrap items-center gap-4 justify-between">
        <div class="flex items-center gap-6">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 shrink-0"
            :data-alt="`Profile picture of ${patient.name}`"
            :style="{ backgroundImage: `url(${patient.avatar})` }"
          ></div>
          <div class="grow">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">{{ patient.name }}</h1>
            <p class="text-slate-600 dark:text-slate-400 mt-1">
              {{ patient.email }} • {{ patient.phone }}
            </p>
          </div>
        </div>
        <button
          class="flex items-center justify-center gap-2 rounded-lg bg-primary h-10 px-4 text-white text-sm font-bold w-full sm:w-auto"
          @click="$emit('edit')"
        >
          <span class="material-symbols-outlined">edit</span>
          <span>Editar Perfil</span>
        </button>
      </div>
      <div class="border-b border-white/10">
        <nav class="flex gap-6 -mb-px">
          <a class="py-3 px-1 border-b-2 border-primary text-primary font-semibold" href="#"
            >Calendario de Sueño</a
          >
          <a
            class="py-3 px-1 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            href="#"
            >Notas</a
          >
          <a
            class="py-3 px-1 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            href="#"
            >Perfil del Paciente</a
          >
        </nav>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-5 rounded-xl bg-slate-100 dark:bg-slate-800/50">
          <h4 class="text-sm font-medium text-slate-500 dark:text-slate-400">
            Promedio de sueño (7d)
          </h4>
          <p class="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {{ patient.sleepAverage }}
          </p>
        </div>
        <div class="p-5 rounded-xl bg-slate-100 dark:bg-slate-800/50">
          <h4 class="text-sm font-medium text-slate-500 dark:text-slate-400">Consistencia (7d)</h4>
          <p class="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {{ patient.consistency }}
          </p>
        </div>
        <div class="p-5 rounded-xl bg-slate-100 dark:bg-slate-800/50">
          <h4 class="text-sm font-medium text-slate-500 dark:text-slate-400">Última Nota</h4>
          <p class="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {{ patient.lastNote }}
          </p>
        </div>
      </div>
      <div class="p-6 rounded-xl bg-slate-100 dark:bg-slate-800/50">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            Registro de Sueño Semanal
          </h3>
          <div class="flex items-center gap-2">
            <button
              class="size-8 flex items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              <span class="material-symbols-outlined" style="font-size: 18px">chevron_left</span>
            </button>
            <span class="text-sm font-medium text-slate-600 dark:text-slate-400">18-24 Nov</span>
            <button
              class="size-8 flex items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              <span class="material-symbols-outlined" style="font-size: 18px">chevron_right</span>
            </button>
          </div>
        </div>
        <div
          class="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center"
        >
          <p class="text-slate-500 dark:text-slate-400">Gráfico de visualización de datos aquí</p>
        </div>
      </div>
    </div>
  </section>
</template>
