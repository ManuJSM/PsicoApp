import { createRouter, createWebHistory, type Router, type RouteRecordRaw, type RouterHistory } from 'vue-router'
import DashboardP from '../views/DashboardP/MainView.vue'
import Login from '../views/Login/MainView.vue'
import Pacient from '../views/UserMain/MainView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'DashboardP',
    component: DashboardP,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/user',
    name: 'User',
    component: Pacient,
  },
]

const router: Router = createRouter({
  history: <RouterHistory>createWebHistory(),
  routes,
})

export default router
