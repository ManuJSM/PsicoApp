import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
  }),
  actions: {
    setToken(token: string) {
      this.accessToken = token
    },
    clearToken() {
      this.accessToken = null
    },
  },
})
