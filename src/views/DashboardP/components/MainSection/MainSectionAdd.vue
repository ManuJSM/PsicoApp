<script setup lang="ts">
  import BackButton from './components/BackButton.vue'
  import { reactive } from 'vue'
  import { type CreatePatient } from '@/types/types'
  import FormInput from './components/FormInput.vue'

  const nonAvatar =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAWoHqaA7dq_qhMrfVmh63nndpIKFwxN75_b7OljfUVc56ky7dYjCTH85UY1FN9IqLr1VMVT54YbWCcz4hzQ3gO5z7rgEb8yhg0aR332ljniRntCHJoGlUYsWE2Z55ORRoOa7_27DvnS0paNvmK_ZJmX-_Wu1m3U0wfXlM8IoqefMR7_wqb6Ww0fY7Il2D_AccwGea5zYPooCtxmVAyGW70QunAk7r35-7XSIHxQEnC-Kh3VV7_k4pYXzOY1y4XbL2EzSWJn9kE-rk'
  const emit = defineEmits(['back', 'save'])

  const editPatient = reactive<CreatePatient>({
    fullName: '',
    email: '',
    phone: '',
    active: true,
    avatar: nonAvatar,
  })
</script>

<template>
  <section
    class="flex flex-col w-full bg-[#0b0e14] h-full text-white overflow-hidden uppercase tracking-tighter"
  >
    <div class="border-b border-white/5 shrink-0">
      <BackButton
        @click="$emit('back')"
        label="Volver"
        class="opacity-70 hover:opacity-100"
      />
    </div>

    <div class="flex-1 overflow-y-auto p-6 md:p-12">
      <div class="max-w-3xl mx-auto space-y-12">
        <div
          class="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-10"
        >
          <div class="relative size-32 shrink-0">
            <div
              class="w-full h-full rounded-2xl bg-slate-800 border border-white/10 bg-center bg-cover"
              :style="{ backgroundImage: `url(${editPatient.avatar})` }"
            ></div>
            <button
              class="absolute -bottom-2 -right-2 size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg"
            >
              <span class="material-symbols-outlined text-white text-xl"
                >photo_camera</span
              >
            </button>
          </div>

          <div class="text-center md:text-left">
            <h2 class="text-2xl font-black tracking-tight">Nuevo Registro</h2>
            <p
              class="text-slate-500 text-[10px] font-bold tracking-[0.2em] mt-1"
            >
              SISTEMA DE GESTIÓN DE PACIENTES
            </p>
          </div>
        </div>

        <form class="grid grid-cols-1 md:grid-cols-2 gap-8" @submit.prevent>
          <div class="md:col-span-2">
            <FormInput
              id="name"
              label="Nombre del Paciente"
              v-model="editPatient.fullName"
              placeholder="Introduce nombre completo"
              required
            />
          </div>
          <FormInput
            id="email"
            label="Correo Electrónico"
            type="email"
            v-model="editPatient.email"
            placeholder="ejemplo@correo.com"
            required
          />
          <FormInput
            id="phone"
            label="Teléfono"
            type="tel"
            v-model="editPatient.phone"
            placeholder="+34 000 000 000"
            :optional="true"
          />
        </form>
      </div>
    </div>

    <div class="p-6 border-t border-white/5 bg-black/20 shrink-0">
      <div class="max-w-3xl mx-auto flex gap-4">
        <button
          @click="emit('back')"
          class="flex-1 py-4 text-[11px] font-black text-slate-400 hover:text-white transition-colors"
        >
          CANCELAR
        </button>
        <button
          @click="emit('save', editPatient)"
          class="flex-2 py-4 bg-primary text-white text-[11px] font-black rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
        >
          CONFIRMAR ALTA DE PACIENTE
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
  /* Ajuste de inputs para que se vean oscuros y profesionales */
  :deep(input) {
    background: #161b22 !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 0.75rem !important;
    padding: 1rem !important;
    color: white !important;
    font-size: 0.875rem !important;
    text-transform: none !important; /* El nombre no debe ser uppercase a la fuerza */
    letter-spacing: normal !important;
  }

  :deep(label) {
    color: #94a3b8 !important;
    font-size: 0.65rem !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.1em !important;
    margin-bottom: 0.5rem !important;
  }
</style>
