export interface SleepCardView {
  sleepCardModel: SleepCardModel
  title: string
  id: number
  icon: string
}

export interface SleepCardModel {
  type: 'bed' | 'sleep' | 'out'
  startTime: {
    hour: string
    day: 'today' | 'tomorrow'
  }
  endTime: {
    hour: string
    day: 'today' | 'tomorrow'
  }
}
