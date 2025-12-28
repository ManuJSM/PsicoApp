import type { SleepCardView, SleepCardModel } from './types'

export function validarSleepCard(card: SleepCardModel): {
  isValid: boolean
  error: string
} {
  if (!card.startTime || !card.endTime) {
    return {
      isValid: false,
      error: 'Las horas de inicio y finalización son requeridas',
    }
  }
  //FIXME Necesita una vuelta de lógica para manejar
  if (card.startTime.localeCompare(card.endTime) >= 0) {
    return {
      isValid: false,
      error: 'La hora de inicio no puede ser mayor o igual que la hora de finalización',
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
