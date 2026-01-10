import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createAppRouter } from './router'
import { useAuthStore } from '@/stores/auth.store'

const app = createApp(App)
const pinia = createPinia()
const router = createAppRouter()
app.use(pinia)
app.use(router)

const auth = useAuthStore()
await auth.bootstrapAuth(router)

app.mount('#app')
