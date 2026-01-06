import { TeamDAL } from "@/app/data/team/team.dal";
import { redirect } from "next/navigation";
import CreateTeamForm from "@/app/teams/_components/create-team-form";
import InvitesList from "@/app/teams/_components/invites-list";
import TeamsList from "./_components/teams-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyList from "../_components/lists/empty-list";

export default async function TeamsPage() {
  const dal = await TeamDAL.create();
  if (!dal) redirect("/sign-in");

  const { teams, invites } = await dal.getUserTeams();

  return (
    <div className="overflow-y-auto flex flex-col md:flex-row gap-6 p-4 md:p-8 justify-center items-stretch h-[calc(100vh-5rem)]">
      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold text-center md:text-left">
              Мои команды
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4 pb-12">
              {teams.length === 0 ? (
                <EmptyList type="teams" />
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
            <ScrollArea className="h-full pr-4 pb-12">
              {invites.length === 0 ? (
                <EmptyList type="invites" />
              ) : (
                <InvitesList invites={invites} />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col shadow-sm p-6 md:p-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold text-center md:text-left">
              Создать команду
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center w-full mt-4">
            <CreateTeamForm />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
