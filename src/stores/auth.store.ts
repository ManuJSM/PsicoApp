import { defineStore } from 'pinia'
import { http } from '@/api/http'
import { login ,type LoginResponse } from '@/api/http.auth'
import { useToast } from '@/composables/useToast'
import { AppError, AutenticationError } from '@/types/errors.types'
import { role, ToastType } from '@/types/types'
interface jwtData {
  role: role
  id : number
}

const { setToast } = useToast()
export function parseJwt(token: string) {
  try {
    const base64Payload = token.split('.')[1]
    if(base64Payload === undefined){
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
    setToken(token: string, role: role) {
      this.accessToken = token
      this.role = role
      this.isLoggedIn = true
    },

    async login(email: string, password: string) {
      const res = await login(email, password)
      const data = parseJwt(res.accessToken)
      if(data === null){
        throw new AutenticationError('Invalid token')
      }
      console.log(data)
      this.setToken(res.accessToken, data.role)
      return data.role
    },

    async bootstrapAuth() {
      try {
        const res = await http<LoginResponse>('/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          auth: false,
        })

        this.setToken(res.accessToken, role.psico)

      } catch (e: unknown){
        if(e instanceof AppError){
          setToast(ToastType.Error, e.message)
        }
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

