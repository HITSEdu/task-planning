import 'server-only'
import { z } from 'zod'

export const TaskCreateInputSchema = z.object({
  title: z.string().min(2, 'Название задачи должно быть не короче 2 символов'),
  description: z.string().optional(),
  deadline: z.date().optional(),
})


export type TaskCreateInput = z.infer<typeof TaskCreateInputSchema>

export const TaskUpdateInputSchema = z.object({
  title: z.string().min(2, 'Название задачи должно быть не короче 2 символов').optional(),
  description: z.string().optional(),
  deadline: z.date().optional(),
})

export type TaskUpdateInput = z.infer<typeof TaskUpdateInputSchema>

export const TaskDTOSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  deadline: z.date().optional(),
  createdAt: z.date(),
})

export type TaskDTO = z.infer<typeof TaskDTOSchema>;

export const TaskChangeStatusSchema = z.object({
  TaskId: z.string(),
  answer: z.enum(['CREATED', 'IN_PROGRESS', 'COMPLETED']),
})