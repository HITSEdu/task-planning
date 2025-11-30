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
import { updateProjectAction } from '@/app/actions/projects'
import {
  ProjectWithTeamDTO
} from '@/app/data/project/project.dto'
import { useRouter } from 'next/navigation'

type EditProjectFormProps = {
  project: ProjectWithTeamDTO
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(project.deadline)

  const [state, action, pending] = useActionState(updateProjectAction.bind(null, project.id), {})

  useEffect(() => {
    if (!pending) {
      if (state.status === 'error') {
        toast.error(state.message)
      } else if (state.status === 'success') {
        toast.success(state.message)
      }
    }
  }, [state.status, pending])

  if (project.team.role !== 'OWNER') return null

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
          <DialogTitle>Редактировать проект</DialogTitle>
        </DialogHeader>
        <form
          action={action}
          className="flex items-center bg-card p-2 rounded-lg"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="checkout-project-title">
                Название проекта
              </FieldLabel>
              <Input
                defaultValue={project.title}
                type="text"
                name="title"
                placeholder="Название"
                id="checkout-project-title"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-project-description">
                Описание проекта
              </FieldLabel>
              <Input
                defaultValue={project.description}
                type="text"
                name="description"
                placeholder="Описание"
                id="checkout-project-description"
              />
            </Field>
            <Field>
              <Label
                htmlFor="checkout-project-deadline"
                className="px-1"
              >
                Срок сдачи
              </Label>
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
                    id="checkout-project-deadline"
                    className="w-48 justify-between font-normal"
                    type="button"
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
