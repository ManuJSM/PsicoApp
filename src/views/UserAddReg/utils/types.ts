export interface SleepCardView {
  id: number
  type: 'bed' | 'sleep' | 'out'
  title: string
  startTime: string
  endTime: string
  icon: string
  day: 'today' | 'tomorrow'
}

export interface SleepCardModel {
  type: 'bed' | 'sleep' | 'out'
  startTime: string
  endTime: string
  day: 'today' | 'tomorrow'
}

export function scModelToView(scModel: SleepCardModel, id: number): SleepCardView {
  return {
    ...scModel,
    title:
      scModel.type === 'bed'
        ? 'En cama sin dormir'
        : scModel.type === 'sleep'
          ? 'Tiempo durmiendo'
          : 'Tiempo fuera de la cama',
    icon:
      scModel.type === 'bed' ? 'bed' : scModel.type === 'sleep' ? 'dark_mode' : 'directions_walk',
    id: id,
  }
}
