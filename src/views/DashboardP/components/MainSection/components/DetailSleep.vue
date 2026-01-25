<template>
  <!-- Transition para overlay -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      id="drawer-overlay-detail"
      @click="$emit('close')"
    ></div>
  </Transition>

  <!-- Transition para drawer -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-full lg:w-1/3 bg-background-dark/95 backdrop-blur-xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-60 flex flex-col"
    >
      <div
        class="p-6 border-b border-github-border flex items-center justify-between sticky top-0 bg-background-dark/90 backdrop-blur-md z-10"
      >
        <div class="flex flex-col">
          <h2 class="text-white font-extrabold text-xl tracking-tight">
            Detalle del Registro
          </h2>
          <p
            class="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1"
          >
            Domingo, 24 de Noviembre, 2024
          </p>
        </div>
        <button
          class="cursor-pointer size-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
          @click="$emit('close')"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        <section class="space-y-6">
          <div class="flex items-center justify-between">
            <h3
              class="text-sm font-bold text-slate-400 uppercase tracking-widest"
            >
              Resumen de Noche
            </h3>
            <div
              class="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-bold"
            >
              <span class="material-symbols-outlined text-sm!">verified</span>
              Calidad Óptima
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/5 rounded-xl p-4 border border-white/5">
              <p
                class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1"
              >
                Eficiencia
              </p>
              <p class="text-xl font-extrabold text-white">94%</p>
            </div>
            <div class="bg-white/5 rounded-xl p-4 border border-white/5">
              <p
                class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1"
              >
                Duración Total
              </p>
              <p class="text-xl font-extrabold text-white">8h 12m</p>
            </div>
          </div>
          <div class="space-y-3">
            <div
              class="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider"
            >
              <span>22:15 PM (Inicio)</span>
              <span>06:27 AM (Fin)</span>
            </div>
            <div class="w-full flex gap-1 items-stretch h-2">
              <div
                class="timeline-segment bg-primary w-[70%]"
                title="Durmiendo (5h 45m)"
              ></div>
              <div
                class="timeline-segment bg-amber-500 w-[10%]"
                title="Despierto en cama (45m)"
              ></div>
              <div
                class="timeline-segment bg-primary w-[15%]"
                title="Durmiendo (1h 27m)"
              ></div>
              <div
                class="timeline-segment bg-slate-700 w-[5%]"
                title="Fuera de cama (15m)"
              ></div>
            </div>
            <div class="flex flex-wrap gap-4 pt-1">
              <div class="flex items-center gap-1.5">
                <span class="size-2 rounded-full bg-primary"></span>
                <span class="text-[10px] text-slate-400 font-medium"
                  >Durmiendo</span
                >
              </div>
              <div class="flex items-center gap-1.5">
                <span class="size-2 rounded-full bg-amber-500"></span>
                <span class="text-[10px] text-slate-400 font-medium"
                  >En cama (Despierto)</span
                >
              </div>
              <div class="flex items-center gap-1.5">
                <span class="size-2 rounded-full bg-slate-700"></span>
                <span class="text-[10px] text-slate-400 font-medium"
                  >Fuera de cama</span
                >
              </div>
            </div>
          </div>
        </section>
        <section class="space-y-4">
          <h3
            class="text-sm font-bold text-slate-400 uppercase tracking-widest"
          >
            Observaciones y Notas
          </h3>
          <div class="space-y-4">
            <div class="flex gap-4">
              <div
                class="size-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-white/5 overflow-hidden"
              >
                <img
                  alt="Paciente"
                  class="size-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcCASojTkYrVjh8XHvuZu_GDY2AztCPtku67lfoY4ehBbQ-NqhTa9dhp5R0aspG1zj4PLBNyMDHSqhm5dwY0p-RcVBE2fiCUgXN_L5iWx7nnt9mVaDVrju3G4yFx4JL7DbjVdm3v9IVu7yVi71DabvAg6tiImMD7cTjvyY82ODHkG0qYoDjnflaF7JoPAFKaafgZy1vVDBM_J546SG68VQ-26JX_Lw5b7q9ydRJorAaHoKA4KbObADC-4BEnTI8tpgW3mipt043CM"
                />
              </div>
              <div class="flex-1 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white"
                    >Ana García
                    <span class="text-[10px] text-slate-500 ml-1 font-normal"
                      >(Paciente)</span
                    ></span
                  >
                </div>
                <div
                  class="bg-github-dark border border-white/10 p-3 rounded-2xl rounded-tl-none text-sm text-slate-300 leading-relaxed"
                >
                  He dormido muy bien, pero me he despertado una vez por un
                  ruido en la calle. Me costó volver a conciliar el sueño unos
                  20 minutos.
                </div>
              </div>
            </div>
            <div class="flex gap-4">
              <div
                class="size-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20"
              >
                <span class="material-symbols-outlined text-primary text-lg!"
                  >psychology</span
                >
              </div>
              <div class="flex-1 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-primary"
                    >Dr. Analista
                    <span class="text-[10px] text-slate-500 ml-1 font-normal"
                      >(Psicólogo)</span
                    ></span
                  >
                </div>
                <div
                  class="bg-primary/5 border border-primary/20 p-3 rounded-2xl rounded-tl-none text-sm text-slate-300 leading-relaxed"
                >
                  Se observa una fragmentación mínima. La eficiencia del 94% es
                  excelente. Mantendremos las pautas de higiene de sueño
                  actuales. No se requiere ajuste en la medicación por ahora.
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="relative">
              <textarea
                class="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 resize-none min-h-24"
                placeholder="Añadir una observación clínica..."
              ></textarea>
              <button
                class="absolute cursor-pointer bottom-3 right-3 flex justify-center items-ceter bg-primary hover:bg-primary/90 text-white p-1 rounded-lg transition-all"
              >
                <span class="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  // Props
  withDefaults(
    defineProps<{
      isOpen?: boolean
    }>(),
    {
      isOpen: false,
    }
  )

  // Emits
  defineEmits<{
    close: []
  }>()
</script>

<style scoped>
  /* Animación fade para overlay */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }

  /* Animación slide para drawer */
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
  }

  .slide-enter-to,
  .slide-leave-from {
    transform: translateX(0);
  }

  /* Estilos del drawer */
  .timeline-segment {
    height: 8px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .timeline-segment:hover {
    transform: scaleY(1.3);
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>
