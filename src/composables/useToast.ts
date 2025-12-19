import { ref } from 'vue'
import { ToastType } from '@/types'

const showToast = ref(false)
const toastType = ref<ToastType>(ToastType.Success)
const toastMessage = ref('')

export function useToast() {
  const setToast = (type: ToastType, message: string) => {
    toastType.value = type
    toastMessage.value = message
    showToast.value = true

    setTimeout(() => {
      showToast.value = false
    }, 2000)
  }

  return {
    showToast,
    toastType,
    toastMessage,
    setToast
  }
}
