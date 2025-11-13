import {
  Empty, EmptyDescription, EmptyHeader, EmptyTitle
} from '@/components/ui/empty'

type EmptyTeamsProps = {
  type: 'teams' | 'invites'
}

const phrases = {
  'teams': 'У вас пока нет команд.\n' +
    '          Вы можете создать свою или получить приглашение от других людей.',
  'invites': 'У вас пока нет новых приглашений.'
}

export default function EmptyTeams({ type }: EmptyTeamsProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Нет {type === 'teams' ? 'команд' : 'приглашений'}</EmptyTitle>
        <EmptyDescription>
          {phrases[type]}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}