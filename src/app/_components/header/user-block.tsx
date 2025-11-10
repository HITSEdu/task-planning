'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export default function UserBlock() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending)
    return null

  const user = session?.user

  return (
    user &&
    <div className="flex items-center justify-between gap-4">
      <h2 className="hidden md:block text-md font-semibold">Здравствуйте, {user.name}!</h2>
      <Button
        variant="destructive"
        onClick={() => authClient.signOut()}
      >
        Выйти
      </Button>
    </div>
  )
}