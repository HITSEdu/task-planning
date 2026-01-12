import Link from "next/link";
import type { TaskWithDependenciesDTO } from "@/app/data/task/task.dto";
import { Badge } from "@/components/ui/badge";

type TasksListProps = {
  tasks: TaskWithDependenciesDTO[];
  teamId: string;
};

export default function TasksList({ tasks, teamId }: TasksListProps) {
  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="border rounded-xl p-4 hover:bg-muted/40 transition flex justify-between items-center"
        >
          <Link
            href={`/teams/${teamId}/projects/${task.projectId}/tasks/${task.id}`}
            className="font-medium hover:underline"
          >
            {task.title}
          </Link>
          <Badge
            variant={task.status === "COMPLETED" ? "default" : "secondary"}
          >
            {task.status}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
