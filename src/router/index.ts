import { createRouter, createWebHistory } from 'vue-router'
import { publicRoutes } from './public.route.ts'


export function createAppRouter() {
  const routes = [...publicRoutes]

  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  return router
}

