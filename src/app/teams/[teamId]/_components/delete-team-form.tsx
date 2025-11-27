'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldGroup,
} from '@/components/ui/field'
import { redirect } from 'next/navigation'
import { deleteTeamAction } from '@/app/actions/teams'
import { TeamWithRoleDTO } from '@/app/data/team/team.dto'

type DeleteTeamFormProps = {
  team: TeamWithRoleDTO
}

export default function DeleteTeamForm({ team }: DeleteTeamFormProps) {
  const [state, action, pending] = useActionState(deleteTeamAction.bind(null, team.id), {})

  useEffect(() => {
    if (!pending) {
      if (state.status === 'error') {
        toast.error(state.message)
      } else if (state.status === 'success') {
        toast.success(state.message)
        redirect(`/teams/`)
      }
    }
  }, [state.status, pending])

  if (team.role !== 'OWNER') return null

  return (
    <form
      action={action}
      className="flex w-full max-w-sm items-center bg-card rounded-lg"
    >
      <FieldGroup>
        <Field orientation="horizontal">
          <Button
            type="submit"
            variant="destructive"
          > {pending ? 'Удаление...' : 'Удалить'}</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
