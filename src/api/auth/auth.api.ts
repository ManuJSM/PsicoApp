import { http } from '../http/http'

export interface LoginResponse {
  accessToken: string
  message: string
}

export async function loginAPI(
  email: string,
  password: string
): Promise<LoginResponse> {
  return http<LoginResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
    auth: false,
  })
}
//TODO acabar de implementarlo
export async function refresh(): Promise<LoginResponse> {
  return http<LoginResponse>('/auth/refresh', {
    method: 'GET',
    credentials: 'include',
    auth: false,
  })
}

export async function logoutAPI(): Promise<void> {
  return http<void>('/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
}
