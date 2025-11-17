import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ProjectDAL } from '@/app/data/project/project.dal'
import { TeamDAL } from '@/app/data/team/team.dal'
import { ProjectWithTeamDTO } from '@/app/data/project/project.dto'
import ProjectItem
  from '@/app/teams/[teamId]/projects/[projectId]/_components/project-item'
import DeleteProjectForm
  from '@/app/teams/[teamId]/projects/[projectId]/_components/delete-project-form'

type Props = {
  params: Promise<{
    teamId: string
    projectId: string
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
          className="text-blue-500 hover:underline"
        >
          Назад к списку проектов
        </Link>
      </div>
    )
  }

  const project: ProjectWithTeamDTO = {
    ...pr,
    team
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <ProjectItem project={project} />
      {project.team.role === 'OWNER' && (
        <DeleteProjectForm project={project} />)}
    </div>
  )
}
