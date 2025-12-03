import Link from "next/link";
import { redirect } from "next/navigation";
import { TaskDAL } from "@/app/data/task/task.dal";
import { ProjectDAL } from "@/app/data/project/project.dal";
import { TeamDAL } from "@/app/data/team/team.dal";
import "react-modern-gantt/dist/index.css";
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
  const teamDal = await TeamDAL.create();

  if (!taskDal || !projectDal || !teamDal) redirect("/sign-in");

  const project = await projectDal.getProject(projectId);
  const team = await teamDal.getUserTeam(teamId);
  const tasks = await taskDal.getProjectTasks(projectId);

  if (!project || !team) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">У вас пока нет задач</h1>
        <Link
          href={`/teams/${teamId}/projects`}
          className="text-primary hover:underline"
        >
          Назад к списку задач
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 justify-center items-center h-full">
      <GanttChartItem tasks={tasks} project={project}></GanttChartItem>
    </div>
  );
}
