import Link from "next/link";
import { redirect } from "next/navigation";
import { ProjectDAL } from "@/app/data/project/project.dal";
import { TeamDAL } from "@/app/data/team/team.dal";
import { ProjectWithTeamDTO } from "@/app/data/project/project.dto";
import ProjectItem from "@/app/teams/[teamId]/projects/[projectId]/_components/project-item";
import DeleteEditProjectForm from "@/app/teams/[teamId]/projects/[projectId]/_components/delete-project-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyList from "@/app/_components/lists/empty-list";
import { ScrollArea } from "@radix-ui/react-scroll-area";

type Props = {
  params: Promise<{
    teamId: string;
    projectId: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const { projectId, teamId } = await params;

  const prDal = await ProjectDAL.create();
  const teamDal = await TeamDAL.create();
  if (!prDal || !teamDal) redirect("/sign-in");

  const pr = await prDal.getProject(projectId);
  const team = await teamDal.getUserTeam(teamId);

  if (!pr || !team) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Проект не найден</h1>
        <Link
          href={`/teams/${teamId}/projects`}
          className="text-blue-500 hover:underline"
        >
          Назад к списку проектов
        </Link>
      </div>
    );
  }

  const project: ProjectWithTeamDTO = {
    ...pr,
    team,
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 justify-center items-stretch min-h-[calc(100vh-5rem)]">
      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold text-center md:text-left">
              Информация о проекте
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="flex flex-col gap-2">
              <ProjectItem project={project} />
              <Link
                  href={`/teams/${team.id}/projects/${project.id}/tasks`}
                  className="p-2 w-fit border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:hover:bg-input/50 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all"
                >
                  Задачи
              </Link>
              {project.team.role === "OWNER" && (
                <DeleteEditProjectForm project={project} />
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {project.team.role === "OWNER" && (
        <section className="flex-1 flex flex-col">
          <Card className="h-full flex flex-col shadow-sm p-6 md:p-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl font-semibold text-center md:text-left">
                Управление проектом
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center w-full mt-4">
              {/* TODO: ??? Как можно управлять проектом?  */}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
