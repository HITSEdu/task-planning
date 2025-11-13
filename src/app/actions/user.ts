import { StateType } from '@/app/config/site.config'
import { UserDAL } from '../data/user/user.dal'
import { CreateUserSchema, LoginUserSchema } from '@/app/data/user/user.dto'

export async function signUpAction(_prevState: StateType, formData: FormData): Promise<StateType> {
  const parsed = CreateUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username'),
  })

  if (!parsed.success) return {
    status: 'error',
    message: 'Некорректные данные'
  }

  return await UserDAL.signUp(parsed.data)
}

export async function signInAction(_prevState: StateType, formData: FormData): Promise<StateType> {
  const parsed = LoginUserSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })

  if (!parsed.success) return {
    status: 'error',
    message: 'Некорректные данные'
  }

  return await UserDAL.signIn(parsed.data)
}

export async function signOutAction(_prevState: StateType): Promise<StateType> {
  return await UserDAL.signOut()
}