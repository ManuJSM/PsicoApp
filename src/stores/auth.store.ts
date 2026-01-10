import { defineStore } from 'pinia'
import { http } from '@/api/http'
import { login ,type LoginResponse } from '@/api/http.auth'
import type { Router } from 'vue-router'
import { userRoutes } from '@/router/user.route'
import { psicoRoutes} from '@/router/psico.route'
import { useToast } from '@/composables/useToast'
import { AppError } from '@/types/errors.types'
import { ToastType } from '@/types/types'


const { setToast } = useToast()


export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    role: null as 'user' | 'psico' | null,
    isLoggedIn: false,
    routesLoaded: false,
    bootstrapped: false,
  }),
  actions: {
    setToken(token: string, role: 'user' | 'psico') {
      this.accessToken = token
      this.role = role
      this.isLoggedIn = true
    },

    async login(email: string, password: string, router?: Router) {
      const res = await login(email, password)

      this.setToken(res.accessToken, res.role)
      if (router) {
        const routes = res.role === 'psico' ? psicoRoutes: userRoutes
        routes.forEach(r => router.addRoute(r))
        router.replace({ name: res.role === 'psico' ? 'Dashboard' : 'Dashboard' })
      }
    },

    async bootstrapAuth(router?: Router) {
      try {
        const res = await http<LoginResponse>('/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          auth: false,
        })

        this.setToken(res.accessToken, res.role)

        if (router && !this.routesLoaded) {
          const routes = res.role === 'psico' ? psicoRoutes: userRoutes
          routes.forEach(r => router.addRoute(r))
          this.routesLoaded = true
        }
      } catch (e: unknown){
        if(e instanceof AppError){
          setToast(ToastType.Error, e.message)
        }
        this.logout(router)
      } finally {
        this.bootstrapped = true
      }
    },

    logout(router?: Router) {
      this.accessToken = null
      this.role = null
      this.isLoggedIn = false
      this.routesLoaded = false

      if (router) {
        router.replace({name: 'login'} )
      }
    },
  },
})

