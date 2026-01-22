import type { SleepState } from '@/types/regEdit.types'
const sleepStateConfig = {
  asleep: {
    class: 'bg-state-asleep',
    bgClass: 'bg-state-asleep/10 text-state-asleep',
    borderClass: 'bg-state-asleep/10 text-state-asleep border-state-asleep/20',
    hoverClass: 'state-asleep/50',
    icon: 'hotel',
    label: 'Dormido',
  },
  inBed: {
    class: 'bg-state-inbed',
    bgClass: 'bg-state-inbed/10 text-state-inbed',
    borderClass: 'bg-state-inbed/10 text-state-inbed border-state-inbed/20',
    hoverClass: 'state-inbed/50',
    icon: 'airline_seat_flat',
    label: 'En Cama',
  },
  awake: {
    class: 'bg-state-awake',
    bgClass: 'bg-state-awake/10 text-state-awake',
    borderClass: 'bg-state-awake/10 text-state-awake border-state-awake/20',
    hoverClass: 'state-awake/50',
    icon: 'accessibility_new',
    label: 'Levantado',
  },
} as const

export const getStateClass = (state: SleepState) =>
  sleepStateConfig[state].class
export const getStateIcon = (state: SleepState) => sleepStateConfig[state].icon
export default sleepStateConfig
