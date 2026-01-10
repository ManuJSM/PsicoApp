import { http } from './http'

export interface LoginResponse {
  accessToken: string
  message: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return http<LoginResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
    auth: false,
  })
}
//TODO acabar de implementarlo
export async function refresh(): Promise<string> {
  return http<string>('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    auth: false,
  })
}
