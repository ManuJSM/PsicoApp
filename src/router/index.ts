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
        component: lazyLoad('DashboardP'),
      },
      {
        path: 'User',
        name: 'User',
        component: lazyLoad('UserMain'),
      },
      {
        path: 'Help',
        name: 'Help',
        component: lazyLoad('Help'),
      },
    ],
  },
]

const router: Router = createRouter({
  history: <RouterHistory>createWebHistory(),
  routes,
})

export default router
