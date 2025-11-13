'use client'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useActionState, useEffect } from 'react'
import { signUpAction } from '@/app/actions/user'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'

export default function RegisterForm() {
  const [state, action, pending] = useActionState(signUpAction, {})

  useEffect(() => {
    if (!pending) {
      if (state.status === 'error') {
        toast.error(state.message)
      } else if (state.status === 'success') {
        toast.success(state.message)
        redirect('/dashboard')
      }
    }
  }, [state.status])

  return (
    <form
      action={action}
      className="flex w-full max-w-sm items-center bg-card p-2 rounded-lg"
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend className="text-center">Регистрация</FieldLegend>
          <FieldDescription>
            Создайте свой аккаунт для планирования задач
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="checkout-full-name">
                Полное имя
              </FieldLabel>
              <Input
                id="checkout-full-name"
                type="text"
                name="name"
                placeholder="Денис Мосин"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-email">
                Почта
              </FieldLabel>
              <Input
                type="email"
                name="email"
                id="checkout-email"
                placeholder="mail@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-username">
                Имя пользователя
              </FieldLabel>
              <Input
                type="text"
                name="username"
                id="checkout-username"
                placeholder="example_user"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-password">
                Пароль
              </FieldLabel>
              <Input
                type="password"
                name="password"
                id="checkout-password"
                placeholder="Str0nG_p4ssw0rd"
                required
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit"> {pending ? 'Регистрация...' : 'Зарегистрироваться'}</Button>
          <Button
            variant="outline"
            type="button"
          >
            Есть аккаунт?
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
