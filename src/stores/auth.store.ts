import { defineStore } from 'pinia'
import { loginAPI, refresh } from '@/api/http.auth'
import { AuthenticationError } from '@/types/errors.types'
import { ref } from 'vue'
import { Role } from '@/types/types'
interface jwtData {
  role: Role
  id: number
}

export function parseJwt(token: string) {
  try {
    const base64Payload = token.split('.')[1]
    if (base64Payload === undefined) {
      return null
    }
    const payload = atob(base64Payload)
    return JSON.parse(payload) as jwtData
  } catch (err) {
    console.error('Invalid JWT', err)
    return null
  }
}
export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const role = ref<Role | null>(null)
  const isLoggedIn = ref(false)
  const bootstrapped = ref(false)

  function setToken(token: string) {
    accessToken.value = token

    const data = parseJwt(token)
    if (data === null) {
      throw new AuthenticationError('Invalid token')
    }

    role.value = data.role
    isLoggedIn.value = true
  }

  async function login(email: string, password: string) {
    const res = await loginAPI(email, password)
    setToken(res.accessToken)
  }

  async function bootstrapAuth(): Promise<void> {
    try {
      const res = await refresh()
      if (res.accessToken) {
        setToken(res.accessToken)
      }
    } catch {
      logout()
    } finally {
      bootstrapped.value = true
    }
  }

  function logout() {
    accessToken.value = null
    role.value = null
    isLoggedIn.value = false
    // TODO: deslogear en el backend
  }

  return {
    accessToken,
    role,
    isLoggedIn,
    bootstrapped,
    setToken,
    login,
    bootstrapAuth,
    logout,
  }
})
