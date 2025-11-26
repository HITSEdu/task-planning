'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { TaskWithStatusDTO } from '@/app/data/task/task.dto'
import { deleteTaskAction } from '@/app/actions/tasks'
import { UserRole } from '@/generated/prisma/enums'

type DeleteTaskFormProps = {
  task: TaskWithStatusDTO
  role: UserRole
}

export default function DeleteTaskForm({ task, role }: DeleteTaskFormProps) {
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

  if (role !== 'OWNER') return null

  return (
    <form
      action={action}
    >
      <Button
        type="submit"
        variant="destructive"
      > {pending ? 'Удаление...' : 'Удалить'}</Button>
    </form>
  )
}
