<script setup lang="ts">
import { inject, type Ref } from 'vue'
import type { Patient } from '@/types'

const selectedPatient = inject<Ref<Patient | null>>('selectedPatient')
const activePatientId = inject<Ref<number | null>>('activePatientId')
defineProps<{
  patients: Patient[]
}>()

const handlePatientClick = (patient: Patient) => {
  if (selectedPatient && activePatientId) {
    selectedPatient.value = patient
    activePatientId.value = patient.id
  }
}
</script>

<template>
  <div class="flex flex-col divide-y divide-white/10">
    <div
      v-for="patient in patients"
      :key="patient.id"
      class="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between cursor-pointer transition-colors duration-200"
      :class="{
        'bg-primary/20 dark:bg-primary/20 border-l-4 border-primary':
          activePatientId === patient.id,
        'bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border-l-4 border-transparent':
          activePatientId !== patient.id,
      }"
      @click="handlePatientClick(patient)"
    >
      <div class="flex items-center gap-4">
        <div
          class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14"
          :data-alt="`Profile picture of ${patient.name}`"
          :style="{ backgroundImage: `url(${patient.avatar})` }"
        ></div>
        <div class="flex flex-col justify-center">
          <p
            class="text-slate-900 dark:text-white text-base font-medium leading-normal line-clamp-1"
          >
            {{ patient.name }}
          </p>
          <p
            class="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-2"
          >
            Promedio de sueño: {{ patient.sleepAverage }}
          </p>
        </div>
      </div>
      <div class="shrink-0">
        <div class="text-slate-600 dark:text-white flex size-7 items-center justify-center">
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
      </div>
    </div>
  </div>
</template>
