import { ref } from 'vue'
import { ToastType } from '@/types/types'

const showToast = ref(false)
const toastType = ref<ToastType>(ToastType.SUCCESS)
const toastMessage = ref('')
const timeout = 2000

export function useToast() {
  const setToast = (type: ToastType, message: string) => {
    toastType.value = type
    toastMessage.value = message
    showToast.value = true

    setTimeout(() => {
      showToast.value = false
    }, timeout)
  }

  return {
    showToast,
    toastType,
    toastMessage,
    setToast,
  }
}
