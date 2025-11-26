import 'server-only'
import { z } from 'zod'
import { ProjectStatus } from '@/generated/prisma/enums'
import { TeamWithRoleDTO } from '@/app/data/team/team.dto'

export const ProjectCreateInputSchema = z.object({
  title: z.string().min(2, 'Название проекта должно быть не короче 2 символов'),
  description: z.string().optional(),
  deadline: z.date()
    .min(new Date(), 'Срок сдачи не может быть в прошлом')
    .optional(),
})

export type ProjectCreateInput = z.infer<typeof ProjectCreateInputSchema>

export const ProjectUpdateInputSchema = z.object({
  title: z.string().min(2, 'Название проекта должно быть не короче 2 символов').optional(),
  description: z.string().optional(),
  deadline: z.date()
    .min(new Date(), 'Срок сдачи не может быть в прошлом')
    .optional(),
})

export type ProjectUpdateInput = z.infer<typeof ProjectUpdateInputSchema>

export const ProjectDTOSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  deadline: z.date().optional(),
  createdAt: z.date(),
})

export type ProjectDTO = z.infer<typeof ProjectDTOSchema> & { teamId: string };

export type ProjectWithStatusDTO = ProjectDTO & {
  status: ProjectStatus
}

export type ProjectWithTeamDTO = ProjectWithStatusDTO & {
  team: TeamWithRoleDTO
}

export const ProjectChangeStatusSchema = z.object({
  ProjectId: z.string(),
  answer: z.enum(['CREATED', 'IN_PROGRESS', 'COMPLETED']),
})