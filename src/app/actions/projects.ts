"use server";

import { revalidatePath } from "next/cache";
import type { StateType } from "@/app/config/site.config";
import { ProjectDAL } from "@/app/data/project/project.dal";
import type { ProjectWithStatusDTO } from "@/app/data/project/project.dto";

export async function createProjectAction(
  teamId: string,
  _prev: StateType,
  formData: FormData,
): Promise<StateType<ProjectWithStatusDTO>> {
  const dal = await ProjectDAL.create();
  if (!dal) return { status: "error", message: "Сессия недействительна!" };

  return await dal.createProject(teamId, {
    title: formData.get("title"),
    description: formData.get("description"),
    deadline: formData.get("deadline")
      ? new Date(formData.get("deadline") as string)
      : undefined,
  });
}

export async function updateProjectAction(
  projectId: string,
  _prev: StateType,
  formData: FormData,
): Promise<StateType> {
  const dal = await ProjectDAL.create();
  if (!dal) return { status: "error", message: "Сессия недействительна!" };

  const result = await dal.updateProject(projectId, {
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
    deadline: formData.get("deadline")
      ? new Date(formData.get("deadline") as string)
      : undefined,
  });

  if (result.status === "success")
    revalidatePath("/teams/[teamId]/projects/[projectId]", "page");

  return result;
}

export async function deleteProjectAction(
  projectId: string,
  _prev: StateType,
): Promise<StateType> {
  const dal = await ProjectDAL.create();
  if (!dal) return { status: "error", message: "Сессия недействительна!" };

  return await dal.deleteProject(projectId);
}

export async function changeProjectStatusAction(
  _prev: StateType,
  formData: FormData,
): Promise<StateType> {
  const dal = await ProjectDAL.create();
  if (!dal) return { status: "error", message: "Сессия недействительна!" };

  const result = await dal.changeStatus({
    ProjectId: formData.get("projectId"),
    answer: formData.get("status"),
  });

  if (result.status === "success") {
    revalidatePath("/teams/[teamId]/projects/[projectId]", "page");
  }

  return result;
}
