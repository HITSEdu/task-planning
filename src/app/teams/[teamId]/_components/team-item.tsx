'use client'

import { useActionState, useEffect } from 'react'
import { deleteTeamAction } from '@/app/actions/teams'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import { TeamDTO } from '@/app/data/team/team.dto'
import {
  Field,
  FieldGroup,
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'

type TeamItemProps = {
  team: TeamDTO
}

export default function TeamItem({ team }: TeamItemProps) {
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{team.name}</h1>
      <p className="text-gray-500 mt-2">ID: {team.id}</p>
      <form
        action={action}
        className="flex w-full max-w-sm items-center bg-card p-2 rounded-lg"
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
    </div>
  )
}