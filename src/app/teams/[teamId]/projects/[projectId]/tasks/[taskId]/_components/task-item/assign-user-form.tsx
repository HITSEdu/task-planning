'use client'

import { TaskWithDependenciesDTO } from '@/app/data/task/task.dto'
import { useActionState, useEffect } from 'react'
import { assignUserAction } from '@/app/actions/tasks'
import { toast } from 'sonner'
import {
  Field,
  FieldGroup,
} from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogClose,
  DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

type AssignUserFormProps = {
  task: TaskWithDependenciesDTO
  availableUsers: Array<{ id: string; username: string }>
}

export default function AssignUserForm({
                                         task,
                                         availableUsers
                                       }: AssignUserFormProps) {
  const [state, action, pending] = useActionState(assignUserAction.bind(null, task.id), {})

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
      <Button
        asChild
        variant="outline"
      >
        <DialogTrigger>{pending ? 'Назначение...' : 'Перейти к назначению пользователей'}</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Назначить пользователей</DialogTitle>
        </DialogHeader>
        <form
          action={action}
          className="flex items-center bg-card p-2 rounded-lg"
        >
          <FieldGroup>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="users">Пользователи</Label>
              <select
                id="users"
                name="usersId"
                multiple
                className="w-full border rounded-md p-2"
              >
                {availableUsers.map(u => (
                  <option
                    key={u.id}
                    value={u.id}
                  >
                    {u.username}
                  </option>
                ))}
              </select>
              <small className="text-gray-500">Удерживайте Ctrl для выбора нескольких пользователей</small>
            </Field>
            <DialogFooter className="flex gap-2">
              <DialogClose asChild>
                <Button type="submit">{pending ? 'Назначение...' : 'Назначить'}</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="outline">Назад</Button>
              </DialogClose>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}