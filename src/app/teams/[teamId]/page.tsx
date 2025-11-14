import Link from 'next/link'
import { TeamDAL } from '@/app/data/team/team.dal'
import { redirect } from 'next/navigation'
import TeamItem from '@/app/teams/[teamId]/_components/team-item'

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
    <TeamItem team={team} />
  )
}
