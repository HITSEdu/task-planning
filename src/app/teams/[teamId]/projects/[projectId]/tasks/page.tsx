import Link from 'next/link'
import { redirect } from 'next/navigation'
import { TaskDAL } from '@/app/data/task/task.dal'
import { ProjectDAL } from '@/app/data/project/project.dal'
import { TeamDAL } from '@/app/data/team/team.dal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CreateTaskForm from './_components/create-task-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import EmptyList from '@/app/_components/lists/empty-list'
import TasksList
  from '@/app/teams/[teamId]/projects/[projectId]/tasks/_components/tasks-list'
import { ArrowRight } from 'lucide-react'

type Props = {
  params: Promise<{
    teamId: string
    projectId: string
  }>
}

export default async function TasksPage({ params }: Props) {
  const { projectId, teamId } = await params

  const taskDal = await TaskDAL.create()
  const projectDal = await ProjectDAL.create()
  const teamDal = await TeamDAL.create()

  if (!taskDal || !projectDal || !teamDal) redirect('/sign-in')

  const project = await projectDal.getProject(projectId)
  const team = await teamDal.getUserTeam(teamId)
  const tasks = await taskDal.getProjectTasks(projectId)

  if (!project || !team) {
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

  const isOwner = team.role === 'OWNER'

  return (
    <div className="overflow-y-auto flex flex-col md:flex-row gap-6 p-4 md:p-8 justify-center items-stretch h-[calc(100vh-5rem)]">
      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col shadow-sm bg-card/70 backdrop-blur">
          <CardHeader className="border-b pb-2 flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl font-semibold">
              Задачи проекта: {project.title}
            </CardTitle>
            <Link
              href={`/teams/${teamId}/projects/${projectId}`}
              className="text-primary hover:underline"
            >
              Назад к проекту
            </Link>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="flex flex-col gap-4 h-full">
              {tasks.length > 0 &&
                <Link
                  href={`/teams/${teamId}/projects/${projectId}/tasks/dashboard`}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              }
              <ScrollArea className="h-full pr-4 pb-12">
                {tasks.length === 0 ? (
                  <EmptyList type="tasks" />
                ) : (
                  <TasksList
                    tasks={tasks}
                    teamId={teamId}
                  />
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </section>

      {isOwner && (
        <section className="flex-1 flex flex-col">
          <Card className="h-full flex flex-col shadow-sm bg-card/70 backdrop-blur p-0">
            <CardContent className="flex-1 overflow-y-auto p-4">
              <CreateTaskForm
                projectId={projectId}
                availableTasks={tasks}
              />
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}