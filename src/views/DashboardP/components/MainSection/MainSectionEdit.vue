<script setup lang="ts">
defineEmits(['back'])
</script>
<template>
  <section
    class="md:col-span-2 xl:col-span-3 flex flex-col bg-background-light dark:bg-background-dark h-full overflow-y-auto"
  >
    <button
      @click="$emit('back')"
      class="group flex cursor-pointer items-center gap-2 p-4 text-primary hover:text-primary/80 transition-colors duration-200"
    >
      <span
        class="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform duration-200"
        >arrow_back</span
      >
      <span>Volver</span>
    </button>
    <div class="w-full max-w-2xl mx-auto">
      <div class="flex flex-col items-center mb-10">
        <div class="relative group">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28 ring-4 ring-white dark:ring-gray-800 shadow-lg transition-all duration-300"
            data-alt="Patient avatar"
            style="
              background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWoHqaA7dq_qhMrfVmh63nndpIKFwxN75_b7OljfUVc56ky7dYjCTH85UY1FN9IqLr1VMVT54YbWCcz4hzQ3gO5z7rgEb8yhg0aR332ljniRntCHJoGlUYsWE2Z55ORRoOa7_27DvnS0paNvmK_ZJmX-_Wu1m3U0wfXlM8IoqefMR7_wqb6Ww0fY7Il2D_AccwGea5zYPooCtxmVAyGW70QunAk7r35-7XSIHxQEnC-Kh3VV7_k4pYXzOY1y4XbL2EzSWJn9kE-rk');
            "
          ></div>
          <button
            class="absolute bottom-1 right-1 flex items-center justify-center bg-primary rounded-full size-9 text-white hover:bg-primary/90 transition-colors duration-200 ring-2 ring-white dark:ring-gray-800 touch-manipulation shadow-md"
          >
            <span class="material-symbols-outlined text-lg md:text-xl">edit</span>
          </button>
        </div>
        <h1
          class="text-gray-900 dark:text-white tracking-tight text-2xl md:text-4xl font-bold leading-tight mt-5 text-center"
        >
          Alex Rodríguez
        </h1>
        <p
          class="text-gray-500 dark:text-gray-400 text-base md:text-lg font-medium leading-normal text-center mt-2"
        >
          alex.rodriguez@email.com
        </p>
      </div>
      <div class="space-y-6">
        <div
          class="bg-white dark:bg-gray-800/50 p-5 sm:p-6 md:p-10 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800"
        >
          <h3
            class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-primary text-2xl">person</span>
            Información del Paciente
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div class="md:col-span-2">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                for="name"
                >Nombre Completo</label
              >
              <div class="relative">
                <input
                  class="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary text-base min-h-[48px] px-4 transition-all placeholder:text-gray-400"
                  id="name"
                  type="text"
                  value="Alex Rodríguez"
                />
              </div>
            </div>
            <div class="md:col-span-1">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                for="email"
                >Correo Electrónico</label
              >
              <div class="relative">
                <input
                  class="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary text-base min-h-[48px] px-4 transition-all placeholder:text-gray-400"
                  id="email"
                  type="email"
                  value="alex.rodriguez@email.com"
                />
              </div>
            </div>
            <div class="md:col-span-1">
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                for="phone"
                >Teléfono <span class="text-gray-400 font-normal">(Opcional)</span></label
              >
              <div class="relative">
                <input
                  class="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary text-base min-h-[48px] px-4 transition-all placeholder:text-gray-400"
                  id="phone"
                  placeholder="+1 234 567 890"
                  type="tel"
                />
              </div>
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
            <div class="md:col-span-2 pt-6 border-t border-gray-100 dark:border-gray-700 mt-2">
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <label
                    class="text-base font-semibold text-gray-900 dark:text-white cursor-pointer"
                    for="status"
                    >Estado del paciente</label
                  >
                  <span class="text-sm text-gray-500 dark:text-gray-400 mt-0.5"
                    >Controla el acceso y visibilidad</span
                  >
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-primary">Activo</span>
                  <button
                    aria-checked="true"
                    class="relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark touch-manipulation"
                    id="status"
                    role="switch"
                    type="button"
                  >
                    <span class="sr-only">Estado del paciente</span>
                    <span
                      class="pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-6"
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700/50 flex flex-col md:flex-row md:items-start justify-between gap-6"
        >
          <div class="w-full md:w-auto order-last md:order-first flex flex-col gap-3">
            <button
              class="w-full md:w-auto flex cursor-pointer items-center justify-center gap-2.5 rounded-xl min-h-[52px] px-6 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-base font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-200 border border-red-100 dark:border-red-900/30 touch-manipulation whitespace-nowrap"
            >
              <span class="material-symbols-outlined">delete_forever</span>
              Borrar Paciente
            </button>
          </div>
          <div
            class="flex mb-2 flex-col sm:flex-row gap-4 w-full md:w-auto order-first md:order-last"
          >
            <button
              class="w-full sm:w-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-xl min-h-[52px] px-8 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-base font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 touch-manipulation shadow-sm whitespace-nowrap"
            >
              Cancelar
            </button>
            <button
              class="w-full sm:w-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-xl min-h-[52px] px-8 bg-primary text-white text-base font-semibold hover:bg-primary/90 transition-all duration-200 touch-manipulation shadow-md shadow-primary/25 whitespace-nowrap"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
