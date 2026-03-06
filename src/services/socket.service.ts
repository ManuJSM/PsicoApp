import { io, type Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationsStore } from '@/stores/notification.store'
import { NotificationType } from '@/types/notification.types'
import type { Notification } from '@/types/notification.types'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

let socket: Socket | null = null

export const initSocket = (): void => {
  const authStore = useAuthStore()
  const notificationsStore = useNotificationsStore()

  console.log(
    '[Socket] initSocket called, isLoggedIn:',
    authStore.isLoggedIn,
    'userId:',
    authStore.userId
  )

  if (!authStore.isLoggedIn || !authStore.accessToken) {
    console.log('[Socket] Cannot connect: not logged in or no token')
    return
  }

  if (socket?.connected) {
    console.log('[Socket] Already connected')
    return
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: authStore.accessToken,
    },
    path: '/socket.io/',
    transports: ['websocket', 'polling'],
    autoConnect: true,
  })

  // socket.on('connect', () => {
  //   console.log('[Socket] ✅ Connected, socket id:', socket?.id)
  // })

  socket.on('disconnect', (reason: string) => {
    console.log(`[Socket] ❌ Disconnected: ${reason}`)
  })

  socket.on('connect_error', (error: Error) => {
    console.error('[Socket] ❌ Connection error:', error.message)
  })

  socket.on('notification', (notification: Notification) => {
    notificationsStore.addNotification(notification)
  })
}

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = (): Socket | null => socket
