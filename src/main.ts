import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createAppRouter } from './router'
import { useAuthStore } from '@/stores/auth.store'
import { AuthenticationError } from '@/types/errors.types'
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const auth = useAuthStore()
await auth.authRefresh()

const router = createAppRouter(auth.role)
app.use(router)

app.config.errorHandler = (err, instance, info) => {
  if (err instanceof AuthenticationError) {
    // Mostrar un mensaje amigable al usuario si es necesario
    // toast.error('Ha ocurrido un error, por favor intenta de nuevo')
    console.log('Error de autenticación:', err.message)
    router.replace({ name: 'login' })
    return
  }
  console.log('Instancia Vue:', instance)
  console.log('Información del error:', info)
  console.log(err)
}
app.mount('#app')
