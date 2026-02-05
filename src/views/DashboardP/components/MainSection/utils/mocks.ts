import { type SleepReg, SleepState } from '@/types/sleepReg.types'
import { type RegCalendar } from '@/types/dashboardP.types'

export const mockReg: SleepReg = {
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
// mockRegistros.ts
export const mockRegCalendar: RegCalendar[] = [
  // 2024 - Enero
  { fecha: '2024-01-05', notification: true },
  { fecha: '2024-01-07', notification: false },
  { fecha: '2024-01-10', notification: false },
  { fecha: '2024-01-12', notification: true },
  { fecha: '2024-01-15', notification: false },
  { fecha: '2024-01-18', notification: false },
  { fecha: '2024-01-22', notification: false },
  { fecha: '2024-01-25', notification: true },
  { fecha: '2024-01-28', notification: false },

  // 2024 - Febrero
  { fecha: '2024-02-02', notification: false },
  { fecha: '2024-02-05', notification: true },
  { fecha: '2024-02-08', notification: false },
  { fecha: '2024-02-11', notification: false },
  { fecha: '2024-02-15', notification: true },
  { fecha: '2024-02-19', notification: false },
  { fecha: '2024-02-23', notification: false },
  { fecha: '2024-02-27', notification: true },

  // 2024 - Marzo (menos registros)
  { fecha: '2024-03-03', notification: false },
  { fecha: '2024-03-10', notification: true },
  { fecha: '2024-03-20', notification: false },
  { fecha: '2024-03-25', notification: true },

  // 2024 - Abril (muy pocos)
  { fecha: '2024-04-05', notification: true },
  { fecha: '2024-04-15', notification: false },

  // 2024 - Mayo (vacío)

  // 2024 - Junio (algunos)
  { fecha: '2024-06-02', notification: false },
  { fecha: '2024-06-10', notification: true },
  { fecha: '2024-06-18', notification: false },

  // 2023 - Noviembre (año anterior)
  { fecha: '2023-11-05', notification: false },
  { fecha: '2023-11-12', notification: true },
  { fecha: '2023-11-19', notification: false },
  { fecha: '2023-11-26', notification: false },

  // 2023 - Diciembre
  { fecha: '2023-12-03', notification: true },
  { fecha: '2023-12-10', notification: false },
  { fecha: '2023-12-17', notification: false },
  { fecha: '2023-12-24', notification: true },
  { fecha: '2023-12-31', notification: false },

  // 2022 - Febrero (dos años atrás)
  { fecha: '2022-02-07', notification: false },
  { fecha: '2022-02-14', notification: false },
  { fecha: '2022-02-21', notification: true },

  // 2022 - Marzo
  { fecha: '2022-03-01', notification: false },
  { fecha: '2022-03-15', notification: true },
  { fecha: '2022-03-30', notification: false },
]
