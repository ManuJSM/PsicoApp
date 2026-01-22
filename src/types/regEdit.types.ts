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
