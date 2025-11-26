'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { selfAssignAction } from '@/app/actions/tasks'
import { toast } from 'sonner'
import { TaskWithDependenciesDTO } from '@/app/data/task/task.dto'
import { UserRole } from '@/generated/prisma/enums'
import { useRouter } from 'next/navigation'

type TaskItemProps = {
  task: TaskWithDependenciesDTO
  role: UserRole
  isAssigned: boolean
}

export default function TaskItem({ task, role, isAssigned }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)

  const canEdit = role === 'OWNER'

  // todo этот компонент надо полностью поменять

  const handleSelfAssign = async () => {
    const result = await selfAssignAction(task.id, {})
    if (result.status === 'success') {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  // if (isEditing) {
  //   return (
  //     <UpdateTaskForm
  //       task={task}
  //       onCancel={() => setIsEditing(false)}
  //     />
  //   )
  // }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant={task.status === 'COMPLETED' ? 'default' : 'secondary'}>
              {task.status}
            </Badge>
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Редактировать
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-3">{task.description}</p>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            {task.deadline && (
              <span>До: {new Date(task.deadline).toLocaleDateString()}</span>
            )}
          </div>

          <div className="flex gap-2">
            {!isAssigned && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelfAssign}
              >
                Взять задачу
              </Button>
            )}
          </div>
        </div>

        {task.dependsOn.length > 0 && (
          <div className="mt-3">
            <span className="text-sm font-medium">Зависит от:</span>
            <div className="flex gap-1 mt-1">
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
      </CardContent>
    </Card>
  )
}