import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ProjectDAL } from '@/app/data/project/project.dal'
import { TeamDAL } from '@/app/data/team/team.dal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TaskDAL } from '@/app/data/task/task.dal'
import TaskItem
  from '@/app/teams/[teamId]/projects/[projectId]/tasks/[taskId]/_components/task-item'

type Props = {
  params: Promise<{
    teamId: string
    projectId: string
    taskId: string
  }>;
};

export default async function TaskPage({ params }: Props) {
  const { projectId, teamId, taskId } = await params

  const prDal = await ProjectDAL.create()
  const teamDal = await TeamDAL.create()
  const taskDal = await TaskDAL.create()
  if (!prDal || !teamDal || !taskDal) redirect('/sign-in')

  const pr = await prDal.getProject(projectId)
  const team = await teamDal.getUserTeam(teamId)
  const task = await taskDal.getTask(taskId)

  if (!pr || !team || !task)
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Задача не найдена</h1>
        <Link
          href={`/teams/${teamId}/projects/${projectId}/tasks`}
          className="text-blue-500 hover:underline"
        >
          Назад к списку задач
        </Link>
      </div>
    )

  const isAssigned = !!(await TaskDAL.getAssignedTask(taskId, teamDal.getUser().id))

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 min-h-[calc(100vh-5rem)]">
      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col bg-card/70 backdrop-blur shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Информация о задаче</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <TaskItem
              task={task}
              role={team.role}
              isAssigned={isAssigned}
            />
          </CardContent>
        </Card>
      </section>

      {team.role === 'OWNER' && (
        <section className="flex-1 flex flex-col">
          <Card className="h-full flex flex-col bg-card/70 backdrop-blur shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Управление задачей</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto">
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}