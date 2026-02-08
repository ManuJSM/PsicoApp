import {
  type IntervalDto,
  type Interval,
  type SleepReg,
  type SleepRegDto,
  SleepState,
} from '@/types/sleepReg.types'

function parseSleepState(value: string): SleepState {
  switch (value) {
    case 'inBed':
      return SleepState.INBED
    case 'asleep':
      return SleepState.ASLEEP
    case 'awake':
      return SleepState.AWAKE
    default:
      throw new Error(`Valor de SleepState inválido: ${value}`)
  }
}

export function fromIntervalDtoToInterval(dto: IntervalDto): Interval {
  const startTime = new Date(dto.startTime)
  const endTime = new Date(dto.endTime)
  const duration = new Date(endTime.getTime() - startTime.getTime())

  return {
    state: parseSleepState(dto.state),
    hours: duration.getHours(),
    minutes: duration.getMinutes(),
    startTime,
    endTime,
  }
}

export function fromRegDtoToReg(dto: SleepRegDto): SleepReg {
  return {
    fecha: new Date(dto.fecha),
    bedtime: new Date(dto.bedtime),
    wakeup: new Date(dto.wakeup),
    intervals: dto.intervals.map(fromIntervalDtoToInterval),
    observaciones: dto.observaciones,
    psicoComment: dto?.psicoComment,
  }
}
