<script setup lang="ts">
defineEmits(['delete', 'back'])
</script>
<template>
  <div
    aria-labelledby="modal-title"
    aria-modal="true"
    class="relative z-50"
    id="delete-modal"
    role="dialog"
  >
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-[1px] transition-opacity"></div>
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-2xl transition-all w-full max-w-md border border-gray-100 dark:border-gray-700"
        >
          <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="flex flex-col items-center">
              <div
                class="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 mb-4"
              >
                <span class="material-symbols-outlined text-red-600 dark:text-red-400 text-3xl"
                  >warning</span
                >
              </div>
              <div class="text-center w-full">
                <h3
                  class="text-xl font-bold leading-6 text-gray-900 dark:text-white"
                  id="modal-title"
                >
                  ¿Borrar Paciente?
                </h3>
                <div class="mt-3">
                  <p class="text-base text-gray-500 dark:text-gray-300 leading-relaxed">
                    ¿Está seguro de que desea borrar a
                    <span class="font-bold text-gray-900 dark:text-white">Alex Rodríguez</span
                    >?<br />Esta acción es irreversible.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 dark:bg-gray-800/80 px-4 py-4 sm:px-6 flex flex-col sm:flex-row-reverse gap-3"
          >
            <button
              class="inline-flex w-full justify-center rounded-xl bg-red-600 px-3 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto transition-colors min-h-[48px] items-center"
              type="button"
              @click="$emit('delete')"
            >
              Sí, Borrar
            </button>
            <button
              class="inline-flex w-full justify-center rounded-xl bg-white dark:bg-gray-700 px-3 py-3.5 text-base font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto transition-colors min-h-[48px] items-center"
              type="button"
              @click="$emit('back')"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
