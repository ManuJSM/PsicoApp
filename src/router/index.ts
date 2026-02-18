import { createRouter, createWebHistory } from 'vue-router'
import { publicRoutes } from './public.route.ts'
import { DASHBOARD_P, psicoRoutes } from './psico.route.ts'
import { DASHBOARD_U, userRoutes } from './user.route.ts'
import { Role } from '@/types/types.ts'
import { useAuthStore } from '@/stores/auth.store'

export function createAppRouter(rol: Role | null) {
  const routes = [...publicRoutes]

  if (rol === Role.PSICO) routes.push(...psicoRoutes)
  if (rol === Role.USER) routes.push(...userRoutes)

  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  router.beforeEach(to => {
    const auth = useAuthStore()

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    // const rol = to.matched.find(record => record.meta.role)?.meta.role

    if (requiresAuth && !auth.isLoggedIn) {
      return { name: 'login' }
    }

    if (to.name === 'login' && auth.isLoggedIn) {
      if (auth.role === Role.USER) {
        return { name: DASHBOARD_U }
      } else if (auth.role === Role.PSICO) {
        return { name: DASHBOARD_P }
      }
    }

    // if (rol && auth.role !== rol) {
    //   return { name: 'unauthorized' }
    // }
  })

  return router
}
