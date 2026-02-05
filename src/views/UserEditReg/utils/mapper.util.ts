import type { IntervalModel, Interval } from '@/types/sleepReg.types'

const intervalToModel = (interval: Interval): IntervalModel => {
  return {
    state: interval.state,
    startTime: interval.startTime,
    endTime: interval.endTime,
  }
}

export { intervalToModel }
