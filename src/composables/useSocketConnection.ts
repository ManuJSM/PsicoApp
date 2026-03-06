import { watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { initSocket, disconnectSocket } from '@/services/socket.service'

export function useSocketConnection() {
  const authStore = useAuthStore()

  const setupSocketWatcher = () => {
    watch(
      () => authStore.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn && authStore.accessToken) {
          initSocket()
        } else {
          disconnectSocket()
        }
      },
      { immediate: true }
    )
  }

  return {
    setupSocketWatcher,
  }
}
