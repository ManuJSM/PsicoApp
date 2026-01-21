<template>
  <div class="bg-card-dark border border-border-dark rounded-xl p-6">
    <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
      <span class="material-symbols-outlined text-primary">info</span>
      Instrucciones
    </h3>
    <ul class="space-y-4">
      <li
        v-for="(instruction, index) in instructions"
        :key="index"
        class="flex gap-3"
      >
        <span class="text-primary font-bold">
          {{ (index + 1).toString().padStart(2, '0') }}.
        </span>
        <p class="text-sm text-slate-400">
          {{ instruction }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'

  defineProps({
    instructions: {
      type: Array as PropType<string[]>,
      required: true,
    },
  })
</script>
