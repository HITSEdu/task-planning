import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ProjectDAL } from '@/app/data/project/project.dal'
import { TeamDAL } from '@/app/data/team/team.dal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TaskDAL } from '@/app/data/task/task.dal'
import TaskItem
  from '@/app/teams/[teamId]/projects/[projectId]/tasks/[taskId]/_components/task-item/task-item'
import DeleteTaskForm
  from '@/app/teams/[teamId]/projects/[projectId]/tasks/[taskId]/_components/task-item/delete-task-form'
import EditTaskForm
  from '@/app/teams/[teamId]/projects/[projectId]/tasks/[taskId]/_components/task-item/edit-task-form'
import AssignUserForm
  from '@/app/teams/[teamId]/projects/[projectId]/tasks/[taskId]/_components/task-item/assign-user-form'
import AssignYourselfForm
  from '@/app/teams/[teamId]/projects/[projectId]/tasks/[taskId]/_components/task-item/assign-yourself-form'
import UnassignUserForm
  from '@/app/teams/[teamId]/projects/[projectId]/tasks/[taskId]/_components/task-item/unassign-user-form'
import ChangeTaskStatusForm
  from '@/app/teams/[teamId]/projects/[projectId]/tasks/[taskId]/_components/task-item/change-task-status-form'

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
          className="text-primary hover:underline"
        >
          Назад к списку задач
        </Link>
      </div>
    )

  const user = teamDal.getUser()
  const isAssigned = !!(await TaskDAL.getAssignedTask(taskId, user.id))
  const isOwner = team.role === 'OWNER'
  const assignedUsers = await taskDal.getAssignedUsers(taskId)
  const teamMembers = await teamDal.getUsersInTeam(teamId)

  const unAssignedUsers = teamMembers.filter(u => !assignedUsers.map(i => i.id).includes(u.id))

  const allTasks = await taskDal.getProjectTasks(projectId)

  return (
    <div className="overflow-y-auto flex flex-col md:flex-row gap-6 p-4 md:p-8 h-[calc(100vh-5rem)]">
      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col bg-card/70 backdrop-blur shadow-md">
          <CardHeader className="border-b pb-2 flex justify-between items-center">
          <CardTitle className="text-lg md:text-xl font-semibold">
              Информация о задаче
            </CardTitle>
            <Link
              href={`/teams/${teamId}/projects/${projectId}/tasks`}
              className="text-primary hover:underline"
            >
              Назад к списку задач
            </Link>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <TaskItem
              task={task}
              role={team.role}
              assignedUsers={assignedUsers}
            />
          </CardContent>
        </Card>
      </section>
      <section className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col bg-card/70 backdrop-blur shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold text-center md:text-left">
              Управление задачей
            </CardTitle>
          </CardHeader>
          {/* TODO(Изменить статус выполнения задачи/edit) */}
          <CardContent className="flex flex-col gap-4 mt-4 items-start">
            {isAssigned ? <UnassignUserForm
              task={task}
              userId={user.id}
            /> : <AssignYourselfForm task={task} />}
            <ChangeTaskStatusForm task={task} />
            {isOwner && (
              <>
                <DeleteTaskForm
                  task={task}
                />
                <EditTaskForm
                  task={task}
                  availableTasks={allTasks}
                />
                <AssignUserForm
                  task={task}
                  availableUsers={unAssignedUsers}
                />
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}