import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
  type RouterHistory,
} from 'vue-router'
import Login from '@/views/Login/MainView.vue'
import Layout from '@/views/Layout/MainView.vue'

const lazyLoad = (component: string) => {
  return () => import(`@/views/${component}/MainView.vue`)
}

const pacientRoutes: Array<RouteRecordRaw> = [
  {
    path: 'User',
    name: 'User',
    component: lazyLoad('UserMain'),
  },
  {
    path: 'Calendar',
    name: 'UserCalendar',
    component: lazyLoad('UserCalendar'),
  },
  {
    path: 'Add',
    name: 'UserAddReg',
    component: lazyLoad('UserAddReg'),
  },
  {
    path: 'Help',
    name: 'Help',
    component: lazyLoad('Help'),
  },
]
const psicoRoutes: Array<RouteRecordRaw> = [
  {
    path: 'Dashboard/:id?',
    name: 'Dashboard',
    component: lazyLoad('DashboardP'),
    props: true,
  },
]

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
    children: [...pacientRoutes, ...psicoRoutes],
  },
]

const router: Router = createRouter({
  history: <RouterHistory>createWebHistory(),
  routes,
})

export default router
