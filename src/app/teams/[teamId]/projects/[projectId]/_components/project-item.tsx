'use client'

import { ProjectWithTeamDTO } from '@/app/data/project/project.dto'

type ProjectItemProps = {
  project: ProjectWithTeamDTO
}

export default function ProjectItem({ project }: ProjectItemProps) {


  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{project.title}</h1>
      <p className="text-gray-500 mt-2">ID: {project.id}</p>
      <p className="text-gray-500 mt-2">Описание: {project.description ?? '-'}</p>
      <p className="text-gray-500 mt-2">Срок сдачи: {project.deadline?.toLocaleDateString() ?? '-'}</p>
      <p className="text-gray-500 mt-2">Проект: {project.team.name}</p>
    </div>
  )
}