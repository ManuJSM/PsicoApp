<script setup lang="ts">
import BackButton from './components/BackButton.vue'
import { role, type Patient } from '@/types/types'
import RegTable from '../../../components/RegTable.vue'
import StatCard from './components/StatCard.vue'
import { getQualityEficiency } from './utils/utils'
import { calculateDurationPercentage, calculateDuration } from '@/views/components/utils/utils'

const targetHours = 8

const rol = role.psico

defineProps<{
  patient: Patient
}>()
defineEmits(['exit', 'edit'])
</script>
<template>
  <section
    class="md:col-span-2 xl:col-span-3 flex flex-col bg-background-light dark:bg-background-dark h-full"
  >
    <BackButton @click="$emit('exit')" label="Cerrar" />
    <div class="p-6 space-y-6 overflow-y-auto">
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
          class="flex items-center justify-center gap-2 rounded-lg hover:bg-primary/80 hover:cursor-pointer bg-primary h-10 px-4 text-white text-sm font-bold w-full sm:w-auto"
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
            >Analytics</a
          >
          <a
            class="py-3 px-1 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            href="#"
            >Otras Apps</a
          >
        </nav>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard
          title="Promedio de sueño (7d)"
          :value="calculateDuration(patient.sleepAverage)"
          :color="
            getQualityEficiency(calculateDurationPercentage(patient.sleepAverage, targetHours))
          "
        />
        <StatCard
          title="Eficiencia (7d)"
          :value="`${patient.Eficiency}%`"
          :color="getQualityEficiency(patient.Eficiency)"
        />
        <StatCard title="Último registro" :value="patient.lastNote" />
      </div>
      <RegTable :userRole="rol" />
    </div>
  </section>
</template>
