import Link from 'next/link'
import { ProjectWithTeamDTO } from '@/app/data/project/project.dto'

type ProjectsListProps = {
  projects: ProjectWithTeamDTO[]
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <ul className="space-y-3">
      {projects.map((project) => (
        <li
          key={project.id}
          className="border rounded-xl p-4 hover:bg-muted/40 transition flex justify-between items-center"
        >
          <Link
            href={`/teams/${project.teamId}/projects/${project.id}`}
            className="font-medium hover:underline"
          >
            {project.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
