export interface SleepCardView {
  sleepCardModel: SleepCardModel
  title: string
  id: number
  icon: string
}

export interface SleepCardModel {
  type: 'bed' | 'sleep' | 'out'
  startTime: string
  endTime: string
  day: 'today' | 'tomorrow'
}
