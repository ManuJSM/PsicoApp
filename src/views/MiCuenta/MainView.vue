<script setup lang="ts">
  import SleepChart from './components/SleepChart.vue'
  import { fetchWithAuth } from '@/api/fetchAuth'
  import { onMounted } from 'vue'
  import type { Patient } from '@/types/types'
  import { AppError } from '@/types/errors.types'
  onMounted(() => {
    fetchWithAuth<Patient>('/me')
      .then(data => {
        console.log(data)
      })
      .catch((err: unknown) => {
        if (!(err instanceof AppError) && err instanceof Error) {
          console.log(err.message)
        }
      })
  })
  // Ejemplo de datos (en minutos de sueño por día de la semana)

  // Datos de ejemplo tipados
  const sleepData: number[] = [480, 420, 510, 465, 390, 540, 495] // minutos por día
  const previousWeekSleep: number[] = [450, 410, 490, 440, 380, 520, 480]

  const activityData: number[] = [60, 45, 90, 75, 30, 120, 90] // minutos de actividad
  const previousWeekActivity: number[] = [55, 40, 85, 70, 25, 110, 85]

  const sleepQuality: number[] = [85, 78, 92, 80, 75, 95, 88] // porcentaje de calidad

  // Días personalizados
  const customDays: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ]
</script>
<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold text-white mb-6">Dashboard de Salud</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Gráfico de sueño -->
      <SleepChart
        title="Duración del Sueño"
        :data="previousWeekSleep"
        :previous-period-data="sleepData"
        chart-color="#137fec"
      />

      <!-- Gráfico de actividad -->
      <SleepChart
        title="Actividad Física"
        :data="activityData"
        :previous-period-data="previousWeekActivity"
        chart-color="#0bda5b"
        :days="['L', 'M', 'M', 'J', 'V', 'S', 'D']"
      />

      <!-- Gráfico personalizado -->
      <SleepChart
        title="Calidad del Sueño"
        :data="sleepQuality"
        chart-color="#9c27b0"
        :days="customDays"
      />
    </div>
  </div>
</template>
