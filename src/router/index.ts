import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
  type RouterHistory,
} from 'vue-router'
import DashboardP from '../views/DashboardP/MainView.vue'
import Login from '../views/Login/MainView.vue'
import User from '../views/UserMain/MainView.vue'
import Layout from '../views/Layout/MainView.vue'
import Help from '../views/Help/MainView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/Login',
    children: [
      {
        path: 'Dashboard',
        name: 'Dashboard',
        component: DashboardP,
      },
      {
        path: 'User',
        name: 'User',
        component: User,
      },
      {
        path: 'Help',
        name: 'Help',
        component: Help,
      },
    ],
  },
]

const router: Router = createRouter({
  history: <RouterHistory>createWebHistory(),
  routes,
})

export default router
