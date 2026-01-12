import Link from "next/link";
import type { ProjectWithTeamDTO } from "@/app/data/project/project.dto";
import { Badge } from "@/components/ui/badge";

type ProjectsListProps = {
  projects: ProjectWithTeamDTO[];
};

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
          <Badge
            variant={project.status === "COMPLETED" ? "default" : "secondary"}
          >
            {project.status}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
