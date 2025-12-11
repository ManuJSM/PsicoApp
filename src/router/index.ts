import { createRouter, createWebHistory, type Router } from 'vue-router'
import DashboardP from '../views/DashboardP/MainView.vue'

const routes = [
  {
    path: '/',
    name: 'DashboardP',
    component: DashboardP,
  },
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
