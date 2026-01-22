import { defineStore } from 'pinia'
import { loginAPI, refresh } from '@/api/http.auth'
import { AutenticationError } from '@/types/errors.types'
import { role } from '@/types/types'
interface jwtData {
  role: role
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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    role: null as role | null,
    isLoggedIn: false,
    bootstrapped: false,
  }),
  actions: {
    setToken(token: string) {
      this.accessToken = token
      const data = parseJwt(token)
      if (data === null) {
        throw new AutenticationError('Invalid token')
      }
      this.role = data.role
      this.isLoggedIn = true
    },

    async login(email: string, password: string) {
      const res = await loginAPI(email, password)
      this.setToken(res.accessToken)
    },

    async bootstrapAuth(): Promise<void> {
      try {
        const res = await refresh()
        if (res.accessToken) {
          this.setToken(res.accessToken)
        }
      } catch {
        this.logout()
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
