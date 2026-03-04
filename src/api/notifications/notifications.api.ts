import { httpAuth } from '../http/httpAuth'
import type { NotificationsResponse } from '@/types/notification.types'

const notificationsEndpoint = '/me/notifications'
export async function fetchMeNotifications(): Promise<NotificationsResponse> {
  const response = await httpAuth<NotificationsResponse>(
    `${notificationsEndpoint}`
  )
  return response
}
export async function markNotificationAsRead(id: string): Promise<boolean> {
  const response = await httpAuth<{ success: boolean }>(
    `${notificationsEndpoint}/${id}/read`,
    {
      method: 'PUT',
    }
  )
  return response.success
}

export async function clearAllNotifications(): Promise<boolean> {
  const response = await httpAuth<{ success: boolean }>(
    `${notificationsEndpoint}`,
    {
      method: 'DELETE',
    }
  )
  return response.success
}

// export async function markAllNotificationsAsRead(): Promise<boolean> {
//   const response = await httpAuth<{ success: boolean }>(
//     `${notificationsEndpoint}/read`,
//     {
//       method: 'PUT',
//     }
//   )
//   return response.success
// }
