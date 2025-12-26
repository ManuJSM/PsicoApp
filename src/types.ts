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
  day: string
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
