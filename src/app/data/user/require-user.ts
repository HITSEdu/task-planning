import 'server-only'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { UserDTO } from '@/app/data/user/user.dto'
import { cache } from 'react'

export const requireUser = cache(async (): Promise<UserDTO> => {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
})

export const getCurrentUser = cache(async (): Promise<UserDTO | null> => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return null

    return {
      id: session.user.id,
      email: session.user.email,
      username: session.user.username ?? '',
      createdAt: session.user.createdAt,
    }
  }
)
