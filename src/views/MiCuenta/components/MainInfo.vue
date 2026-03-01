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

  // Sincronización con el padre si cambian los datos externamente
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

<template>
  <div
    class="bg-card-dark rounded-2xl w-full border border-border-dark/30 shadow-xl overflow-hidden"
  >
    <div
      class="flex items-center justify-between px-6 py-5 border-b border-border-dark/30 bg-slate-800/20"
    >
      <div class="flex items-center gap-3">
        <div class="h-5 w-1 bg-primary rounded-full"></div>
        <h2
          class="text-white text-base sm:text-lg font-semibold tracking-tight"
        >
          Información Personal
        </h2>
      </div>

      <button
        @click="isEditing ? cancel() : (isEditing = true)"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="
          isEditing
            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            : 'bg-primary/10 text-primary hover:bg-primary/20'
        "
      >
        <span class="material-symbols-outlined text-sm">
          {{ isEditing ? 'close' : 'edit' }}
        </span>
        {{ isEditing ? 'Cancelar' : 'Editar' }}
      </button>
    </div>

    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div
        v-for="field in [
          {
            id: 'fullName',
            label: 'Nombre Completo',
            icon: 'badge',
            type: 'text',
          },
          { id: 'email', label: 'Email', icon: 'email', type: 'email' },
          {
            id: 'phone',
            label: 'Teléfono Profesional',
            icon: 'phone',
            type: 'tel',
          },
        ]"
        :key="field.id"
        :class="field.id === 'phone' ? 'md:col-span-2' : ''"
        class="space-y-2"
      >
        <label
          class="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-sm">{{
            field.icon
          }}</span>
          {{ field.label }}
        </label>

        <div class="h-10 flex items-center">
          <input
            v-if="isEditing"
            v-model="formData[field.id as keyof UpdateUser]"
            :type="field.type"
            class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
          />
          <div v-else class="text-white text-sm font-medium px-1 truncate">
            {{ props.modelValue[field.id as keyof UpdateUser] || '—' }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isEditing"
      class="px-6 py-4 bg-slate-900/40 border-t border-border-dark/20 flex justify-end gap-3"
    >
      <button
        @click="cancel"
        class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
      >
        Descartar
      </button>
      <button
        @click="saveChanges"
        class="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
      >
        Guardar cambios
      </button>
    </div>
  </div>
</template>
