import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ProjectDAL } from '@/app/data/project/project.dal'
import { TeamDAL } from '@/app/data/team/team.dal'
import { ProjectWithTeamDTO } from '@/app/data/project/project.dto'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProjectItem from './_components/project-item/project-item'
import DeleteProjectForm
  from '@/app/teams/[teamId]/projects/[projectId]/_components/project-item/delete-project-form'
import EditProjectForm
  from '@/app/teams/[teamId]/projects/[projectId]/_components/project-item/edit-project-form'
import ChangeProjectStatusForm
  from '@/app/teams/[teamId]/projects/[projectId]/_components/project-item/change-project-status-form'

type Props = {
  params: Promise<{
    teamId: string;
    projectId: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const { projectId, teamId } = await params

  const prDal = await ProjectDAL.create()
  const teamDal = await TeamDAL.create()
  if (!prDal || !teamDal) redirect('/sign-in')

  const pr = await prDal.getProject(projectId)
  const team = await teamDal.getUserTeam(teamId)

  if (!pr || !team) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Проект не найден</h1>
        <Link
          href={`/teams/${teamId}/projects`}
          className="text-primary hover:underline"
        >
          Назад к списку проектов
        </Link>
      </div>
    )
  }

  const project: ProjectWithTeamDTO = {
    ...pr,
    team,
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 justify-center items-stretch min-h-[calc(100vh-5rem)]">
      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col shadow-sm">
          <CardHeader className="border-b pb-2 flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl font-semibold">
              Информация о проекте
            </CardTitle>
            <Link
              href={`/teams/${teamId}/projects`}
              className="text-primary hover:underline"
            >
              Назад к проектам
            </Link>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ProjectItem project={project} />
          </CardContent>
        </Card>
      </section>

      {project.team.role === 'OWNER' && (
        <section className="flex-1 flex flex-col">
          <Card className="h-full flex flex-col shadow-sm p-6 md:p-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl font-semibold text-center md:text-left">
                Управление проектом
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 mt-4 items-start">
              <ChangeProjectStatusForm project={project} />
              <DeleteProjectForm project={project} />
              <EditProjectForm project={project} />
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}
