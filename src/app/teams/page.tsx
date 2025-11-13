import { TeamDAL } from '@/app/data/team/team.dal'
import { redirect } from 'next/navigation'
import CreateTeamForm from '@/app/teams/_components/create-team-form'
import InvitesList from '@/app/teams/_components/invites-list'
import TeamsList from './_components/teams-list'
import EmptyTeams from '@/app/teams/_components/empty-teams'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export default async function TeamsPage() {
  const dal = await TeamDAL.create()
  if (!dal) redirect('/sign-in')

  const { teams, invites } = await dal.getUserTeams()

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 justify-center items-stretch min-h-[calc(100vh-5rem)]">
      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold text-center md:text-left">
              Мои команды
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              {teams.length === 0 ? (
                <EmptyTeams type="teams" />
              ) : (
                <TeamsList teams={teams} />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold text-center md:text-left">
              Приглашения
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              {invites.length === 0 ? (
                <EmptyTeams type="invites" />
              ) : (
                <InvitesList invites={invites} />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col justify-center shadow-sm p-6 md:p-8">
          <CardContent className="flex justify-center w-full mt-4">
            <CreateTeamForm />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}