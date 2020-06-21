import jwt from 'jsonwebtoken'

import { useCookie } from '@/cookie'

export function useAuth(): AuthPayload {
  const cookies = useCookie()
  try {
    const { id_token } = JSON.parse(cookies['auth-token'])
    const { username } = jwt.decode(id_token) as { username: string }
    return { username }
  } catch {
    return null
  }
}

export type AuthPayload = {
  username: string
} | null
