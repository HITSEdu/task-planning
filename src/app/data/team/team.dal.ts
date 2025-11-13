import 'server-only'
import { requireUser } from '@/app/data/user/require-user'
import {
  TeamAnswerSchema,
  TeamCreateInputSchema,
  TeamDTO,
} from './team.dto'
import {
  canCreateTeam,
  isOwner
} from './team.policy'
import prisma from '@/lib/prisma'
import {
  AddUserToTeamSchema, UserDTO
} from '@/app/data/user/user.dto'
import { createError } from '@/lib/utils'
import { StateType } from '@/app/config/site.config'
import { cacheTag } from 'next/cache'

export class TeamDAL {
  private constructor(private readonly user: UserDTO) {
  }

  static async create() {
    try {
      const user = await requireUser()
      return new TeamDAL(user)
    } catch (error) {
      return null
    }
  }

  async createTeam(input: unknown): Promise<StateType<TeamDTO>> {
    const parsed = TeamCreateInputSchema.safeParse(input)
    if (!parsed.success) {
      return {
        status: 'error',
        message: createError(parsed.error.issues)
      }
    }

    if (!canCreateTeam(this.user)) return {
      status: 'error',
      message: 'Невозможно создать команду!'
    }

    const team = await prisma.team.create({
      data: {
        name: parsed.data.name,
        userTeams: {
          create: {
            userId: this.user.id,
            role: 'OWNER',
          },
        },
      },
      include: {
        userTeams: true,
      },
    })

    return {
      status: 'success',
      message: 'Команда успешно создана!',
      data: team
    }
  }

  async getUserTeams() {
    const userTeams = await prisma.userTeam.findMany({
      where: { userId: this.user.id },
      include: {
        team: true,
      },
      orderBy: { team: { createdAt: 'desc' } },
    })

    const activeTeams: TeamDTO[] = userTeams
      .filter((ut) => ut.role !== 'PENDING')
      .map((ut) => ut.team)

    const pendingInvites: TeamDTO[] = userTeams
      .filter((ut) => ut.role === 'PENDING')
      .map((ut) => ut.team)

    return {
      teams: activeTeams,
      invites: pendingInvites,
    }
  }

  async getUserTeam(teamId: string) {
    const allTeams = await this.getUserTeams()
    return allTeams.teams.find((t) => t.id === teamId) ?? null
  }

  async addUserToTeam(teamId: string, input: unknown): Promise<StateType<TeamDTO>> {
    const parsed = AddUserToTeamSchema.safeParse(input)
    if (!parsed.success) return {
      status: 'error',
      message: createError(parsed.error.issues)
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { userTeams: true },
    })
    if (!team) return {
      status: 'error',
      message: 'Команда не найдена!'
    }

    const teamOwner = await prisma.userTeam.findFirst({
      where: { teamId, userId: this.user.id, role: 'OWNER' },
    })

    if (!isOwner(this.user, { ownerId: teamOwner?.userId })) {
      return {
        status: 'error',
        message: 'Невозможно добавить в команду!'
      }
    }

    const member = await prisma.user.findUnique({
      where: { username: parsed.data.username },
    })

    if (!member) return {
      status: 'error',
      message: 'Пользователь не найден!'
    }

    await prisma.userTeam.create({
      data: {
        userId: member.id,
        teamId,
      },
    })

    return {
      status: 'success',
      message: `Пользователь ${member.username} добавлен в команду (ожидает подтверждения)`
    }
  }

  async deleteTeam(teamId: string): Promise<StateType<TeamDTO>> {
    const teamOwner = await prisma.userTeam.findFirst({
      where: { teamId, userId: this.user.id, role: 'OWNER' },
    })

    if (!isOwner(this.user, { ownerId: teamOwner?.userId })) {
      return {
        status: 'error',
        message: 'Нет прав!'
      }
    }

    await prisma.team.delete({ where: { id: teamId } })

    return {
      status: 'success',
      message: 'Команда удалена'
    }
  }

  async giveAnswerToInvite(input: unknown): Promise<StateType<TeamDTO>> {
    const parsed = TeamAnswerSchema.safeParse(input)
    if (!parsed.success) return {
      status: 'error',
      message: createError(parsed.error.issues)
    }

    const teamId = parsed.data.teamId
    const type = parsed.data.answer

    const membership = await prisma.userTeam.findUnique({
      where: {
        teamId_userId: { teamId, userId: this.user.id },
      },
    })

    if (!membership) return {
      status: 'error',
      message: 'Приглашение не найдено'
    }
    if (membership.role !== 'PENDING') return {
      status: 'error',
      message: 'Вы уже состоите в этой команде'
    }

    switch (type) {
      case 'accept': {
        await prisma.userTeam.update({
          where: { teamId_userId: { teamId, userId: this.user.id } },
          data: { role: 'MEMBER' },
        })

        return {
          status: 'success',
          message: 'Приглашение принято'
        }
      }

      case 'reject': {
        await prisma.userTeam.delete({
          where: { teamId_userId: { teamId, userId: this.user.id } },
        })

        return {
          status: 'success',
          message: 'Приглашение отклонено'
        }
      }
    }
  }
}
