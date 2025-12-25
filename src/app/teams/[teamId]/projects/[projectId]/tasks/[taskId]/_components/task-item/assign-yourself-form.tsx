'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogClose,
  DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { selfAssignAction } from '@/app/actions/tasks'
import { TaskWithDependenciesDTO } from '@/app/data/task/task.dto'

type AssignYourselfFormProps = {
  task: TaskWithDependenciesDTO;
};

export default function AssignYourselfForm({ task }: AssignYourselfFormProps) {
  const [state, action, pending] = useActionState(selfAssignAction.bind(null, task.id), {})

  useEffect(() => {
    if (!pending) {
      if (state.status === 'error') {
        toast.error(state.message)
      } else if (state.status === 'success') {
        toast.success(state.message)
      }
    }
  }, [state, pending])

  return (
    <Dialog>
      <Button
        asChild
      >
        <DialogTrigger>{pending ? 'Назначение...' : 'Взять задачу'}</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Назначение</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <form
            action={action}
            className="flex items-center bg-card rounded-lg"
          >
            <DialogClose asChild>
              <Button
                type="submit"
                variant="secondary"
              >{pending ? 'Назначение...' : 'Назначиться'}</Button>
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
