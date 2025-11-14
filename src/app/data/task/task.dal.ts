import 'server-only'
import { requireUser } from '@/app/data/user/require-user'
import { UserDTO } from '@/app/data/user/user.dto'
import { StateType } from '@/app/config/site.config'
import { TaskCreateInputSchema } from '@/app/data/task/task.dto'
import { createError } from '@/lib/utils'
import prisma from '@/lib/prisma'
import { ProjectDAL } from '../project/project.dal'

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

  async createTask(projectId: string, input: unknown): Promise<StateType> {
    const dal = await ProjectDAL.create()
    const project = await dal?.getProject(projectId)
    if (!project) return { status: 'error', message: 'Проект не найден' }

    const parsed = TaskCreateInputSchema.safeParse(input)
    if (!parsed.success) {
      return {
        status: 'error',
        message: createError(parsed.error.issues)
      }
    }

    await prisma.task.create({
      data: {
        ...parsed.data,
        projectId
      }
    })

    return {
      status: 'success',
      message: 'Задача создана'
    }
  }
}
