'use server'

import { StateType } from '@/app/config/site.config'
import { TeamDAL } from '../data/team/team.dal'
import { TeamDTO } from '@/app/data/team/team.dto'
import { revalidatePath } from 'next/cache'

export async function createTeamAction(_prevState: StateType, formData: FormData): Promise<StateType<TeamDTO>> {
  const dal = await TeamDAL.create()
  if (!dal) return {
    status: 'error',
    message: 'Сессия недействительна!'
  }

  return await dal.createTeam({ name: formData.get('name') })
}

export async function updateTeamAction(teamId: string, _prevState: StateType, formData: FormData): Promise<StateType<TeamDTO>> {
  const dal = await TeamDAL.create()
  if (!dal) return {
    status: 'error',
    message: 'Сессия недействительна!'
  }

  return await dal.updateTeam(teamId, { name: formData.get('name') })
}

export async function deleteTeamAction(teamId: string, _prevState: StateType): Promise<StateType<TeamDTO>> {
  const dal = await TeamDAL.create()
  if (!dal) return {
    status: 'error',
    message: 'Сессия недействительна!'
  }

  return await dal.deleteTeam(teamId)
}

export async function answerInviteAction(_prevState: StateType, formData: FormData): Promise<StateType<TeamDTO>> {
  const dal = await TeamDAL.create()
  if (!dal) return {
    status: 'error',
    message: 'Сессия недействительна!'
  }

  const result = await dal.giveAnswerToInvite({
    teamId: formData.get('teamId'),
    answer: formData.get('answer'),
  })

  if (result.status === 'success') revalidatePath(`/teams`)
  return result
}

export async function inviteAction(teamId: string, _prevState: StateType, formData: FormData): Promise<StateType> {
  const dal = await TeamDAL.create()
  if (!dal) return {
    status: 'error',
    message: 'Сессия недействительна!'
  }

  const result = await dal.addUserToTeam(teamId, {
    username: formData.get('username'),
  })

  if (result.status === 'success') revalidatePath(`/teams/${teamId}`)

  return result
}

export async function kickFromTeamAction(teamId: string, userId: string, _prevState: StateType): Promise<StateType> {
  const dal = await TeamDAL.create()
  if (!dal) return {
    status: 'error',
    message: 'Сессия недействительна!'
  }

  const result = await dal.kickUserFromTeam(teamId, userId)

  if (result.status === 'success') revalidatePath(`/teams/${teamId}`)

  return result
}