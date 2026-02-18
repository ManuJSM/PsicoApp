<!-- PatientFeedback.vue -->
<template>
  <div class="glass-card rounded-3xl p-6 flex h-full flex-col gap-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-[#9dabb9] text-xs font-bold uppercase tracking-widest">
        Valoración del Paciente
      </h3>
    </div>

    <!-- Comentario del paciente (CON DATOS) -->
    <div v-if="hasComment" class="flex-1 flex items-center">
      <p
        class="text-white text-sm leading-relaxed flex-1 bg-white/5 p-5 rounded-2xl border border-white/5 italic"
      >
        "{{ comment }}"
      </p>
    </div>

    <!-- Sin comentario (SIN DATOS) -->
    <div
      v-else
      class="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl py-10 px-2 gap-2"
    >
      <p class="text-[#9dabb9] text-sm italic">
        {{ emptyMessage }}
      </p>
      <span class="material-symbols-outlined text-white/20"
        >sentiment_neutral</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  export interface PatientFeedbackProps {
    /** Comentario del paciente (si es null/undefined/vacío, muestra empty state) */
    comment?: string | null
    /** Hora a la que se guardó la nota (opcional) */

    emptyMessage?: string
  }

  const props = withDefaults(defineProps<PatientFeedbackProps>(), {
    comment: null,
    commentTime: null,
    emptyMessage: 'No hay observaciones para este día.',
  })

  // Determinar si hay comentario
  const hasComment = computed(() => {
    return props.comment && props.comment.trim() !== ''
  })
</script>
