import { UserRole } from '@/generated/prisma/enums'
import { z } from 'zod'

export const AddUserToTeamSchema = z.object({
  username: z.string().min(2, 'Некорректное имя пользователя'),
})

export type AddUserToTeamInput = z.infer<typeof AddUserToTeamSchema>;

export const CreateUserSchema = z.object({
  name: z.string('Некорректное полное имя')
    .min(3, 'Полное имя не может быть короче 3-х символов')
    .max(32, 'Полное имя не может быть длиннее 32-х символов'),
  email: z.email('Некорректный email'),
  password: z.string()
    .min(8, 'Пароль не может быть короче 8 символов')
    .max(32, 'Пароль не может быть длиннее 32-х символов'),
  username: z.string()
    .min(3, 'username не может быть короче 3-х символов')
    .max(32, 'username не может быть длиннее 32-х символов'),
})

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const LoginUserSchema = z.object({
  username: z.string(),
  password: z.string()
})

export type LoginUser = z.infer<typeof LoginUserSchema>;

export const UserDTOSchema = z.object({
  id: z.string(),
  email: z.email(),
  username: z.string(),
  createdAt: z.date(),
})

export type UserDTO = z.infer<typeof UserDTOSchema>;

export type UserWithTeamDTO = UserDTO & {
  teamId: string
  role: UserRole
}

export type UserWithTaskDTO = UserDTO & {
  taskId: string
  assignedAt: Date
}