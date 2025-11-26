import 'server-only'
import { requireUser } from '@/app/data/user/require-user'
import { UserDTO } from '@/app/data/user/user.dto'
import { StateType } from '@/app/config/site.config'
import {
  TaskChangeStatusSchema,
  TaskCreateInputSchema,
  TaskUpdateInputSchema, TaskWithDependenciesDTO, TaskWithStatusDTO
} from '@/app/data/task/task.dto'
import { createError } from '@/lib/utils'
import prisma from '@/lib/prisma'
import { ProjectDAL } from '../project/project.dal'
import { TeamDAL } from '@/app/data/team/team.dal'
import { isOwner } from '@/app/data/team/team.policy'

export class TaskDAL {
  private constructor(private readonly user: UserDTO) {
  }

  static async create() {
    try {
      const user = await requireUser()
      return new TaskDAL(user)
    } catch (error) {
      return null
    }
  }

  static async getAssignedTask(taskId: string, userId: string) {
    return prisma.assignedTask.findFirst({
      where: { taskId, userId },
    })
  }

  async createTask(projectId: string, input: unknown): Promise<StateType<TaskWithStatusDTO>> {
    const parsed = TaskCreateInputSchema.safeParse(input)
    if (!parsed.success) {
      return {
        status: 'error',
        message: createError(parsed.error.issues)
      }
    }

    const dal = await ProjectDAL.create()
    const project = await dal?.getProject(projectId)
    if (!project) return { status: 'error', message: 'Проект не найден' }

    const owner = await TeamDAL.getTeamOwner(project.teamId)
    if (!isOwner(this.user, { ownerId: owner?.userId })) {
      return { status: 'error', message: 'Нет прав на создание задачи!' }
    }

    const { dependsOn, ...data } = parsed.data

    const deps = await prisma.task.findMany({
      where: { id: { in: dependsOn } },
    })

    if (deps.some(d => d.projectId !== projectId)) {
      return {
        status: 'error',
        message: 'Зависимые задачи принадлежат другому проекту!'
      }
    }

    if (dependsOn.length > 0 && deps.length !== dependsOn.length) {
      return {
        status: 'error',
        message: 'Некоторые зависимые задачи не найдены'
      }
    }

    const task = await prisma.task.create({
      data: {
        ...data,
        projectId,
        dependsOn: dependsOn.length > 0 ? {
          connect: dependsOn.map(id => ({ id }))
        } : undefined,
      },
    })

    return {
      status: 'success',
      message: 'Задача создана',
      data: task as TaskWithStatusDTO
    }
  }

  async getProjectTasks(projectId: string) {
    const inTeam = await ProjectDAL.getUserRoleInTeamByProject(projectId, this.user.id)
    if (!inTeam || inTeam.role === 'PENDING') return []

    return await prisma.task.findMany({
      where: { projectId },
      include: { dependsOn: true, requiredFor: true },
      orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }]
    }) as TaskWithDependenciesDTO[]
  }

  async getTask(taskId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
      },
      include: { dependsOn: true, requiredFor: true },
    }) as TaskWithDependenciesDTO

    if (!task) return null

    const inTeam = await ProjectDAL.getUserRoleInTeamByProject(task.projectId, this.user.id)
    if (!inTeam || inTeam.role === 'PENDING') return null
    return task
  }

  async assignUser(taskId: string, userId: string): Promise<StateType> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    })
    if (!task) return { status: 'error', message: 'Задача не найдена' }

    const owner = await TeamDAL.getTeamOwner(task.project.teamId)
    if (!isOwner(this.user, { ownerId: owner?.userId })) {
      return {
        status: 'error',
        message: 'Нет прав на назначение задачи пользователю'
      }
    }

    const member = await prisma.userTeam.findFirst({
      where: {
        userId,
        teamId: task.project.teamId,
        role: { not: 'PENDING' },
      },
    })

    if (!member) return {
      status: 'error',
      message: 'Пользователь не состоит в команде проекта'
    }

    await prisma.assignedTask.upsert({
      where: {
        userId_taskId: { userId, taskId },
      },
      create: { userId, taskId },
      update: {},
    })

    return { status: 'success', message: 'Пользователь назначен на задачу' }
  }

  async selfAssign(taskId: string): Promise<StateType> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    })

    if (!task) return { status: 'error', message: 'Задача не найдена' }

    const inTeam = await TeamDAL.isUserInTeam(task.project.teamId, this.user.id)
    if (!inTeam) return {
      status: 'error',
      message: 'Вы не состоите в команде проекта'
    }

    await prisma.assignedTask.upsert({
      where: {
        userId_taskId: { userId: this.user.id, taskId },
      },
      create: { userId: this.user.id, taskId },
      update: {},
    })

    return { status: 'success', message: 'Вы успешно назначены на задачу!' }
  }

  async updateTask(taskId: string, input: unknown): Promise<StateType> {
    const parsed = TaskUpdateInputSchema.safeParse(input)
    if (!parsed.success) {
      return {
        status: 'error',
        message: createError(parsed.error.issues),
      }
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    })

    if (!task) return { status: 'error', message: 'Задача не найдена' }

    const owner = await TeamDAL.getTeamOwner(task.project.teamId)
    if (!isOwner(this.user, { ownerId: owner?.userId })) {
      return { status: 'error', message: 'Нет прав на изменение задачи' }
    }

    const { dependsOn, ...data } = parsed.data

    const deps = await prisma.task.findMany({
      where: { id: { in: dependsOn } },
    })

    if (deps.some(d => d.projectId !== task.projectId)) {
      return {
        status: 'error',
        message: 'Зависимые задачи принадлежат другому проекту!'
      }
    }

    if (dependsOn && dependsOn.length > 0 && deps.length !== dependsOn.length) {
      return {
        status: 'error',
        message: 'Некоторые зависимые задачи не найдены'
      }
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        ...data,
        dependsOn: dependsOn
          ? {
            set: dependsOn.map((id) => ({ id })),
          }
          : { set: [] },
      },
    })

    return { status: 'success', message: 'Задача обновлена' }
  }

  async changeStatus(input: unknown): Promise<StateType> {
    const parsed = TaskChangeStatusSchema.safeParse(input)
    if (!parsed.success)
      return { status: 'error', message: createError(parsed.error.issues) }

    const task = await prisma.task.findUnique({
      where: { id: parsed.data.TaskId },
      include: { project: true },
    })

    if (!task) return { status: 'error', message: 'Задача не найдена' }

    const owner = await TeamDAL.getTeamOwner(task.project.teamId)
    if (!isOwner(this.user, { ownerId: owner?.userId })) {
      return { status: 'error', message: 'Нет прав!' }
    }

    await prisma.task.update({
      where: { id: task.id },
      data: { status: parsed.data.answer },
    })

    return { status: 'success', message: 'Статус обновлён' }
  }

  async deleteTask(taskId: string): Promise<StateType> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    })

    if (!task) return { status: 'error', message: 'Задача не найдена' }

    const owner = await TeamDAL.getTeamOwner(task.project.teamId)
    if (!isOwner(this.user, { ownerId: owner?.userId })) {
      return { status: 'error', message: 'Нет прав!' }
    }

    await prisma.task.delete({ where: { id: taskId } })

    return { status: 'success', message: 'Задача удалена' }
  }
}
