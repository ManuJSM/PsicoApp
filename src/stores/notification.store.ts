import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  clearAllNotifications,
  fetchMeNotifications,
  markNotificationAsRead,
} from '@/api/notifications/notifications.api'
import type { Notification } from '@/types/notification.types'

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<Notification[]>([])
  const unreadCount = ref<number>(0)

  const fetchNotifications = async () => {
    const response = await fetchMeNotifications()

    items.value = response.data
    unreadCount.value = response.meta.unread_count
  }

  const addNotification = (notification: Notification) => {
    items.value.unshift(notification)
    unreadCount.value++
  }

  const markAsRead = async (id: string) => {
    const isUpdated = await markNotificationAsRead(id)
    if (!isUpdated) return
    const notification = items.value.find(n => n.id === id)
    if (notification && !notification.isRead) {
      notification.isRead = true
      unreadCount.value--
    }
  }
  const clearAll = async () => {
    await clearAllNotifications()

    items.value = []
    unreadCount.value = 0
  }

  return {
    items,
    unreadCount,
    fetchNotifications,
    addNotification,
    markAsRead,
    clearAll,
  }
})
