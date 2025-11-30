import 'server-only'
import { requireUser } from '@/app/data/user/require-user'
import {
  TeamAnswerSchema,
  TeamCreateInputSchema,
  TeamDTO, TeamWithRoleDTO,
} from './team.dto'
import {
  canCreateTeam,
  isOwner
} from './team.policy'
import prisma from '@/lib/prisma'
import {
  AddUserToTeamSchema, UserDTO, UserWithTeamDTO
} from '@/app/data/user/user.dto'
import { createError } from '@/lib/utils'
import { StateType } from '@/app/config/site.config'
import { teamMapper } from '@/app/data/utils/team-mapper'

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

  static async getTeamOwner(teamId: string) {
    return prisma.userTeam.findFirst({
      where: { teamId, role: 'OWNER' },
    })
  }

  getUser() {
    return this.user
  }

  static async getUserRoleInTeam(teamId: string, userId: string) {
    return prisma.userTeam.findFirst({
      where: { teamId, userId },
    })
  }

  static async isUserInTeam(teamId: string, userId: string) {
    const userTeam = await TeamDAL.getUserRoleInTeam(teamId, userId)
    return (userTeam !== null && userTeam.role !== 'PENDING')
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

  async updateTeam(teamId: string, input: unknown): Promise<StateType<TeamDTO>> {
    const parsed = TeamCreateInputSchema.safeParse(input)
    if (!parsed.success) return {
      status: 'error',
      message: createError(parsed.error.issues)
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId }
    })

    if (!team) return { status: 'error', message: 'Команда не найдена' }

    const teamOwner = await TeamDAL.getTeamOwner(teamId)
    if (!isOwner(this.user, { ownerId: teamOwner?.userId })) {
      return {
        status: 'error',
        message: 'Невозможно редактировать команду!'
      }
    }

    const updated = await prisma.team.update({
      where: { id: teamId },
      data: {
        name: parsed.data.name,
      },
    })

    return {
      status: 'success',
      message: 'Команда обновлена',
      data: updated as TeamDTO,
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

    const activeTeams = teamMapper(userTeams
      .filter((ut) => ut.role !== 'PENDING'))

    const pendingInvites = teamMapper(userTeams
      .filter((ut) => ut.role === 'PENDING'))

    return {
      teams: activeTeams as TeamWithRoleDTO[],
      invites: pendingInvites as TeamWithRoleDTO[],
    }
  }

  async getUserTeam(teamId: string) {
    const allTeams = await this.getUserTeams()
    return allTeams.teams.find((t) => t.id === teamId) ?? null
  }

  async getUsersInTeam(teamId: string) {
    const inTeam = await TeamDAL.isUserInTeam(teamId, this.user.id)
    if (!inTeam) return []

    const userTeams = await prisma.userTeam.findMany({
      where: {
        teamId: teamId,
      },
      include: {
        user: true,
      }
    })

    return userTeams.map(ut => ({
      id: ut.user.id,
      email: ut.user.email,
      username: ut.user.username,
      createdAt: ut.createdAt,
      teamId: ut.teamId,
      role: ut.role,
    })) as UserWithTeamDTO[]
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

    const mates = await prisma.userTeam.findMany({
      where: { teamId },
      include: { user: true }
    })

    if (mates.map(m => m.user.username).includes(parsed.data.username)) {
      return {
        status: 'error',
        message: 'Пользователь уже состоит в команде или ожидает подтверждения!'
      }
    }

    const teamOwner = await TeamDAL.getTeamOwner(teamId)

    if (!isOwner(this.user, { ownerId: teamOwner?.userId })) {
      return {
        status: 'error',
        message: 'Невозможно добавить в команду!'
      }
    }

    const member = await prisma.user.findUnique({
      where: { username: parsed.data.username.toLowerCase() },
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
    const teamOwner = await TeamDAL.getTeamOwner(teamId)

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

  async kickUserFromTeam(teamId: string, userId: string): Promise<StateType> {
    const teamOwner = await TeamDAL.getTeamOwner(teamId)
    const isOwnerUser = isOwner(this.user, { ownerId: teamOwner?.userId })
    const isSelf = this.user.id === userId

    if (userId === teamOwner?.userId) {
      return {
        status: 'error',
        message: 'Лидер команды может только удалить команду!'
      }
    }

    if (!isSelf && !isOwnerUser) {
      return {
        status: 'error',
        message: 'Нет прав!'
      }
    }

    const membership = await prisma.userTeam.findUnique({
      where: {
        teamId_userId: { teamId, userId },
      },
    })

    if (!membership) return {
      status: 'error',
      message: 'Участник не в команде!'
    }

    await prisma.userTeam.delete({
      where: { teamId_userId: { teamId, userId } },
    })

    return {
      status: 'success',
      message: isSelf ? 'Вы покинули команду!' : 'Пользователь удалён!'
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
          data: { role: 'MEMBER', createdAt: new Date() },
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
