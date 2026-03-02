<template>
  <div
    class="bg-card-dark rounded-2xl border border-border-dark shadow-2xl overflow-hidden flex flex-col h-full"
  >
    <div
      class="px-6 py-4 border-b border-border-dark/50 bg-white/2 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <div
          class="h-5 w-1 bg-primary rounded-full shadow-[0_0_10px_#137fec]"
        ></div>
        <h3
          class="text-white text-[10px] font-black uppercase tracking-[0.2em]"
        >
          Notas y Observaciones
        </h3>
      </div>
      <span
        v-if="hasComment"
        class="material-symbols-outlined text-primary/40 text-sm"
      >
        history_edu
      </span>
    </div>

    <div class="p-6 flex-1 flex flex-col">
      <div v-if="hasComment" class="flex-1 flex flex-col">
        <div class="relative group flex-1">
          <span
            class="absolute -top-2 -left-1 text-primary/20 text-4xl font-serif select-none"
            >“</span
          >

          <div
            class="bg-black/20 border border-border-dark/50 p-5 rounded-2xl h-full flex items-center"
          >
            <p
              class="text-slate-200 text-sm leading-relaxed italic font-medium w-full"
            >
              {{ comment }}
            </p>
          </div>

          <span
            class="absolute -bottom-4 -right-1 text-primary/20 text-4xl font-serif select-none rotate-180"
            >“</span
          >
        </div>

        <div class="mt-4 flex justify-end">
          <span
            class="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1"
          >
            <span class="size-1 bg-slate-700 rounded-full"></span>
            Tus Observaciones
          </span>
        </div>
      </div>

      <div
        v-else
        class="flex-1 flex flex-col items-center justify-center border border-dashed border-border-dark/50 rounded-2xl bg-white/1 transition-colors hover:bg-white/2"
      >
        <div
          class="size-12 rounded-full bg-slate-900/50 flex items-center justify-center mb-3 border border-border-dark/30"
        >
          <span class="material-symbols-outlined text-slate-600 text-xl">
            description
          </span>
        </div>
        <p
          class="text-slate-500 text-[11px] font-bold uppercase tracking-wider text-center px-4"
        >
          {{ emptyMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  export interface PatientFeedbackProps {
    /** Comentario del paciente (si es null/undefined/vacío, muestra empty state) */
    comment?: string | null
    emptyMessage?: string
  }

  const props = withDefaults(defineProps<PatientFeedbackProps>(), {
    comment: null,
    emptyMessage: 'No se han registrado observaciones para este Día.',
  })

  // Determinar si hay comentario
  const hasComment = computed(() => {
    return props.comment && props.comment.trim() !== ''
  })
</script>

<style scoped>
  /* Estilo específico para las comillas decorativas si no se usa fuente serif global */
  span.font-serif {
    font-family: Georgia, serif;
  }
</style>
