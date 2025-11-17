import { UserRole } from '@/generated/prisma/enums'
import 'server-only'
import { z } from 'zod'

export const TeamCreateInputSchema = z.object({
  name: z.string().min(2, 'Название команды должно быть не короче 2 символов')
})

export type TeamCreateInput = z.infer<typeof TeamCreateInputSchema>

export const TeamDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
})

export type TeamDTO = z.infer<typeof TeamDTOSchema>;

export type TeamWithRoleDTO = TeamDTO & {
  role: UserRole;
}

export const TeamAnswerSchema = z.object({
  teamId: z.string(),
  answer: z.enum(['accept', 'reject']),
})