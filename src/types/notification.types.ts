export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export enum NotificationType {
  COMMENT = 'comment',
  REMINDER = 'reminder',
}

export interface NotificationsResponse {
  data: Notification[]
  meta: {
    unread_count: number
  }
}
