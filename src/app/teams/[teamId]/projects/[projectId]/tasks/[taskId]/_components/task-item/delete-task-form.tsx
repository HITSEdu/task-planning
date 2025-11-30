'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import {
  Dialog, DialogClose,
  DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { deleteTaskAction } from '@/app/actions/tasks'
import { TaskWithDependenciesDTO } from '@/app/data/task/task.dto'

type DeleteTaskFormProps = {
  task: TaskWithDependenciesDTO;
};

export default function DeleteTaskForm({ task }: DeleteTaskFormProps) {
  const [state, action, pending] = useActionState(deleteTaskAction.bind(null, task.id), {})

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!pending) {
      if (state.status === 'error') {
        toast.error(state.message)
      } else if (state.status === 'success') {
        toast.success(state.message)

        const segments = pathname.split('/').filter(Boolean)
        segments.pop()

        const parentPath = '/' + segments.join('/')
        router.push(parentPath)
      }
    }
  }, [state.status, pending])

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
          <DialogTitle>Удалить задачу</DialogTitle>
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
