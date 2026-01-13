import { defineStore } from 'pinia'
import { login, refresh } from '@/api/http.auth'
import { useToast } from '@/composables/useToast'
import { AppError, AutenticationError } from '@/types/errors.types'
import { role, ToastType } from '@/types/types'
interface jwtData {
  role: role
  id: number
}

const { setToast } = useToast()
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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    role: null as role | null,
    isLoggedIn: false,
    bootstrapped: false,
  }),
  actions: {
    setToken(token: string): role {
      this.accessToken = token
      const data = parseJwt(token)
      if (data === null) {
        throw new AutenticationError('Invalid token')
      }
      this.role = data.role
      this.isLoggedIn = true
      return this.role
    },

    async login(email: string, password: string) {
      const res = await login(email, password)
      const rol = this.setToken(res.accessToken)
      return rol
    },

    async bootstrapAuth(): Promise<role | null> {
      try {
        const res = await refresh()
        return this.setToken(res.accessToken)
      } catch (e: unknown) {
        if (e instanceof AppError) {
          setToast(ToastType.Error, e.message)
        }
        this.logout()
        return null
      } finally {
        this.bootstrapped = true
      }
    },

    logout() {
      this.accessToken = null
      this.role = null
      this.isLoggedIn = false
      //TODO: deslogear en el backend
    },
  },
})
