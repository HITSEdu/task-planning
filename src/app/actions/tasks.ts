'use server'

import { StateType } from '@/app/config/site.config'
import { TaskDAL } from '@/app/data/task/task.dal'
import { TaskWithStatusDTO } from '@/app/data/task/task.dto'
import { revalidatePath } from 'next/cache'

export async function createTaskAction(projectId: string, _prev: StateType, formData: FormData): Promise<StateType<TaskWithStatusDTO>> {
  const dal = await TaskDAL.create()
  if (!dal) return { status: 'error', message: 'Сессия недействительна!' }

  return await dal.createTask(
    projectId,
    {
      title: formData.get('title'),
      description: formData.get('description'),
      deadline: formData.get('deadline') ? new Date(formData.get('deadline') as string) : undefined,
      dependsOn: formData.getAll('dependsOn')
    }
  )
}

export async function assignUserAction(taskId: string, userId: string, _prev: StateType): Promise<StateType> {
  const dal = await TaskDAL.create()
  if (!dal) return { status: 'error', message: 'Сессия недействительна!' }

  return await dal.assignUser(taskId, userId)
}

export async function selfAssignAction(taskId: string, _prev: StateType): Promise<StateType> {
  const dal = await TaskDAL.create()
  if (!dal) return { status: 'error', message: 'Сессия недействительна!' }

  const result = await dal.selfAssign(taskId)
  if (result.status === 'success') revalidatePath('/teams/[teamId]/projects/[projectId]/tasks/[taskId]', 'page')

  return result
}

export async function updateTaskAction(taskId: string, _prev: StateType, formData: FormData): Promise<StateType> {
  const dal = await TaskDAL.create()
  if (!dal) return { status: 'error', message: 'Сессия недействительна!' }

  return await dal.updateTask(
    taskId,
    {
      title: formData.get('title'),
      description: formData.get('description') ?? undefined,
      deadline: formData.get('deadline') ? new Date(formData.get('deadline') as string) : undefined,
      dependsOn: formData.get('dependsOn')
    }
  )
}

export async function changeTaskStatusAction(_prev: StateType, formData: FormData): Promise<StateType> {
  const dal = await TaskDAL.create()
  if (!dal) return { status: 'error', message: 'Сессия недействительна!' }

  return await dal.changeStatus({
    TaskId: formData.get('taskId') as string,
    answer: formData.get('status') as string,
  })
}

export async function deleteTaskAction(taskId: string, _prev: StateType): Promise<StateType> {
  const dal = await TaskDAL.create()
  if (!dal) return { status: 'error', message: 'Сессия недействительна!' }

  return await dal.deleteTask(taskId)
}