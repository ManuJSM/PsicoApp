import type { RouteRecordRaw } from 'vue-router'
import { lazyLoad } from './utils.ts'
import Layout from '@/views/Layout/MainViewP.vue'
import { Role } from '@/types/types.ts'
export const DASHBOARD_P = 'DashboardP'

const routes: Array<RouteRecordRaw> = [
  {
    path: 'Dashboard/:id?',
    name: DASHBOARD_P,
    component: lazyLoad(DASHBOARD_P),
    props: true,
  },
  {
    path: 'myAccount',
    name: 'myAccountP',
    component: lazyLoad('MiCuenta'),
  },
  {
    path: 'Help',
    name: 'HelpP',
    component: lazyLoad('Help'),
  },
]

export const psicoRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    meta: {
      requiresAuth: true,
      role: Role.PSICO,
    },
    children: routes,
  },
]
