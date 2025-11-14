'use server'

import { StateType } from '@/app/config/site.config'
import { ProjectDAL } from '@/app/data/project/project.dal'

export async function createProjectAction(teamId: string, _prev: StateType, formData: FormData) {
  const dal = await ProjectDAL.create()
  if (!dal) return { status: 'error', message: 'Сессия недействительна!' }

  return await dal.createProject(
    teamId,
    {
      title: formData.get('title'),
      description: formData.get('description'),
      deadline: formData.get('deadline') ? new Date(formData.get('deadline') as string) : undefined,
    }
  )
}

export async function updateProjectAction(projectId: string, _prev: StateType, formData: FormData) {
  const dal = await ProjectDAL.create()
  if (!dal) return { status: 'error', message: 'Сессия недействительна!' }

  return await dal.updateProject(
    projectId,
    {
      title: formData.get('title') ?? undefined,
      description: formData.get('description') ?? undefined,
      deadline: formData.get('deadline') ? new Date(formData.get('deadline') as string) : undefined,
    }
  )
}

export async function deleteProjectAction(projectId: string, _prev: StateType) {
  const dal = await ProjectDAL.create()
  if (!dal) return { status: 'error', message: 'Сессия недействительна!' }

  return await dal.deleteProject(projectId)
}

export async function changeProjectStatusAction(_prev: StateType, formData: FormData) {
  const dal = await ProjectDAL.create()
  if (!dal) return { status: 'error', message: 'Сессия недействительна!' }

  return await dal.changeStatus({
    ProjectId: formData.get('projectId'),
    answer: formData.get('status'),
  })
}

