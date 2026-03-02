<template>
  <div
    class="bg-card-dark rounded-2xl w-full border border-border-dark shadow-2xl overflow-hidden"
  >
    <div
      class="flex items-center justify-between px-6 py-4 border-b border-border-dark/50 bg-white/2"
    >
      <div class="flex items-center gap-3">
        <div
          class="h-5 w-1 bg-primary rounded-full shadow-[0_0_10px_#137fec]"
        ></div>
        <h2 class="text-white text-xs font-black uppercase tracking-[0.2em]">
          Información Personal
        </h2>
      </div>

      <button
        @click="isEditing ? cancel() : (isEditing = true)"
        type="button"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border',
          isEditing
            ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white',
        ]"
      >
        <span class="material-symbols-outlined text-sm font-bold">
          {{ isEditing ? 'close' : 'edit' }}
        </span>
        {{ isEditing ? 'Cancelar' : 'Editar' }}
      </button>
    </div>

    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="field in [
          {
            id: 'fullName',
            label: 'Nombre Completo',
            icon: 'person',
            type: 'text',
          },
          {
            id: 'email',
            label: 'Email',
            icon: 'alternate_email',
            type: 'email',
          },
          { id: 'phone', label: 'Teléfono', icon: 'phone_iphone', type: 'tel' },
        ]"
        :key="field.id"
        :class="field.id === 'phone' ? 'md:col-span-2' : ''"
        class="flex flex-col gap-2"
      >
        <label
          class="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-xs text-primary/60">{{
            field.icon
          }}</span>
          {{ field.label }}
        </label>

        <div class="relative h-11 flex items-center">
          <input
            v-if="isEditing"
            v-model="formData[field.id as keyof UpdateUser]"
            :type="field.type"
            class="w-full h-full bg-black/40 border border-border-dark rounded-xl px-4 text-white text-sm font-medium focus:border-primary outline-none transition-colors"
          />
          <div
            v-else
            class="w-full h-full flex items-center px-4 rounded-xl bg-white/3 border border-transparent text-white text-sm font-bold tracking-tight truncate"
          >
            {{ props.modelValue[field.id as keyof UpdateUser] || '—' }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isEditing"
      class="px-6 py-4 bg-white/4 border-t border-border-dark/50 flex justify-end gap-3"
    >
      <button
        @click="cancel"
        class="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
      >
        Descartar
      </button>
      <button
        @click="saveChanges"
        class="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
      >
        Guardar Cambios
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { UpdateUser } from '@/types/types'

  const props = defineProps<{
    modelValue: UpdateUser
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: UpdateUser): void
    (e: 'save'): void
    (e: 'cancel'): void
  }>()

  const isEditing = ref(false)
  const formData = ref<UpdateUser>({ ...props.modelValue })

  watch(
    () => props.modelValue,
    newVal => {
      formData.value = { ...newVal }
    },
    { deep: true }
  )

  const cancel = () => {
    isEditing.value = false
    formData.value = { ...props.modelValue }
    emit('cancel')
  }

  const saveChanges = () => {
    isEditing.value = false
    emit('update:modelValue', formData.value)
    emit('save')
  }
</script>

<style scoped>
  .material-symbols-outlined {
    font-variation-settings:
      'FILL' 0,
      'wght' 400,
      'GRAD' 0,
      'opsz' 20;
  }
</style>
