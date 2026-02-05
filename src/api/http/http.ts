import { useAuthStore } from '@/stores/auth.store.ts'
import { AuthenticationError, AuthorizationError } from '@/types/errors.types'
import type { HttpOptions } from '@/types/types'

const apiUrl = 'http://192.168.1.24:80/api'

export async function http<T>(
  endpoint: string,
  options: HttpOptions = {}
): Promise<T> {
  const { auth = true, headers: customHeaders, ...restOptions } = options
  const url = `${apiUrl}${endpoint}`
  const headers = new Headers(customHeaders)
  const authStore = useAuthStore()

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
    if (response.status == 401) {
      throw new AuthenticationError(errorMessage)
    }

    if (response.status == 403) {
      throw new AuthorizationError(errorMessage)
    }
    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}
