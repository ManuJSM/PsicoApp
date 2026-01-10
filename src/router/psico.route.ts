import type { RouteRecordRaw } from 'vue-router'
import { lazyLoad } from './utils.ts'
import Layout from '@/views/Layout/MainView.vue'

const routes: Array<RouteRecordRaw> = [
 {
    path: 'Dashboard/:id?',
    name: 'Dashboard',
    component: lazyLoad('DashboardP'),
    props: true,
  },
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
    path: 'Edit/:id',
    name: 'UserEditReg',
    component: lazyLoad('UserEditReg'),
    props: true,
  },
  {
    path: 'Help',
    name: 'Help',
    component: lazyLoad('Help'),
  },
]

export const psicoRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: '/login',
    children: routes,
  },
]
