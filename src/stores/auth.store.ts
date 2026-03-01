import { defineStore } from 'pinia'
import { loginAPI, logoutAPI, refresh } from '@/api/auth/auth.api'
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

  async function authRefresh(): Promise<void> {
    try {
      const res = await refresh()
      if (res.accessToken) {
        setToken(res.accessToken)
      }
    } catch {
      logout()
    }
  }

  async function logout() {
    await logoutAPI()
    accessToken.value = null
    role.value = null
    isLoggedIn.value = false
  }

  return {
    accessToken,
    role,
    isLoggedIn,
    setToken,
    login,
    authRefresh,
    logout,
  }
})
