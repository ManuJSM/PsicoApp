<script setup lang="ts">
import { computed, watch } from 'vue'
import type { ToastType } from '@/types/types'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as () => ToastType,
    default: 'success' as ToastType,
    validator: (value: string): value is ToastType =>
      ['success', 'error'].includes(value as ToastType),
  },
  message: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:show'])

const handleClose = () => {
  emit('update:show', false)
}

// Auto-close after 2 seconds when shown
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      window.setTimeout(() => {
        handleClose()
      }, 2000)
    }
  },
)

const toastClasses = computed(() => ({
  'bg-green-500/20 text-green-400': props.type === 'success',
  'bg-red-500/20 text-red-400': props.type === 'error',
}))

const icon = computed(
  () =>
    ({
      success: 'check',
      error: 'close',
    })[props.type],
)

const defaultMessages: Record<ToastType, string> = {
  success: 'Operación exitosa',
  error: 'Ha ocurrido un error',
}
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="z-50 fixed bottom-8 flex justify-center w-full">
      <div class="flex items-center gap-4 bg-[#111827] p-4 rounded-lg shadow-lg">
        <div
          class="flex items-center justify-center shrink-0 size-8 rounded-full"
          :class="toastClasses"
        >
          <span class="material-symbols-outlined text-base">{{ icon }}</span>
        </div>
        <p class="flex-1 text-sm font-semibold leading-normal text-gray-200">
          {{ message || defaultMessages[type] }}
        </p>
        <button
          class="shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
          @click="handleClose"
          aria-label="Cerrar notificación"
        >
          <span class="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  transform: translateY(0);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
