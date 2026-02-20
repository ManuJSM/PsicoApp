<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useMeStore } from '@/stores/me.store'

  const meStore = useMeStore()

  onMounted(async () => {
    meStore.reset()
    await meStore.fetchMe()
    console.log(meStore.me?.fullName)
  })
</script>
<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold text-white mb-6">Dashboard de Salud</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Gráfico de sueño -->
    </div>
  </div>
</template>
