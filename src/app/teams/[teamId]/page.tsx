import Link from "next/link";
import { redirect } from "next/navigation";
import { TeamDAL } from "@/app/data/team/team.dal";
import InviteForm from "@/app/teams/[teamId]/_components/invite-form";
import TeamItem from "@/app/teams/[teamId]/_components/team-item/team-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import MatesList from "./_components/mates-list";

type Props = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamPage({ params }: Props) {
  const { teamId } = await params;
  const dal = await TeamDAL.create();
  if (!dal) redirect("/sign-in");

  const team = await dal.getUserTeam(teamId);

  if (!team) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px] w-full">
        <div className="text-center flex flex-col">
          <h1 className="text-xl font-semibold">Команда не найдена...</h1>
          <Link href="/teams" className="text-primary hover:underline">
            Назад к списку команд
          </Link>
        </div>
      </div>
    );
  }

  const mates = await dal.getUsersInTeam(teamId);
  const user = mates.find((el) => el.id === dal.getUser().id)!;

  return (
    <div className="overflow-y-auto flex flex-col md:flex-row gap-6 p-4 md:p-8 justify-center items-stretch h-[calc(100vh-5rem)]">
      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col shadow-sm">
          <CardHeader className="border-b pb-2 flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl font-semibold">
              Информация о команде
            </CardTitle>
            <Link href={`/teams`} className="text-primary hover:underline">
              Назад к списку команд
            </Link>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <TeamItem team={team} />
          </CardContent>
        </Card>
      </section>

      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold text-center md:text-left">
              Участники команды
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              <MatesList mates={mates} user={user} />
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      {team.role === "OWNER" && (
        <section className="flex-1 flex flex-col">
          <Card className="h-full flex flex-col shadow-sm p-6 md:p-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl font-semibold text-center md:text-left">
                Управление командой
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center w-full mt-4">
              <InviteForm teamId={teamId} />
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
