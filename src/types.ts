export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface MenuItems {
  title: string
  icon: string
  routeName: string
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
  sleepAverage: string
  lastNote: string
  consistency: string
  status: Status
}
