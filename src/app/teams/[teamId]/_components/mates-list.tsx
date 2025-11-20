import { UserWithTeamDTO } from '@/app/data/user/user.dto'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { UserRole } from '@/generated/prisma/enums'

type MatesListProps = {
  mates: UserWithTeamDTO[];
}

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

export default function MatesList({ mates }: MatesListProps) {
  return (
    <ItemGroup className="space-y-3">
      {mates.map((mate) => (
        <Item
          key={mate.id}
          variant={buttonVariants[mate.role]}
        >
          <ItemContent>
            <ItemTitle>{mate.username}</ItemTitle>
            <ItemDescription>
              {roleMapper[mate.role]}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              variant="outline"
              size="sm"
            >
              Подробнее
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
