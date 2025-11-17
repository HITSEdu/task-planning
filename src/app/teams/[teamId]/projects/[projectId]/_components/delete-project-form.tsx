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
import { ProjectWithTeamDTO } from '@/app/data/project/project.dto'
import { deleteProjectAction } from '@/app/actions/projects'

type DeleteProjectFormProps = {
  project: ProjectWithTeamDTO
}

export default function DeleteProjectForm({ project }: DeleteProjectFormProps) {
  const [state, action, pending] = useActionState(deleteProjectAction.bind(null, project.id), {})

  useEffect(() => {
    if (!pending) {
      if (state.status === 'error') {
        toast.error(state.message)
      } else if (state.status === 'success') {
        toast.success(state.message)
        redirect(`/teams/${project.teamId}/projects`)
      }
    }
  }, [state.status, pending])

  if (project.team.role !== 'OWNER') return null

  return (
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
  )
}
