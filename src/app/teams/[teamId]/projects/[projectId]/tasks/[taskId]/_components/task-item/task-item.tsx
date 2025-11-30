'use client'

import { Badge } from '@/components/ui/badge'
import { TaskWithDependenciesDTO } from '@/app/data/task/task.dto'
import { UserRole } from '@/generated/prisma/enums'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@/components/ui/item'
import { UserWithTaskDTO } from '@/app/data/user/user.dto'
import { Card, CardContent } from '@/components/ui/card'
import UnassignUserForm
  from '@/app/teams/[teamId]/projects/[projectId]/tasks/[taskId]/_components/task-item/unassign-user-form'

type TaskItemProps = {
  task: TaskWithDependenciesDTO
  role: UserRole
  assignedUsers: UserWithTaskDTO[];
}

export default function TaskItem({ task, role, assignedUsers }: TaskItemProps) {
  return (
    <Item
      variant="default"
      className="flex flex-col gap-6 p-4 items-start"
    >

      <ItemContent className="w-full">
        <ItemTitle className="flex items-center gap-2">
          {task.title}
          <Badge variant={task.status === 'COMPLETED' ? 'default' : 'secondary'}>
            {task.status}
          </Badge>
        </ItemTitle>

        <ItemDescription>
          Описание: {task.description ?? '-'}
        </ItemDescription>

        <ItemDescription>
          Срок сдачи: {task.deadline?.toLocaleDateString() ?? '-'}
        </ItemDescription>

        {task.dependsOn.length > 0 && (
          <div className="mt-3">
            <span className="text-sm font-medium">Зависит от:</span>
            <div className="flex gap-2 mt-2 flex-wrap">
              {task.dependsOn.map(dep => (
                <Badge
                  key={dep.id}
                  variant="outline"
                >
                  {dep.title}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 w-full">
          <h4 className="font-medium text-sm mb-2">Назначенные пользователи:</h4>

          {assignedUsers.length === 0 && (
            <p className="text-muted-foreground text-sm">Пока никто не назначен</p>
          )}

          <div className="flex flex-col gap-2">
            {assignedUsers.map(user => (
              <Card
                key={user.id}
                className="bg-muted/40"
              >
                <CardContent className="flex justify-between items-center py-2 px-4">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>

                  {role === 'OWNER' && (
                    <UnassignUserForm
                      task={task}
                      userId={user.id}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ItemContent>

      <ItemActions />
    </Item>
  )
}
