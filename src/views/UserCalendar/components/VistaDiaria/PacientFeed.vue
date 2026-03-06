<template>
  <div
    class="bg-card-dark rounded-2xl border border-border-dark shadow-2xl overflow-hidden flex flex-col md:h-full md:min-h-[250px]"
  >
    <div
      class="px-6 py-4 border-b border-border-dark/50 bg-white/2 flex-none flex items-center justify-between"
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
    </div>

    <div class="flex-1 relative min-h-0">
      <div v-if="hasComment" class="absolute inset-0 p-6 flex flex-col">
        <div class="relative flex-1 flex flex-col min-h-0">
          <span
            class="absolute -top-4 -left-1 text-primary/20 text-5xl font-serif select-none z-10"
            >“</span
          >

          <div
            class="flex-1 min-h-0 bg-black/20 border border-border-dark/50 rounded-2xl overflow-hidden flex flex-col"
          >
            <div
              class="flex-1 overflow-y-auto custom-scrollbar p-5 grid place-items-center"
            >
              <p
                class="text-slate-200 text-center text-sm leading-relaxed italic font-medium w-full"
              >
                {{ comment }}
              </p>
            </div>
          </div>

          <span
            class="absolute -bottom-6 -right-1 text-primary/20 text-5xl font-serif select-none rotate-180 z-10"
            >“</span
          >
        </div>

        <div class="mt-4 flex-none flex justify-end">
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
        class="absolute inset-0 m-6 flex flex-col items-center justify-center border border-dashed border-border-dark/50 rounded-2xl bg-white/1"
      >
        <span class="material-symbols-outlined text-slate-600 text-xl mb-3"
          >description</span
        >
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
  const props = withDefaults(
    defineProps<{ comment?: string | null; emptyMessage?: string }>(),
    {
      comment: null,
      emptyMessage: 'No se han registrado observaciones para este Día.',
    }
  )
  const hasComment = computed(() => props.comment?.trim())
</script>

<style scoped>
  span.font-serif {
    font-family: Georgia, serif;
  }
</style>
