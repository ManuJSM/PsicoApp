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

export interface SleepReg {
  fecha: Date
  bedtime: Date | null
  wakeup: Date | null
  intervals: Interval[]
  observaciones: string
  psicoComment?: string
}

export type IntervalDto = {
  state: string
  hours: string
  minutes: string
  startTime: string
  endTime: string
}
export interface SleepRegDto {
  fecha: string
  bedtime: string
  wakeup: string
  intervals: IntervalDto[]
  observaciones: string
  psicoComment?: string
}

export type IntervalModel = Pick<Interval, 'state' | 'startTime' | 'endTime'>
