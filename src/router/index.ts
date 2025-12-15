import { createRouter, createWebHistory, type Router, type RouteRecordRaw, type RouterHistory } from 'vue-router'
import DashboardP from '../views/DashboardP/MainView.vue'
import Login from '../views/Login/MainView.vue'
import Pacient from '../views/UserMain/MainView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/Dashboard',
    name: 'DashboardP',
    component: DashboardP,
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/account',
    name: 'User',
    component: Pacient,
  },
]

const router: Router = createRouter({
  history: <RouterHistory>createWebHistory(),
  routes,
})

export default router
