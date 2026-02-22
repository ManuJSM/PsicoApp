<!-- DoctorFeedback.vue -->
<template>
  <div
    class="glass-card rounded-3xl p-6 h-full flex flex-col gap-2 border-t-2"
    :class="borderClass"
  >
    <!-- Header con información del doctor -->
    <div class="flex items-center gap-4">
      <div class="relative">
        <div
          class="size-14 rounded-2xl border-2 p-0.5"
          :class="hasFeedback ? 'border-primary/30' : 'border-primary/20'"
        >
          <div
            class="w-full h-full rounded-xl bg-cover"
            :class="{ 'grayscale-[0.5]': !hasFeedback }"
            :style="{
              backgroundImage: `url('${hasFeedback ? doctorAvatar : 'https://media.tenor.com/n-AuQVkJZOkAAAAM/anime-crying.gif'}')`,
            }"
          ></div>
        </div>
      </div>

      <div>
        <p class="text-white font-bold text-base">Dr. {{ doctorName }}</p>
        <p
          class="text-[10px] font-black uppercase tracking-widest"
          :class="hasFeedback ? 'text-primary' : 'text-[#9dabb9]'"
        >
          Feedback Clínico
        </p>
      </div>
    </div>

    <!-- Contenido del feedback (CON DATOS) -->
    <div
      v-if="hasFeedback"
      class="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex-1"
    >
      <span
        class="material-symbols-outlined text-primary/30 text-3xl font-thin block mb-2"
      >
        format_quote
      </span>
      <p class="text-white/80 italic leading-relaxed text-sm">
        "{{ feedback }}"
      </p>
    </div>

    <div
      v-else
      class="bg-white/5 rounded-2xl p-4 border border-white/5 flex-1 flex flex-col justify-center"
    >
      <span
        class="material-symbols-outlined text-[#9dabb9]/20 text-3xl font-thin block mb-2"
      >
        format_quote
      </span>
      <p class="text-white/80 italic leading-relaxed text-xs">
        {{ emptyMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  export interface DoctorFeedbackProps {
    /** Nombre del doctor */
    doctorName?: string
    /** Avatar del doctor (URL) */
    doctorAvatar?: string
    /** Feedback del doctor (si es null/undefined/vacío, muestra empty state) */
    feedback?: string | null
    /** Mensaje personalizado para cuando no hay feedback */
    emptyMessage?: string
  }

  const props = withDefaults(defineProps<DoctorFeedbackProps>(), {
    doctorName: '',
    doctorAvatar: 'https://media.tenor.com/n-AuQVkJZOkAAAAM/anime-crying.gif',
    feedback: null,
    emptyMessage:
      'Aún no has registrado tu sueño de anoche. ¡Cuéntame cómo has descansado para poder ayudarte!',
  })

  // Emits
  defineEmits<{
    (e: 'click'): void
  }>()

  // Determinar si hay feedback
  const hasFeedback = computed(() => {
    return props.feedback && props.feedback.trim() !== ''
  })

  // Clase del borde superior según estado
  const borderClass = computed(() => {
    return hasFeedback.value ? 'border-t-primary' : 'border-t-neutral-muted/50'
  })
</script>
