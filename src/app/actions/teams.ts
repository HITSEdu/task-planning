'use server'

import { StateType } from '@/app/config/site.config'
import { TeamDAL } from '../data/team/team.dal'
import { TeamDTO } from '@/app/data/team/team.dto'

export async function createTeamAction(_prevState: StateType, formData: FormData): Promise<StateType<TeamDTO>> {
  const dal = await TeamDAL.create()
  if (!dal) return {
    status: 'error',
    message: 'Сессия недействительна!'
  }

  return await dal.createTeam({ name: formData.get('name') })
}

export async function answerInviteAction(_prevState: StateType, formData: FormData): Promise<StateType<TeamDTO>> {
  const dal = await TeamDAL.create()
  if (!dal) return {
    status: 'error',
    message: 'Сессия недействительна!'
  }

  return await dal.giveAnswerToInvite({
    teamId: formData.get('teamId'),
    answer: formData.get('answer'),
  })
}