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
}

export default function GiveAnswerForm({ teamId }: CreateTeamFormProps) {
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
        <FieldLegend>Приглашение в команду</FieldLegend>
        <div className="flex gap-2">
          <Button
            type="submit"
            name="answer"
            value="accept"
            disabled={pending}
          >
            {pending ? 'Отправка...' : 'Принять'}
          </Button>
          <Button
            type="submit"
            name="answer"
            value="reject"
            variant="destructive"
            disabled={pending}
          >
            {pending ? 'Отправка...' : 'Отклонить'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
