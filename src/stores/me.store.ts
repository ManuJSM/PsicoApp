import { httpAuth } from '@/api/http/httpAuth'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type User } from '@/types/types'

export const useMeStore = defineStore('me', () => {
  const me = ref<User | null>(null)
  const loaded = ref(false)

  async function fetchMe() {
    if (loaded.value) return
    me.value = await httpAuth<User>('/me')
    loaded.value = true
  }

  function reset() {
    me.value = null
    loaded.value = false
  }

  return { me, fetchMe, reset }
})
