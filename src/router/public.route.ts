import type { RouteRecordRaw } from 'vue-router'
import Login from '@/views/Login/MainView.vue'
import NotFound from '@/views/NotFound/MainView.vue'

export const publicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  //TODO poner una pagina de prohibido
  {
    path: '/Forbidden',
    name: 'unauthorized',
    component: Login,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]
