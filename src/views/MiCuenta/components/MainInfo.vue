<!-- components/UserPersonalInfo.vue -->
<script setup lang="ts">
  import { ref } from 'vue'
  import type { User } from '@/types/types'

  defineProps<{
    modelValue: User
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: User): void
    (e: 'save'): void
    (e: 'cancel'): void
  }>()

  const isEditing = ref(false)

  const toggleEdit = () => {
    isEditing.value = !isEditing.value
    if (!isEditing.value) {
      emit('cancel')
    }
  }

  const saveChanges = () => {
    isEditing.value = false
    emit('save')
  }
</script>

<template>
  <div class="space-y-6">
    <!-- Información Personal y de Contacto -->
    <div
      class="bg-linear-to-br from-slate-800/40 to-slate-800/20 rounded-2xl backdrop-blur-sm border border-slate-700/30 shadow-xl"
    >
      <div
        class="flex items-center justify-between px-6 py-5 border-b border-slate-700/30"
      >
        <div class="flex items-center gap-3">
          <div class="h-6 w-1 bg-primary rounded-full"></div>
          <h2 class="text-white text-lg sm:text-xl font-bold">
            Información Personal
          </h2>
        </div>
        <button
          @click="toggleEdit"
          class="flex items-center justify-center rounded-xl h-9 px-4 gap-2 bg-slate-700/50 text-white text-sm font-medium hover:bg-slate-600 transition-all duration-300 hover:scale-105"
        >
          <span class="material-symbols-outlined text-base">{{
            isEditing ? 'close' : 'edit'
          }}</span>
          <span class="truncate">{{ isEditing ? 'Cancelar' : 'Editar' }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 p-6">
        <!-- Nombre Completo -->
        <div
          class="flex flex-col py-3 border-b border-slate-700/30 md:border-b-0"
        >
          <p
            class="text-slate-400 text-sm font-medium flex items-center gap-1 pb-2"
          >
            <span class="material-symbols-outlined text-xs">badge</span>
            Nombre Completo
          </p>
          <div v-if="!isEditing" class="text-white text-base font-medium">
            {{ modelValue.fullName }}
          </div>
          <input
            v-else
            type="text"
            :value="modelValue.fullName"
            @input="
              $emit('update:modelValue', {
                ...modelValue,
                fullName: ($event.target as HTMLInputElement).value,
              })
            "
            class="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full transition-all duration-300"
            placeholder="Nombre completo"
          />
        </div>

        <!-- Email -->
        <div class="flex flex-col py-3 border-b border-slate-700/30">
          <p
            class="text-slate-400 text-sm font-medium flex items-center gap-1 pb-2"
          >
            <span class="material-symbols-outlined text-xs">email</span>
            Email
          </p>
          <div v-if="!isEditing" class="text-white text-base font-medium">
            {{ modelValue.email }}
          </div>
          <input
            v-else
            type="email"
            :value="modelValue.email"
            @input="
              $emit('update:modelValue', {
                ...modelValue,
                email: ($event.target as HTMLInputElement).value,
              })
            "
            class="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full transition-all duration-300"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <!-- Teléfono -->
        <div class="flex flex-col py-3 md:col-span-2">
          <p
            class="text-slate-400 text-sm font-medium flex items-center gap-1 pb-2"
          >
            <span class="material-symbols-outlined text-xs">phone</span>
            Teléfono Profesional
          </p>
          <div v-if="!isEditing" class="text-white text-base font-medium">
            {{ modelValue.phone }}
          </div>
          <input
            v-else
            type="tel"
            :value="modelValue.phone"
            @input="
              $emit('update:modelValue', {
                ...modelValue,
                phone: ($event.target as HTMLInputElement).value,
              })
            "
            class="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full transition-all duration-300"
            placeholder="+34 123 456 789"
          />
        </div>
      </div>

      <!-- Botones de acción en modo edición -->
      <div v-if="isEditing" class="px-6 pb-6 pt-2 flex justify-end gap-3">
        <button
          @click="toggleEdit"
          class="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 transition-all duration-300"
        >
          Cancelar
        </button>
        <button
          @click="saveChanges"
          class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-all duration-300"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  </div>
</template>
