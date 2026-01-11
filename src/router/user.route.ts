import type { RouteRecordRaw } from 'vue-router'
import { lazyLoad } from './utils.ts'
import Layout from '@/views/Layout/MainViewU.vue'
import { role } from '@/types/types.ts'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'Dashboard',
    name: 'DashboardU',
    component: lazyLoad('DashboardU'),
  },
  {
    path: 'myAccount',
    name: 'myAccountU',
    component: lazyLoad('MiCuenta'),
  },
  {
    path: 'Calendar',
    name: 'UserCalendar',
    component: lazyLoad('UserCalendar'),
  },
  {
    path: 'Calendar/Edit/:id',
    name: 'UserEditReg',
    component: lazyLoad('UserEditReg'),
    props: true,
  },
  {
    path: 'Help',
    name: 'HelpU',
    component: lazyLoad('Help'),
  },
]
export const userRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    meta: {
      requiresAuth: true,
      role: role.user,
    },
    children: routes,
  },
]
