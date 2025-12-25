'use client'

import { UserWithTeamDTO } from '@/app/data/user/user.dto'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogClose, DialogContent,
  DialogDescription, DialogFooter, DialogHeader, DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useActionState, useEffect } from 'react'
import { kickFromTeamAction } from '@/app/actions/teams'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import { UserRole } from '@/generated/prisma/enums'

const roleMapper = {
  'OWNER': 'Владелец',
  'MEMBER': 'Участник',
  'PENDING': 'Приглашен'
}

type Variants = 'outline' | 'default' | 'muted'

const buttonVariants: Record<UserRole, Variants> = {
  'OWNER': 'outline',
  'MEMBER': 'default',
  'PENDING': 'muted'
}

type MateItemProps = {
  mate: UserWithTeamDTO
  user: UserWithTeamDTO
  teamId: string
}

export default function MateItem({ mate, user, teamId }: MateItemProps) {
  const [state, action, pending] = useActionState(kickFromTeamAction.bind(null, teamId, mate.id), {})

  useEffect(() => {
    if (!pending) {
      if (state.status === 'error') {
        toast.error(state.message)
      } else if (state.status === 'success') {
        toast.success(state.message)
        if (mate.id === user.id) {
          redirect(`/teams/`)
        }
      }
    }
  }, [state, pending])

  const isSelf = mate.id === user.id
  const canKick = user.role === 'OWNER' || isSelf

  return (
    <Item variant={buttonVariants[mate.role]}>
      <ItemContent>
        <ItemTitle>{mate.username}</ItemTitle>
        <ItemDescription>{roleMapper[mate.role]}</ItemDescription>
      </ItemContent>

      <ItemActions className="flex gap-2">
        <Dialog>
          <Button
            asChild
            variant="outline"
          >
            <DialogTrigger>Подробнее</DialogTrigger>
          </Button>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Информация об участнике</DialogTitle>
              <DialogDescription className="space-y-1 mb-4">
                Имя: {mate.username}
              </DialogDescription>
              <div className="space-y-1">
                <p>Почта: {mate.email}</p>
                <p>Роль: {roleMapper[mate.role]}</p>
                <p>В команде с {mate.createdAt.toLocaleString()}</p>
              </div>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Назад</Button>
              </DialogClose>
              {canKick && (
                <form action={action}>
                  <Button
                    type="submit"
                    variant="destructive"
                  > {pending ? 'Ожидание...' : isSelf ? 'Покинуть' : 'Выгнать'}</Button>
                </form>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ItemActions>
    </Item>
  )
}
