<script setup lang="ts">
  import BackButton from './components/BackButton.vue'
  import { reactive } from 'vue'
  import { type CreatePatient } from '@/types/types'
  import FormInput from './components/FormInput.vue'
  import { useMeStore } from '@/stores/me.store'

  const nonAvatar =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAWoHqaA7dq_qhMrfVmh63nndpIKFwxN75_b7OljfUVc56ky7dYjCTH85UY1FN9IqLr1VMVT54YbWCcz4hzQ3gO5z7rgEb8yhg0aR332ljniRntCHJoGlUYsWE2Z55ORRoOa7_27DvnS0paNvmK_ZJmX-_Wu1m3U0wfXlM8IoqefMR7_wqb6Ww0fY7Il2D_AccwGea5zYPooCtxmVAyGW70QunAk7r35-7XSIHxQEnC-Kh3VV7_k4pYXzOY1y4XbL2EzSWJn9kE-rk'
  const emit = defineEmits(['back', 'save'])
  const me = useMeStore()

  const editPatient = reactive<CreatePatient>({
    fullName: '',
    email: '',
    phone: '',
    password: '', // Campo añadido en el estado
    psicoId: me.me?.id!,
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
              :style="{ backgroundImage: `url(${nonAvatar})` }"
            ></div>
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

          <div class="md:col-span-1">
            <FormInput
              id="email"
              label="Correo Electrónico"
              type="email"
              v-model="editPatient.email"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div class="md:col-span-1">
            <FormInput
              id="password"
              label="Contraseña de Acceso"
              type="password"
              v-model="editPatient.password"
              placeholder="••••••••"
              required
            />
          </div>

          <div class="md:col-span-2">
            <FormInput
              id="phone"
              label="Teléfono"
              type="tel"
              v-model="editPatient.phone"
              placeholder="+34 000 000 000"
              :optional="true"
            />
          </div>
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
