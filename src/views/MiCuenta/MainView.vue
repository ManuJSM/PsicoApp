<script setup lang="ts">
  import SleepChart from './components/SleepChart.vue'
  import { fetchWithAuth } from '@/api/fetchAuth'
  import { onMounted } from 'vue'
  import type { Patient } from '@/types/types'
  import { AppError } from '@/types/errors.types'
  import SleepBarChart from './components/SleepBarChart.vue'

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

  const weeklyData = [
    {
      day: 'Lun',
      segments: [
        { value: 440, type: 'asleep' }, // 7h 20m
        { value: 45, type: 'inBed' }, // 45m
        { value: 105, type: 'awake' }, // 1h 45m
      ],
    },
    {
      day: 'Mar',
      segments: [
        { value: 480, type: 'asleep' }, // 8h
        { value: 30, type: 'inBed' }, // 30m
        { value: 90, type: 'awake' }, // 1h 30m
      ],
    },
    {
      day: 'Mié',
      segments: [
        { value: 420, type: 'asleep' }, // 7h
        { value: 60, type: 'inBed' }, // 1h
        { value: 120, type: 'awake' }, // 2h
      ],
    },
    {
      day: 'Jue',
      segments: [
        { value: 510, type: 'asleep' }, // 8h 30m
        { value: 45, type: 'inBed' }, // 45m
        { value: 45, type: 'awake' }, // 45m
      ],
    },
    {
      day: 'Vie',
      segments: [
        { value: 360, type: 'asleep' }, // 6h
        { value: 90, type: 'inBed' }, // 1h 30m
        { value: 150, type: 'awake' }, // 2h 30m
      ],
    },
    {
      day: 'Sáb',
      segments: [
        { value: 540, type: 'asleep' }, // 9h
        { value: 60, type: 'inBed' }, // 1h
        { value: 0, type: 'awake' }, // 0h
      ],
    },
    {
      day: 'Dom',
      segments: [
        { value: 480, type: 'asleep' }, // 8h
        { value: 30, type: 'inBed' }, // 30m
        { value: 60, type: 'awake' }, // 1h
      ],
    },
  ]
  // Datos típicos de una "mala" semana anterior
  const previousWeekData = [
    {
      day: 'Lun',
      segments: [
        { value: 360, type: 'asleep' },
        { value: 90, type: 'inBed' },
        { value: 150, type: 'awake' },
      ],
    },
    {
      day: 'Mar',
      segments: [
        { value: 390, type: 'asleep' },
        { value: 75, type: 'inBed' },
        { value: 135, type: 'awake' },
      ],
    },
    {
      day: 'Mié',
      segments: [
        { value: 420, type: 'asleep' },
        { value: 60, type: 'inBed' },
        { value: 120, type: 'awake' },
      ],
    },
    {
      day: 'Jue',
      segments: [
        { value: 360, type: 'asleep' },
        { value: 90, type: 'inBed' },
        { value: 150, type: 'awake' },
      ],
    },
    {
      day: 'Vie',
      segments: [
        { value: 300, type: 'asleep' },
        { value: 120, type: 'inBed' },
        { value: 180, type: 'awake' },
      ],
    },
    {
      day: 'Sáb',
      segments: [
        { value: 480, type: 'asleep' },
        { value: 60, type: 'inBed' },
        { value: 60, type: 'awake' },
      ],
    },
    {
      day: 'Dom',
      segments: [
        { value: 420, type: 'asleep' },
        { value: 45, type: 'inBed' },
        { value: 135, type: 'awake' },
      ],
    },
  ]

  const showInfo = () => {
    alert('Información sobre el gráfico...')
  }
</script>
<template>
  <div class="pb-safe-sm container mx-auto p-6">
    <h1 class="text-2xl font-bold text-white mb-6">Dashboard de Salud</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Gráfico de sueño -->
      <SleepChart
        title="Duración del Sueño"
        :chart-data="weeklyData"
        :previous-period-data="previousWeekData"
      />

      <div>
        <SleepBarChart
          title="Uso del Tiempo en Cama"
          :chart-data="weeklyData"
          @info-click="showInfo"
        />
      </div>
    </div>
  </div>
</template>
