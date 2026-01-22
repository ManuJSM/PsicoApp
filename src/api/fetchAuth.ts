import { http } from './http'
import { useRouter } from 'vue-router'
import { AuthorizationError, AutenticationError } from '@/types/errors.types'
import { useAuthStore } from '@/stores/auth.store'

export async function fetchWithAuth<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const router = useRouter()
  const authStore = useAuthStore()

  try {
    return await http<T>(endpoint, options)
  } catch (err: unknown) {
    if (err instanceof AutenticationError) {
      await authStore.bootstrapAuth()
      if (authStore.isLoggedIn) {
        return await http<T>(endpoint, options)
      }
      router.replace({ name: 'login' })
    } else if (err instanceof AuthorizationError) {
      router.replace({ name: 'unauthorized' })
    }
    throw err
  }
}
