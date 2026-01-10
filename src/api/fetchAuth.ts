import { http } from './http'
import { useRouter } from 'vue-router'
import { AuthorizationError, AutenticationError } from '@/types/errors.types'

export async function fetchWithAuth<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const router = useRouter()

  try {
    return await http<T>(endpoint, options)
  } catch (err: unknown) {
    if (err instanceof AutenticationError) {
      router.replace({name: 'login'})
    } else if (err instanceof AuthorizationError) {
      router.replace({name: 'unauthorized'})
    }
    throw err
  }
}
