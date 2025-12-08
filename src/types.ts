export interface Patient {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
  sleepAverage: string
  lastNote: string
  consistency: string
  status: 'active' | 'inactive'
}
