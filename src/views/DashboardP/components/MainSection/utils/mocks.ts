import {type Reg, SleepState } from "@/types/regEdit.types"

  export const mockReg: Reg = {
    fecha: new Date('2024-01-20'),
    bedtime: new Date('2024-01-19T23:00:00'),
    wakeup: new Date('2024-01-20T07:15:00'),
    intervals: [
      {
        state: SleepState.INBED,
        hours: 0,
        minutes: 15,
        startTime: new Date('2024-01-19T23:00:00'),
        endTime: new Date('2024-01-19T23:15:00'),
      },
      {
        state: SleepState.ASLEEP,
        hours: 3,
        minutes: 45,
        startTime: new Date('2024-01-19T23:15:00'),
        endTime: new Date('2024-01-20T03:00:00'),
      },
      {
        state: SleepState.AWAKE,
        hours: 0,
        minutes: 20,
        startTime: new Date('2024-01-20T03:00:00'),
        endTime: new Date('2024-01-20T03:20:00'),
      },
      {
        state: SleepState.ASLEEP,
        hours: 3,
        minutes: 55,
        startTime: new Date('2024-01-20T03:20:00'),
        endTime: new Date('2024-01-20T07:15:00'),
      },
    ],
    observaciones:
      'Me costó un poco conciliar el sueño por el ruido de los vecinos, pero una vez dormida descansé bien hasta que me despertó una pesadilla a las 3 de la mañana. Después volví a dormirme rápido y me desperté sintiéndome bastante renovada.',
  }