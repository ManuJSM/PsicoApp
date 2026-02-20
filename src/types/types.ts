export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

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

export interface Patient {
  id: number
  fullName: string
  email: string
  phone: string
  avatar: string
  status: Status
}
