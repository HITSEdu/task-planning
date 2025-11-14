'use server'

import { StateType } from '@/app/config/site.config'
import { TaskDAL } from '@/app/data/task/task.dal'

export async function createTaskAction(projectId: string, _prev: StateType, formData: FormData) {
  const dal = await TaskDAL.create()
  if (!dal) return { status: 'error', message: 'Сессия недействительна!' }

  return await dal.createTask(
    projectId,
    {
      title: formData.get('title'),
      description: formData.get('description'),
      deadline: formData.get('deadline') ? new Date(formData.get('deadline') as string) : undefined,
    }
  )
}