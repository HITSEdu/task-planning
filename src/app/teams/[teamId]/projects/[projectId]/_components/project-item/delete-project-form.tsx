'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { ProjectWithTeamDTO } from '@/app/data/project/project.dto'
import { deleteProjectAction } from '@/app/actions/projects'
import {
  Dialog, DialogClose,
  DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

type DeleteProjectFormProps = {
  project: ProjectWithTeamDTO;
};

export default function DeleteProjectForm({ project, }: DeleteProjectFormProps) {
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
    <Dialog>
      <Button
        asChild
        variant="destructive"
      >
        <DialogTrigger>{pending ? 'Удаление...' : 'Перейти к удалению'}</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить проект</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <form
            action={action}
            className="flex items-center bg-card rounded-lg"
          >
            <DialogClose asChild>
              <Button
                type="submit"
                variant="destructive"
              >{pending ? 'Удаление...' : 'Удалить'}</Button>
            </DialogClose>
          </form>
          <DialogClose asChild>
            <Button variant="outline">Назад</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
