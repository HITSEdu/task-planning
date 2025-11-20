import { UserRole } from '@/generated/prisma/enums';
import { z } from 'zod'

export const AddUserToTeamSchema = z.object({
  username: z.string().min(2, 'Некорректное имя пользователя'),
})

export type AddUserToTeamInput = z.infer<typeof AddUserToTeamSchema>;

export const CreateUserSchema = z.object({
  name: z.string('Некорректное полное имя').min(3),
  email: z.email('Некорректный email'),
  password: z.string().min(8, 'Минимальная длина пароля: 8 символов'),
  username: z.string()
    .min(3, 'Имя пользователя должно быть как минимум 3 символа')
    .max(30, 'Превышена длина имени пользователя'),
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