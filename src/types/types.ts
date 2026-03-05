export interface MenuItems {
  title: string
  icon: string
  routeName: string
}

export interface HttpOptions extends RequestInit {
  auth?: boolean // si true, añade Authorization header
}

export enum Role {
  USER = 'USER',
  PSICO = 'PSICO',
}

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
}
export interface Notification {
  id: number
  type: 'comment' | 'reminder'
  title: string
  message: string
  timeAgo: string
  read: boolean
}
export type User = Patient
export type PsicoInfo = {
  fullName: string
  email: string
  phone: string
  avatar: string | null
}
export type CreatePatient = Omit<Patient, 'id' | 'active' | 'avatar'> & {
  password: string
  psicoId: number
}
export type UpdateUser = Pick<
  Patient,
  'fullName' | 'email' | 'phone' | 'avatar'
>

export interface Patient {
  id: number
  fullName: string
  email: string
  phone: string
  avatar: string | null
  active: boolean
  psico?: PsicoInfo
}
