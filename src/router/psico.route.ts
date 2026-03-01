import type { RouteRecordRaw } from 'vue-router'
import { lazyLoad } from './utils.ts'
import Layout from '@/views/Layout/MainViewP.vue'
import { Role } from '@/types/types.ts'
export const DASHBOARD_P_ROOT = 'Dashboard_P_ROOT'
export const DASHBOARD_P_ID = 'Dashboard_P_ID'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/Dashboard',
    name: DASHBOARD_P_ROOT,
    component: lazyLoad('DashboardP'),
  },
  {
    path: '/Dashboard/:id(\\d+)/sleepCalendar/:date(\\d{4}-\\d{2}-\\d{2})',
    name: DASHBOARD_P_ID,
    component: lazyLoad('DashboardP'),
    props: true,
  },

  {
    path: '/myAccount',
    name: 'myAccountP',
    component: lazyLoad('MiCuenta'),
  },
  {
    path: '/help',
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
