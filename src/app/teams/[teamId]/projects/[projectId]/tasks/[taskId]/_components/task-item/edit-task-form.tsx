'use client'

import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

import {
  Dialog, DialogClose,
  DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDateForInput } from '@/app/data/utils/format-date'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { TaskWithDependenciesDTO } from '@/app/data/task/task.dto'
import { updateTaskAction } from '@/app/actions/tasks'
import { Textarea } from '@/components/ui/textarea'

type EditTaskFormProps = {
  task: TaskWithDependenciesDTO
  availableTasks: Array<{ id: string; title: string }>
}

export default function EditTaskForm({
                                       task,
                                       availableTasks
                                     }: EditTaskFormProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(task.deadline)

  const [state, action, pending] = useActionState(updateTaskAction.bind(null, task.id), {})

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
        <DialogTrigger>{pending ? 'Обновление...' : 'Перейти к редактированию'}</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать задачу</DialogTitle>
        </DialogHeader>
        <form
          action={action}
          className="flex items-center bg-card p-2 rounded-lg"
        >
          <FieldGroup>
            <Field className="flex flex-col gap-2">
              <FieldLabel htmlFor="checkout-task-title">Название задачи</FieldLabel>
              <Input
                type="text"
                name="title"
                placeholder="Введите название задачи"
                id="checkout-task-title"
                defaultValue={task.title}
                required
              />
            </Field>

            <Field className="flex flex-col gap-2">
              <FieldLabel htmlFor="checkout-task-description">Описание</FieldLabel>
              <Textarea
                name="description"
                placeholder="Что-то важное..."
                id="checkout-task-description"
                rows={4}
                defaultValue={task.description}
              />
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="checkout-task-deadline">Срок сдачи</Label>
              <input
                type="hidden"
                name="deadline"
                value={formatDateForInput(date)}
              />
              <Popover
                open={open}
                onOpenChange={setOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="checkout-task-deadline"
                    type="button"
                    className="justify-between"
                  >
                    {date ? date.toLocaleDateString() : 'Выбрать дату'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      setDate(selectedDate)
                      setOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="dependsOn">Зависит от</Label>
              <select
                id="dependsOn"
                name="dependsOn"
                multiple
                className="w-full border rounded-md p-2"
                defaultValue={task.dependsOn.map(t => t.id)}
              >
                {availableTasks.map(task => (
                  <option
                    key={task.id}
                    value={task.id}
                  >
                    {task.title}
                  </option>
                ))}
              </select>
              <small className="text-gray-500">Удерживайте Ctrl для выбора нескольких задач</small>
            </Field>
            <DialogFooter className="flex gap-2">
              <DialogClose asChild>
                <Button type="submit">{pending ? 'Обновление...' : 'Обновить'}</Button>
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
