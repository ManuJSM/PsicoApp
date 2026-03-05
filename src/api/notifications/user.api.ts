import { httpAuth } from '@/api/http/httpAuth'
import type { CreatePatient, User } from '@/types/types'

const userEndpoint = '/users'

export async function createUser({
  user,
}: {
  user: CreatePatient
}): Promise<User> {
  return await httpAuth<User>(`${userEndpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
}
export async function updatePacient({
  fullName,
  email,
  phone,
  active,
  id,
}: {
  fullName: string
  email: string
  active: boolean
  phone: string
  id: number
}): Promise<boolean> {
  const updated = await httpAuth<{ success: boolean }>(
    `${userEndpoint}/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName,
        email: email,
        phone: phone,
        active: active,
      }),
    }
  )
  return updated.success
}

export async function deleteUser({ id }: { id: number }): Promise<boolean> {
  return httpAuth<{ success: boolean }>(`${userEndpoint}/${id}`, {
    method: 'DELETE',
  }).then(res => res.success)
}
