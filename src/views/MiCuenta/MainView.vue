<script setup lang="ts">
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
</script>
<template>
  <h1 class="text-primary">Mi cuentasa</h1>
</template>
