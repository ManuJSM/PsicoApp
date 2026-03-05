<script setup lang="ts">
  import BackButton from './components/BackButton.vue'
  import DeleteModal from './components/DeleteModal.vue'
  import FormInput from './components/FormInput.vue'
  import { type Patient } from '@/types/types'
  import { ref, computed, reactive, watch } from 'vue'

  const props = defineProps<{
    patient: Patient
  }>()

  const emit = defineEmits<{
    (e: 'back'): void
    (e: 'delete'): void
    (e: 'save', patient: Patient): void
  }>()

  const showDeleteModal = ref(false)
  const editPatient = reactive<Patient>({
    ...props.patient,
  })

  const isActive = computed<boolean>(() => editPatient.active)

  const toggleStatus = () => {
    editPatient.active = !isActive.value
  }

  const handleDelete = () => {
    emit('delete')
    showDeleteModal.value = false
  }

  watch(
    () => props.patient,
    newPatient => {
      Object.assign(editPatient, newPatient)
    },
    { immediate: true, deep: true }
  )
</script>

<template>
  <section
    class="flex flex-col w-full bg-[#0b0e14] h-full text-white overflow-hidden uppercase tracking-tighter"
  >
    <div class="border-b border-white/5 shrink-0">
      <BackButton
        @click="emit('back')"
        label="Volver"
        class="opacity-70 hover:opacity-100"
      />
    </div>

    <Transition name="modal" appear>
      <DeleteModal
        v-show="showDeleteModal"
        :PacientName="props.patient.fullName"
        @delete="handleDelete"
        @back="showDeleteModal = false"
      />
    </Transition>

    <div class="flex-1 overflow-y-auto p-6 md:p-12">
      <div class="max-w-3xl mx-auto">
        <div
          class="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-10"
        >
          <div class="size-32 shrink-0">
            <div
              class="w-full h-full rounded-2xl bg-slate-800 border border-white/10 bg-center bg-no-repeat bg-cover shadow-2xl"
              :style="{ backgroundImage: `url(${editPatient.avatar})` }"
            ></div>
          </div>

          <div class="text-center md:text-left flex-1">
            <h2 class="text-2xl font-black tracking-tight">
              {{ editPatient.fullName || 'Nuevo Registro' }}
            </h2>
          </div>

          <div class="flex flex-col items-center md:items-end gap-2 group">
            <span class="text-[9px] font-black text-slate-500 tracking-widest"
              >ESTADO ACTUAL</span
            >
            <button
              @click="toggleStatus"
              type="button"
              class="relative cursor-pointer flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 active:scale-95 group/btn"
              :class="[
                isActive
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500'
                  : 'border-red-500/30 bg-red-500/5 text-red-500 hover:bg-red-500/10 hover:border-red-500',
              ]"
            >
              <span class="text-[11px] font-black tracking-widest">{{
                isActive ? 'ACTIVO' : 'INACTIVO'
              }}</span>
              <span
                class="material-symbols-outlined text-sm opacity-50 group-hover/btn:rotate-180 transition-transform duration-500"
              >
                sync
              </span>
            </button>
            <span
              class="text-[8px] text-slate-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
            >
              CLICK PARA CAMBIAR
            </span>
          </div>
        </div>

        <form
          class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 mb-4"
          @submit.prevent
        >
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

        <div
          class="pt-8 border-t border-white/5 flex justify-center md:justify-start"
        >
          <button
            @click="showDeleteModal = true"
            class="group cursor-pointer flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors text-[10px] font-black"
          >
            <span
              class="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform"
              >delete</span
            >
            ELIMINAR PACIENTE PERMANENTEMENTE
          </button>
        </div>
      </div>
    </div>

    <div class="p-6 border-t border-white/5 bg-black/20 shrink-0">
      <div class="max-w-3xl mx-auto flex gap-4">
        <button
          @click="emit('back')"
          class="cursor-pointer flex-1 py-4 text-[11px] font-black text-slate-400 hover:text-white transition-colors"
        >
          CANCELAR
        </button>
        <button
          @click="emit('save', editPatient)"
          class="cursor-pointer flex-2 py-4 bg-primary text-white text-[11px] font-black rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
        >
          GUARDAR CAMBIOS
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .modal-enter-active {
    transition: opacity 160ms ease-in;
  }
  .modal-enter-from {
    opacity: 0;
  }
</style>
