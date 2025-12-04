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
          className="border rounded-xl p-2 hover:bg-muted/40 transition flex items-center"
        >
          <GiveAnswerForm
            teamId={team.id}
            teamName={team.name}
          />
        </li>
      ))}
    </ul>
  )
}
