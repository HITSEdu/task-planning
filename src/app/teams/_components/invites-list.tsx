import { TeamDTO } from '@/app/data/team/team.dto'
import GiveAnswerForm from '@/app/teams/_components/give-answer-form'

type InvitesListProps = {
  invites: TeamDTO[];
}

export default function InvitesList({ invites }: InvitesListProps) {
  return (
    <ul className="space-y-3">
      {invites.map((team) => (
        <li
          key={team.id}
          className="border rounded-xl p-4 flex items-center justify-between hover:bg-muted/40 transition"
        >
          <span className="font-medium">{team.name}</span>
          <GiveAnswerForm teamId={team.id} />
        </li>
      ))}
    </ul>
  )
}
