<script setup lang="ts">
import BackButton from './components/BackButton.vue'
import { reactive } from 'vue'
import { type Patient, Status } from '@/types/types'
import FormInput from './components/FormInput.vue'

const nonAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAWoHqaA7dq_qhMrfVmh63nndpIKFwxN75_b7OljfUVc56ky7dYjCTH85UY1FN9IqLr1VMVT54YbWCcz4hzQ3gO5z7rgEb8yhg0aR332ljniRntCHJoGlUYsWE2Z55ORRoOa7_27DvnS0paNvmK_ZJmX-_Wu1m3U0wfXlM8IoqefMR7_wqb6Ww0fY7Il2D_AccwGea5zYPooCtxmVAyGW70QunAk7r35-7XSIHxQEnC-Kh3VV7_k4pYXzOY1y4XbL2EzSWJn9kE-rk'
const emit = defineEmits(['back', 'save'])
const editPatient = reactive<Patient>({
  id: -1,
  name: '',
  email: '',
  phone: '',
  status: Status.Active,
  avatar: nonAvatar,
  sleepAverage: '',
  lastNote: '',
  Eficiency: 0,
})
</script>
<template>
  <section
    class="relative z-0 md:col-span-2 xl:col-span-3 flex flex-col bg-background-light dark:bg-background-dark h-full overflow-y-auto"
  >
    <BackButton @click="$emit('back')" label="Cerrar" />
    <div class="w-full mx-auto overflow-y-auto">
      <section class="flex flex-col items-center mb-5">
        <div class="relative group">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28 ring-4 ring-white dark:ring-gray-800 shadow-lg transition-all duration-300"
            data-alt="Patient avatar"
            :style="{ backgroundImage: `url(${editPatient.avatar})` }"
          ></div>
          <button
            class="absolute bottom-1 right-1 flex items-center justify-center bg-primary rounded-full size-9 text-white hover:bg-primary/90 transition-colors duration-200 ring-2 ring-white dark:ring-gray-800 touch-manipulation shadow-md"
          >
            <span class="material-symbols-outlined text-lg md:text-xl">edit</span>
          </button>
        </div>
      </section>
      <div class="p-6 space-y-6">
        <div
          class="bg-white dark:bg-gray-800/50 p-5 sm:p-6 md:p-10 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800"
        >
          <h3
            class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-primary text-2xl">person</span>
            Información del Paciente
          </h3>
          <form class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div class="md:col-span-2">
              <FormInput
                id="name"
                label="Nombre Completo"
                type="text"
                v-model="editPatient.name"
                required
              />
            </div>
            <div class="md:col-span-1">
              <FormInput
                id="email"
                label="Correo Electrónico"
                type="email"
                v-model="editPatient.email"
                required
              />
            </div>
            <div class="md:col-span-1">
              <FormInput
                id="phone"
                label="Teléfono"
                type="tel"
                v-model="editPatient.phone"
                :optional="true"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                for="notes"
                >Notas del Profesional</label
              >
              <textarea
                class="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary text-base min-h-[120px] md:min-h-[160px] p-4 transition-all resize-y placeholder:text-gray-400"
                id="notes"
                placeholder="Añadir notas clínicas o de seguimiento..."
                rows="4"
              ></textarea>
            </div>
          </form>
        </div>
        <div
          class="mt-8 pt-8 justify-center items-center border-t border-gray-200 dark:border-gray-700/50 flex flex-col md:flex-row md:items-start gap-6"
        >
          <div
            class="flex mb-2 flex-col sm:flex-row gap-4 w-full md:w-auto order-first md:order-last"
          >
            <button
              class="w-full sm:w-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-xl min-h-[52px] px-8 bg-primary text-white text-base font-semibold hover:bg-primary/90 transition-all duration-200 touch-manipulation shadow-md shadow-primary/25 whitespace-nowrap"
              @click="emit('save', editPatient)"
            >
              Añadir Paciente
            </button>
            <button
              class="w-full sm:w-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-xl min-h-[52px] px-8 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-base font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 touch-manipulation shadow-sm whitespace-nowrap"
              @click="emit('back')"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
