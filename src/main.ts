import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createAppRouter } from './router'
import { useAuthStore } from '@/stores/auth.store'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const auth = useAuthStore()
const rol = await auth.bootstrapAuth()

const router = createAppRouter(rol)
app.use(router)
app.mount('#app')
