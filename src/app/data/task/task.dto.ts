import 'server-only'
import { z } from 'zod'
import { TaskStatus } from '@/generated/prisma/enums'

export const TaskCreateInputSchema = z.object({
  title: z.string().min(2, 'Название задачи должно быть не короче 2 символов'),
  description: z.string().optional(),
  deadline: z.date()
    .min(new Date(), 'Срок сдачи не может быть в прошлом')
    .optional(),
  dependsOn: z.array(z.string()).default([]),
})


export type TaskCreateInput = z.infer<typeof TaskCreateInputSchema>

export const TaskUpdateInputSchema = z.object({
  title: z.string().min(2, 'Название задачи должно быть не короче 2 символов').optional(),
  description: z.string().optional(),
  deadline: z.date()
    .min(new Date(), 'Срок сдачи не может быть в прошлом')
    .optional(),
  dependsOn: z.array(z.string()).optional(),
})

export type TaskUpdateInput = z.infer<typeof TaskUpdateInputSchema>

export const TaskDTOSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  deadline: z.date().optional(),
  createdAt: z.date(),
})

export type TaskDTO = z.infer<typeof TaskDTOSchema> & { projectId: string };

export type TaskWithStatusDTO = TaskDTO & {
  status: TaskStatus
}

export type TaskWithDependenciesDTO = TaskWithStatusDTO & {
  dependsOn: TaskWithStatusDTO[],
  requiredFor: TaskWithStatusDTO[],
}

export const TaskChangeStatusSchema = z.object({
  TaskId: z.string(),
  answer: z.enum(['CREATED', 'IN_PROGRESS', 'COMPLETED']),
})

export const TaskAssignUserSchema = z.object({
  UserId: z.string(),
})