export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface MenuItems {
  title: string
  icon: string
  routeName: string
}
/* =========================
   MODELO (API?)
========================= */

export interface SleepRecord {
  id: number
  date: string
  startTime: string
  endTime: string
  durationHours: number
  targetHours: number
  qualityRating: number
  hasNotification: boolean
  patientComment?: string
  professionalNote?: string
}
export interface HttpOptions extends RequestInit {
  auth?: boolean // si true, añade Authorization header
}

export const PACIENT_ROLE = 'paciente'
export const PSICO_ROLE = 'psico'

export enum ToastType {
  Success = 'success',
  Error = 'error',
}
export interface Notification {
  id: number
  type: 'comment' | 'reminder'
  title: string
  message: string
  timeAgo: string
  read: boolean
}
export interface Patient {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
  sleepAverage: number
  lastNote: string
  Eficiency: number
  status: Status
}
