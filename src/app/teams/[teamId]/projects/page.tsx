import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectDAL } from "@/app/data/project/project.dal";
import EmptyList from "@/app/_components/lists/empty-list";
import ProjectsList from "@/app/teams/[teamId]/projects/_components/projects-list";
import { TeamDAL } from "@/app/data/team/team.dal";
import { ProjectWithTeamDTO } from "@/app/data/project/project.dto";
import CreateProjectForm from "@/app/teams/[teamId]/projects/_components/create-project-form";
import Link from "next/link";

type Props = {
  params: Promise<{
    teamId: string;
  }>;
};

export default async function ProjectsPage({ params }: Props) {
  const { teamId } = await params;

  const prDal = await ProjectDAL.create();
  const teamDal = await TeamDAL.create();
  if (!prDal || !teamDal) redirect("/sign-in");

  const prs = await prDal.getUserProjects(teamId);
  const team = (await teamDal.getUserTeam(teamId))!;

  const projects: ProjectWithTeamDTO[] = prs.map((el) => ({
    ...el,
    team,
  }));

  return (
    <div className="overflow-y-auto flex flex-col md:flex-row gap-6 p-4 md:p-8 justify-center items-stretch h-[calc(100vh-5rem)]">
      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col shadow-sm">
          <CardHeader className="border-b pb-2 flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl font-semibold">
              Мои проекты
            </CardTitle>
            <Link
              href={`/teams/${teamId}`}
              className="text-primary hover:underline"
            >
              Назад к команде
            </Link>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4 pb-12">
              {projects.length === 0 ? (
                <EmptyList type="projects" />
              ) : (
                <ProjectsList projects={projects} />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      {team.role === "OWNER" && (
        <section className="flex-1 flex flex-col">
          <Card className="h-full flex flex-col justify-center shadow-sm p-6 md:p-8">
            <CardContent className="flex justify-center w-full mt-4">
              <CreateProjectForm teamId={teamId} />
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
