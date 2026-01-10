import { useAuthStore } from '@/stores/auth.store.ts'
import { AutenticationError, AuthorizationError } from '@/types/errors.types'
import type { HttpOptions } from '@/types/types'
import { useToast } from '@/composables/useToast'
import { ToastType } from '@/types/types'
const apiUrl = 'http://localhost:3000'

export async function http<T>(endpoint: string, options: HttpOptions = {}): Promise<T> {
  const { auth = true, headers: customHeaders, ...restOptions } = options
  const url = `${apiUrl}${endpoint}`
  const headers = new Headers(customHeaders)
  const authStore = useAuthStore()
  const { setToast } = useToast()

  if (auth && authStore.accessToken) {
    headers.set('Authorization', `Bearer ${authStore.accessToken}`)
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`
    try {
      const errData = await response.json()
      errorMessage = errData?.error || errorMessage
    } catch {}
    if(response.status == 401){
      setToast(ToastType.Error, errorMessage)
      throw new AutenticationError(errorMessage)
    }
    if(response.status == 403){
      setToast(ToastType.Error, errorMessage)
      throw new AuthorizationError(errorMessage)
    }
    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}
