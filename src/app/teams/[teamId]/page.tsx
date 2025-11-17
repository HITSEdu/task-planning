import Link from 'next/link'
import { TeamDAL } from '@/app/data/team/team.dal'
import { redirect } from 'next/navigation'
import TeamItem from '@/app/teams/[teamId]/_components/team-item'
import DeleteTeamForm from '@/app/teams/[teamId]/_components/delete-team-form'

type Props = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamPage({ params }: Props) {
  const { teamId } = await params
  const dal = await TeamDAL.create()
  if (!dal) redirect('/sign-in')

  const team = await dal.getUserTeam(teamId)

  if (!team) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Команда не найдена</h1>
        <Link
          href="/teams"
          className="text-blue-500 hover:underline"
        >
          Назад к списку команд
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <TeamItem team={team} />
      <Link
        href={`/teams/${team.id}/projects`}
        className="font-medium hover:underline"
      >
        Проекты
      </Link>
      {team.role === 'OWNER' && (<DeleteTeamForm team={team} />)}
    </div>
  )
}
