import Link from "next/link";
import { redirect } from "next/navigation";
import { ProjectDAL } from "@/app/data/project/project.dal";
import { TaskDAL } from "@/app/data/task/task.dal";
import "react-modern-gantt/dist/index.css";
import { ArrowLeft } from "lucide-react";
import GanttChartItem from "./_components/gantt-chart-item";

type Props = {
  params: Promise<{
    teamId: string;
    projectId: string;
  }>;
};

export default async function TasksDashboard({ params }: Props) {
  const { projectId, teamId } = await params;

  const taskDal = await TaskDAL.create();
  const projectDal = await ProjectDAL.create();

  if (!taskDal || !projectDal) redirect("/sign-in");

  const project = await projectDal.getProject(projectId);
  const tasks = await taskDal.getProjectTasks(projectId);

  if (!project || tasks.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">У вас пока нет задач</h1>
        <Link
          href={`/teams/${teamId}/projects/${projectId}/tasks`}
          className="text-primary hover:underline"
        >
          Назад к списку задач
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex flex-col gap-6 p-4 md:p-8 justify-start items-start h-full">
      <Link
        href={`/teams/${teamId}/projects/${projectId}/tasks`}
        className="text-primary hover:underline flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> Назад к списку задач
      </Link>
      <GanttChartItem tasks={tasks} project={project} />
    </div>
  );
}
