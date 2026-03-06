<script setup lang="ts">
  import AppFooter from '../components/AppFooter.vue'
</script>

<template>
  <main
    class="flex flex-col flex-1 px-6 pt-2 h-full min-h-0 md:pb-8 gap-8 md:gap-12 mx-auto max-w-[1400px] w-full md:overflow-y-auto"
  >
    <div class="flex flex-col gap-2 mt-2">
      <div class="flex items-center gap-3">
        <div
          class="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_15px_#137fec]"
        ></div>
        <h1
          class="text-white tracking-tighter text-3xl lg:text-5xl font-black leading-tight"
        >
          Tu Centro de Bienestar
        </h1>
      </div>
      <p
        class="text-slate-500 text-sm lg:text-base font-bold uppercase tracking-widest ml-4"
      >
        Sistemas de salud y seguimiento biométrico
      </p>
    </div>
    <div
      class="grid lg:grid-cols-12 lg:gap-10 h-full content-center gap-8 items-stretch"
    >
      <router-link
        :to="{
          name: 'UserCalendar',
          params: { date: new Date().toISOString().split('T')[0] },
        }"
        class="lg:col-span-5 xl:col-span-4 group"
      >
        <div
          class="relative overflow-hidden rounded-[2.5rem] bg-card-dark border border-primary/30 shadow-2xl shadow-primary/10 text-white cursor-pointer transition-all duration-500 hover:border-primary group-hover:-translate-y-2 h-full min-h-[360px] flex flex-col justify-center"
        >
          <div
            class="absolute top-0 right-0 -mr-12 -mt-12 size-64 rounded-full bg-primary/10 blur-[80px] group-hover:bg-primary/20 transition-colors"
          ></div>
          <div
            class="absolute bottom-0 left-0 -ml-12 -mb-12 size-48 rounded-full bg-emerald-500/5 blur-[60px]"
          ></div>

          <div
            class="relative p-8 flex flex-col items-center text-center gap-6"
          >
            <div
              class="size-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-md shadow-inner group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500"
            >
              <span
                class="material-symbols-outlined text-[56px] text-primary drop-shadow-[0_0_15px_rgba(19,127,236,0.5)]"
                style="font-variation-settings: 'FILL' 1"
              >
                bedtime
              </span>
            </div>

            <div class="space-y-3">
              <h3
                class="text-2xl lg:text-3xl font-black tracking-tight uppercase"
              >
                Sueño
              </h3>
              <p
                class="text-slate-400 text-sm lg:text-base leading-relaxed font-medium max-w-[240px] mx-auto"
              >
                Registra tu arquitectura de descanso y optimiza tus ciclos
                circadianos.
              </p>
            </div>
          </div>
        </div>
      </router-link>

      <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
        <div class="flex items-center gap-4">
          <h3 class="text-white font-black text-xs uppercase tracking-[0.3em]">
            Otras herramientas
          </h3>
          <div class="h-px flex-1 bg-border-dark/50"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-2">
          <div
            class="group bg-card-dark/40 border border-border-dark rounded-2xl p-6 flex flex-col items-center gap-5 text-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/2 transition-all duration-300 active:scale-95"
          >
            <div
              class="size-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 transition-all"
            >
              <span
                class="material-symbols-outlined text-3xl"
                style="font-variation-settings: 'FILL' 1"
                >mood</span
              >
            </div>
            <div class="space-y-1">
              <span
                class="font-black text-white text-[11px] uppercase tracking-widest block"
                >Registro de Ánimo</span
              >
              <span
                class="text-slate-500 text-[10px] font-bold uppercase tracking-tighter"
                >Estado emocional</span
              >
            </div>
          </div>

          <div
            class="group bg-card-dark/40 border border-border-dark rounded-2xl p-6 flex flex-col items-center gap-5 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/2 transition-all duration-300 active:scale-95"
          >
            <div
              class="size-16 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all"
            >
              <span
                class="material-symbols-outlined text-3xl"
                style="font-variation-settings: 'FILL' 1"
                >self_improvement</span
              >
            </div>
            <div class="space-y-1">
              <span
                class="font-black text-white text-[11px] uppercase tracking-widest block"
                >Mindfulness</span
              >
              <span
                class="text-slate-500 text-[10px] font-bold uppercase tracking-tighter"
                >Meditación y calma</span
              >
            </div>
          </div>

          <div
            class="group bg-card-dark/40 border border-border-dark rounded-2xl p-6 flex flex-col items-center gap-5 text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/2 transition-all duration-300 active:scale-95"
          >
            <div
              class="size-16 rounded-2xl bg-violet-500/10 text-violet-500 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-500/20 transition-all"
            >
              <span
                class="material-symbols-outlined text-3xl"
                style="font-variation-settings: 'FILL' 1"
                >auto_stories</span
              >
            </div>
            <div class="space-y-1">
              <span
                class="font-black text-white text-[11px] uppercase tracking-widest block"
                >Diario Terapéutico</span
              >
              <span
                class="text-slate-500 text-[10px] font-bold uppercase tracking-tighter"
                >Bitácora personal</span
              >
            </div>
          </div>

          <div
            class="border border-dashed border-border-dark rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-card-dark/40 hover:bg-card-dark/60 transition-colors cursor-pointer group"
          >
            <div
              class="size-10 rounded-full border border-border-dark flex items-center justify-center text-slate-600 group-hover:text-primary group-hover:border-primary transition-all"
            >
              <span class="material-symbols-outlined">add</span>
            </div>
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600"
              >Más apps</span
            >
          </div>
        </div>
      </div>
    </div>
  </main>
  <AppFooter />
</template>
