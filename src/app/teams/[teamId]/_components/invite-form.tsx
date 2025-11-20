'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldGroup, FieldLabel, FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { inviteAction } from '@/app/actions/teams'

type InviteFormProps = {
  teamId: string
}

export default function InviteForm({ teamId }: InviteFormProps) {
  const [state, action, pending] = useActionState(inviteAction.bind(null, teamId), {})

  useEffect(() => {
    if (!pending) {
      if (state.status === 'error') {
        toast.error(state.message)
      } else if (state.status === 'success') {
        toast.success(state.message)
      }
    }
  }, [state.status, pending])

  return (
    <form
      action={action}
      className="flex w-full max-w-sm items-center bg-card p-2 rounded-lg"
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Пригласить в команду</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="checkout-username">
                Имя пользователя
              </FieldLabel>
              <Input
                type="text"
                name="username"
                placeholder="user_new"
                id="checkout-username"
                required
              />
            </Field>
          </FieldGroup>
          <Field orientation="horizontal">
            <Button type="submit"> {pending ? 'Приглашение...' : 'Пригласить'}</Button>
          </Field>
        </FieldSet>
      </FieldGroup>
    </form>
  )
}
