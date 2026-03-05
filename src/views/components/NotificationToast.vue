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

  watch(
    () => props.show,
    newVal => {
      if (newVal) {
        const timeout = props.type === 'error' ? 5000 : 2000
        window.setTimeout(() => {
          handleClose()
        }, timeout)
      }
    }
  )

  const icon = computed(
    () =>
      ({
        success: 'check_circle',
        error: 'warning',
      })[props.type]
  )

  const defaultMessages: Record<ToastType, string> = {
    success: 'Operación completada con éxito',
    error: 'Se ha producido un error en el sistema',
  }
</script>

<template>
  <div
    class="z-60 fixed bottom-10 left-0 right-0 flex justify-center px-6 pointer-events-none"
  >
    <Transition name="toast-pop" appear>
      <div
        v-if="show"
        class="pointer-events-auto flex items-center gap-4 bg-white/10 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-md w-full"
      >
        <div
          class="shrink-0 size-10 rounded-xl flex items-center justify-center"
          :class="
            props.type === 'error'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-emerald-500/20 text-emerald-400'
          "
        >
          <span class="material-symbols-outlined text-xl!">{{ icon }}</span>
        </div>

        <div class="flex-1 min-w-0">
          <p
            class="text-[13px] text-white/90 font-medium leading-relaxed whitespace-pre-wrap tracking-tight wrap-words"
          >
            {{ message || defaultMessages[type] }}
          </p>
        </div>

        <button
          class="shrink-0 text-white/30 hover:text-white transition-colors p-1"
          @click="handleClose"
        >
          <span class="material-symbols-outlined text-lg!">close</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  /* Animación tipo 'Pop' de sistema moderno */
  .toast-pop-enter-active {
    /* cubic-bezier con rebote (outBack) */
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .toast-pop-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toast-pop-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }

  .toast-pop-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }

  /* Fuente limpia para que el JSON no parezca sucio */
  p {
    font-family:
      'Inter',
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
