
export enum Status{
  Active = 'Active',
  Inactive = 'Inactive'
}

export enum ToastType {
  Success = 'success',
  Error = 'error',
}
export type Notification = {
  id: number
  title: string
  description: string
  time: string
  unread?: boolean
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
