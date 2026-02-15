import { http } from './http'
import { AuthenticationError } from '@/types/errors.types'
import { useAuthStore } from '@/stores/auth.store'

export async function httpAuth<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const authStore = useAuthStore()

  try {
    return await http<T>(endpoint, options)
  } catch (err: unknown) {
    if (err instanceof AuthenticationError) {
      await authStore.authRefresh()
      if (authStore.isLoggedIn) {
        return await http<T>(endpoint, options)
      }
    }
    throw err
  }
}
