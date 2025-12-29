import type { SleepCardView, SleepCardModel } from './types'

export function validarSleepCard(
  card: SleepCardModel,
  sleepRecords: SleepCardModel[],
): {
  isValid: boolean
  error: string
} {
  if (!card.startTime.hour || !card.endTime.hour) {
    return {
      isValid: false,
      error: 'Las horas de inicio y finalización son requeridas',
    }
  }

  // if (
  //   card.startTime.hour.localeCompare('12:00') > 0 &&
  //   card.endTime.hour.localeCompare('12:00') < 0
  // ) {
  //   return {
  //     isValid: true,
  //     error: '',
  //   }
  // }
  // if (card.startTime.hour.localeCompare(card.endTime.hour) >= 0) {
  //   return {
  //     isValid: false,
  //     error: 'La hora de inicio no puede ser mayor o igual que la hora de finalización',
  //   }
  // }
  const maxHours = 12
  if (restarHoras(card.startTime.hour, card.endTime.hour).hh >= maxHours) {
    return {
      isValid: false,
      error: `Quien duerme mas de ${maxHours} horas?`,
    }
  }
  if (haySolapamientoEnArray([card, ...sleepRecords])) {
    return {
      isValid: false,
      error: 'No se pueden solapar intervalos',
    }
  }

  return { isValid: true, error: '' }
}
export function scModelToView(scModel: SleepCardModel, id: number): SleepCardView {
  return {
    sleepCardModel: scModel,
    id: id,
    title:
      scModel.type === 'bed'
        ? 'En cama sin dormir'
        : scModel.type === 'sleep'
          ? 'Tiempo durmiendo'
          : 'Tiempo fuera de la cama',
    icon:
      scModel.type === 'bed' ? 'bed' : scModel.type === 'sleep' ? 'dark_mode' : 'directions_walk',
  }
}
function seSolapan(s1: SleepCardModel, s2: SleepCardModel): boolean {
  const inicio1 = aMinutos(s1.startTime.hour)
  let fin1 = aMinutos(s1.endTime.hour)
  const inicio2 = aMinutos(s2.startTime.hour)
  let fin2 = aMinutos(s2.endTime.hour)

  // Ajustar rangos que cruzan medianoche
  if (fin1 <= inicio1) fin1 += 24 * 60
  if (fin2 <= inicio2) fin2 += 24 * 60

  return inicio1 < fin2 && inicio2 < fin1
}
function haySolapamientoEnArray(rangos: SleepCardModel[]): boolean {
  return rangos.some((rango, index) =>
    rangos.some((otro, j) => j !== index && seSolapan(rango, otro)),
  )
}

const aMinutos = (hora: string): number => {
  const partes = hora.split(':')
  if (partes.length !== 2) throw new Error(`Hora inválida: ${hora}`)

  const h = Number(partes[0])
  const m = Number(partes[1])

  if (Number.isNaN(h) || Number.isNaN(m)) throw new Error(`Hora inválida: ${hora}`)

  return h * 60 + m
}
export function restarHoras(inicio: string, fin: string): { hh: number; mm: number } {
  let diff = aMinutos(fin) - aMinutos(inicio)
  if (diff < 0) diff += 24 * 60

  const hh = Math.floor(diff / 60)
  const mm = diff % 60

  return { hh, mm }
}

// export function sortCards(a: SleepCardView, b: SleepCardView): number {
//   const dayOrder = (day: string) => (day === 'today' ? 0 : 1)
//   const dayDiff =
//     dayOrder(a.sleepCardModel.startTime.day) - dayOrder(b.sleepCardModel.startTime.day)
//   if (dayDiff !== 0) return dayDiff

//   const hourA = a.sleepCardModel.startTime.hour
//   const hourB = b.sleepCardModel.startTime.hour

//   return aMinutos(hourA) - aMinutos(hourB) // menor hora primero
// }

// export function sortCards(a: SleepCardView, b: SleepCardView): number {
// const hourA = a.sleepCardModel.startTime.hour
// const hourB = b.sleepCardModel.startTime.hour

// const dayDiff = aMinutos(hourA) - aMinutos(hourB) // menor hora primero

// return dayDiff
// }
