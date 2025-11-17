import { TeamWithRoleDTO } from '@/app/data/team/team.dto'
import Link from 'next/link'

type TeamsListProps = {
  teams: TeamWithRoleDTO[]
}

export default function TeamsList({ teams }: TeamsListProps) {
  return (
    <ul className="space-y-3">
      {teams.map((team) => (
        <li
          key={team.id}
          className="border rounded-xl p-4 hover:bg-muted/40 transition flex justify-between items-center"
        >
          <Link
            href={`/teams/${team.id}`}
            className="font-medium hover:underline"
          >
            {team.name} --{'>'} Роль {team.role}
          </Link>
        </li>
      ))}
    </ul>
  )
}
