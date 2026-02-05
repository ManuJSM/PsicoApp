export enum DashboardViews {
  DIARIA = 'Vista Diaria',
  SEMANAL = 'Vista Semanal',
  MENSUAL = 'Vista Mensual',
  ANUAL = 'Vista Anual',
}

export type RegCalendar = {
  fecha: string
  notification: boolean
}
