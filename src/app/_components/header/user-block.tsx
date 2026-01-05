'use client'

import { Button } from '@/components/ui/button'
import { UserDTO } from '@/app/data/user/user.dto'
import { useActionState, useEffect } from 'react'
import { signOutAction } from '@/app/actions/user'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'

type UserBlockProps = {
  user: UserDTO;
};

export default function UserBlock({ user }: UserBlockProps) {
  const [state, action, pending] = useActionState(signOutAction, {})

  useEffect(() => {
    if (!pending) {
      if (state.status === 'error') {
        toast.error(state.message)
      } else if (state.status === 'success') {
        toast.success(state.message)
        redirect('/sign-in')
      }
    }
  }, [state, pending])

  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="hidden md:block text-md font-semibold">
        Здравствуйте, {user.username}!
      </h2>
      <form action={action}>
        <Button
          type="submit"
          variant="destructive"
          disabled={pending}
        >
          {pending ? 'Выход...' : 'Выйти'}
        </Button>
      </form>
    </div>
  )
}
