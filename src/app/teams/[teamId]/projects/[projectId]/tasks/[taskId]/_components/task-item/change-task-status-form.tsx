'use client'

import { TaskWithDependenciesDTO } from '@/app/data/task/task.dto'
import { useActionState, useEffect, useState } from 'react'
import { changeTaskStatusAction } from '@/app/actions/tasks'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogClose,
  DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

type ChangeTaskStatusFormProps = {
  task: TaskWithDependenciesDTO
}

const statusesArray = ['CREATED', 'IN_PROGRESS', 'COMPLETED'] as const
type Statuses = typeof statusesArray[number]

const labels: Record<Statuses, string> = {
  CREATED: 'Создана',
  IN_PROGRESS: 'В прогрессе',
  COMPLETED: 'Завершена',
}

export default function ChangeTaskStatusForm({ task }: ChangeTaskStatusFormProps) {
  const [selectedStatus, setSelectedStatus] = useState<Statuses>(task.status as Statuses)
  const [state, action, pending] = useActionState(changeTaskStatusAction, {})

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{pending ? 'Изменение...' : 'Изменить статус'}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Изменить статус задачи</DialogTitle>
        </DialogHeader>

        <form
          action={action}
          className="flex flex-col gap-4 mt-4"
        >
          <input
            type="hidden"
            name="taskId"
            value={task.id}
          />

          <div className="flex flex-col gap-2">
            <span className="font-medium">Выберите статус:</span>
            <div className="flex gap-2 flex-wrap">
              {statusesArray.map(status => (
                <Button
                  key={status}
                  type="button"
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  className={'px-4 py-2'}
                  onClick={() => setSelectedStatus(status)}
                >
                  {labels[status]}
                </Button>
              ))}
            </div>
            <input
              type="hidden"
              name="status"
              value={selectedStatus}
            />
          </div>

          <DialogFooter className="flex gap-2 mt-4">
            <DialogClose asChild>
              <Button
                type="submit"
                className="flex-1"
              >{pending ? 'Сохранение...' : 'Сохранить'}</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1"
              >Отмена</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}