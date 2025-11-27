'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  FieldGroup,
  FieldLegend,
} from '@/components/ui/field'
import { answerInviteAction } from '@/app/actions/teams'

type CreateTeamFormProps = {
  teamId: string
  teamName: string
}

export default function GiveAnswerForm({ teamId, teamName }: CreateTeamFormProps) {
  const [state, action, pending] = useActionState(answerInviteAction, {})

  useEffect(() => {
    if (!pending && state.status) {
      if (state.status === 'error') toast.error(state.message)
      if (state.status === 'success') toast.success(state.message)
    }
  }, [state.status, pending])

  return (
    <form
      action={action}
      className="flex gap-3 items-center bg-card p-3 rounded-lg"
    >
      <input
        type="hidden"
        name="teamId"
        value={teamId}
      />
      <FieldGroup>
        <FieldLegend
          variant="label"
        >{teamName}</FieldLegend>
        <div className="flex gap-4">
          <Button
            type="submit"
            name="answer"
            value="accept"
            size="sm"
            disabled={pending}
          >
            {pending ? 'Отправка...' : 'Принять'}
          </Button>
          <Button
            type="submit"
            name="answer"
            value="reject"
            variant="destructive"
            size="sm"
            disabled={pending}
          >
            {pending ? 'Отправка...' : 'Отклонить'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
