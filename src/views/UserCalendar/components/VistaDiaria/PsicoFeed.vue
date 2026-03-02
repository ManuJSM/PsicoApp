<template>
  <div
    class="bg-card-dark rounded-2xl p-6 h-full flex flex-col gap-4 border border-border-dark shadow-2xl transition-all duration-300"
    :class="
      hasFeedback
        ? 'border-t-2 border-t-primary'
        : 'border-t-2 border-t-slate-800'
    "
  >
    <div class="flex items-center gap-4">
      <div class="relative shrink-0">
        <div
          class="size-14 rounded-2xl border p-0.5 transition-colors duration-500"
          :class="
            hasFeedback
              ? 'border-primary/40 bg-primary/10'
              : 'border-slate-700 bg-slate-800/50'
          "
        >
          <div
            class="w-full h-full rounded-xl bg-cover bg-no-repeat bg-center bg-slate-900"
            :class="{ 'grayscale opacity-50': !hasFeedback }"
            :style="{
              backgroundImage: `url('${doctorAvatar}')`,
            }"
          ></div>
        </div>
      </div>

      <div class="min-w-0">
        <p
          class="text-white font-black text-sm uppercase tracking-tight truncate"
        >
          Dr. {{ doctorName || 'Especialista' }}
        </p>
        <div class="flex items-center gap-2 mt-0.5">
          <span
            class="text-[9px] font-black uppercase tracking-[0.2em]"
            :class="hasFeedback ? 'text-primary' : 'text-slate-500'"
          >
            Feedback Clínico
          </span>
          <div v-if="hasFeedback" class="h-px w-8 bg-primary/30"></div>
        </div>
      </div>
    </div>

    <div
      class="flex-1 flex flex-col p-5 rounded-2xl transition-all duration-300"
      :class="
        hasFeedback
          ? 'bg-primary/5 border border-primary/10 shadow-[inset_0_0_20px_rgba(19,127,236,0.02)]'
          : 'bg-black/20 border border-border-dark/50 opacity-60'
      "
    >
      <span
        class="material-symbols-outlined text-3xl font-thin block mb-2 select-none"
        :class="hasFeedback ? 'text-primary/30' : 'text-slate-700'"
      >
        format_quote
      </span>

      <div class="flex-1">
        <p
          class="italic leading-relaxed text-sm"
          :class="hasFeedback ? 'text-slate-200 font-medium' : 'text-slate-500'"
        >
          {{ hasFeedback ? `"${feedback}"` : emptyMessage }}
        </p>
      </div>

      <div
        v-if="hasFeedback"
        class="mt-4 pt-4 border-t border-primary/10 flex justify-end"
      >
        <div
          class="flex items-center gap-1.5 text-[8px] font-black text-primary/60 uppercase tracking-widest"
        >
          <span class="material-symbols-outlined text-[10px]">verified</span>
          Revisión completada
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  export interface DoctorFeedbackProps {
    doctorName?: string
    doctorAvatar?: string
    feedback?: string | null
    emptyMessage?: string
  }

  const props = withDefaults(defineProps<DoctorFeedbackProps>(), {
    doctorName: 'Analista de Sueño',
    doctorAvatar:
      'https://ui-avatars.com/api/?name=Doc&background=0D1117&color=137FEC',
    feedback: null,
    emptyMessage:
      'Aún no has registrado tu sueño de anoche. ¡Cuéntame cómo has descansado para poder ayudarte!',
  })

  defineEmits<{
    (e: 'click'): void
  }>()

  const hasFeedback = computed(() => {
    return !!(props.feedback && props.feedback.trim() !== '')
  })
</script>

<style scoped>
  .material-symbols-outlined {
    font-variation-settings:
      'FILL' 0,
      'wght' 200,
      'GRAD' 0,
      'opsz' 40;
  }
</style>
