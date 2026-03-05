import { httpAuth } from '@/api/http/httpAuth'
import type { CreatePatient, User } from '@/types/types'

const regEndpoint = '/users'

export async function createUser({
  user,
}: {
  user: CreatePatient
}): Promise<User> {
  return await httpAuth<User>(`${regEndpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
}

export async function deleteUser({ id }: { id: number }): Promise<boolean> {
  return httpAuth<{ success: boolean }>(`${regEndpoint}/${id}`, {
    method: 'DELETE',
  }).then(res => res.success)
}
