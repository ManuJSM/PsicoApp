export interface TimeValue {
  hour: number
  minute: number
  amPm: 'am' | 'pm'
}
export enum SleepState {
  ASLEEP = 'asleep',
  INBED = 'inBed',
  AWAKE = 'awake',
}

export type Interval = {
  state: SleepState
  hours: number
  minutes: number
  startTime: Date
  endTime: Date
}
export interface Reg {
  fecha: Date
  bedtime: Date | null
  wakeup: Date | null
  intervals: Interval[]
  observaciones: string
}

export type IntervalModel = Pick<Interval, 'state' | 'startTime' | 'endTime'>
