import type { RouteRecordRaw } from 'vue-router'
import Login from '@/views/Login/MainView.vue'

export const publicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/Forbidden',
    name: 'unauthorized',
    component: Login,
  },
]
