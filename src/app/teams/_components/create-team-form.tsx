'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldGroup, FieldLabel,
  FieldLegend,
  FieldSet
} from '@/components/ui/field'
import { redirect } from 'next/navigation'
import { createTeamAction } from '@/app/actions/teams'

export default function CreateTeamForm() {
  const [state, action, pending] = useActionState(createTeamAction, {})

  useEffect(() => {
    if (!pending) {
      if (state.status === 'error') {
        toast.error(state.message)
      } else if (state.status === 'success') {
        toast.success(state.message)

        const teamId = state.data?.id
        if (teamId) redirect(`/teams/${teamId}`)
      }
    }
  }, [state.status, pending])

  return (
    <form
      action={action}
      className="flex w-full max-w-sm items-center bg-card p-2 rounded-lg"
    >
      <FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="checkout-team-name">
              Название команды
            </FieldLabel>
            <Input
              type="text"
              name="name"
              placeholder="Название"
              id="checkout-team-name"
              required
            />
          </Field>
        </FieldGroup>
        <Field orientation="horizontal">
          <Button type="submit"> {pending ? 'Создание...' : 'Создать'}</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
