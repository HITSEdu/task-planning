'use client'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ProjectWithTeamDTO } from '@/app/data/project/project.dto'

type ProjectItemProps = {
  project: ProjectWithTeamDTO
}

export default function ProjectItem({ project }: ProjectItemProps) {
  return (
    <Item
      variant="default"
      className="flex flex-col gap-4 items-start"
    >
      <ItemContent>
        <ItemTitle>{project.title}</ItemTitle>
        <ItemDescription>Описание: {project.description ?? '-'}</ItemDescription>
        <ItemDescription>Срок сдачи: {project.deadline?.toLocaleDateString() ?? '-'}</ItemDescription>
        <ItemDescription>Команда: {project.team.name}</ItemDescription>
      </ItemContent>
      <ItemActions className="flex gap-4 flex-col items-start">
        <Button
          asChild
          variant="outline"
        >
          <Link
            href={`/teams/${project.team.id}/projects/${project.id}/tasks`}
          >
            Задачи
          </Link>
        </Button>
      </ItemActions>
    </Item>
  )
}