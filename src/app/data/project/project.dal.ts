import "server-only";
import type { StateType } from "@/app/config/site.config";
import { requireUser } from "@/app/data/user/require-user";
import type { UserDTO } from "@/app/data/user/user.dto";
import prisma from "@/lib/prisma";
import { createError } from "@/lib/utils";
import { TeamDAL } from "../team/team.dal";
import { isOwner } from "../team/team.policy";
import {
  ProjectChangeStatusSchema,
  ProjectCreateInputSchema,
  ProjectUpdateInputSchema,
  type ProjectWithStatusDTO,
} from "./project.dto";

export class ProjectDAL {
  private constructor(private readonly user: UserDTO) {}

  static async create() {
    try {
      const user = await requireUser();
      return new ProjectDAL(user);
    } catch (_error) {
      return null;
    }
  }

  static async getUserRoleInTeamByProject(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });
    if (!project) return null;
    return await TeamDAL.getUserRoleInTeam(project.teamId, userId);
  }

  async createProject(
    teamId: string,
    input: unknown,
  ): Promise<StateType<ProjectWithStatusDTO>> {
    const parsed = ProjectCreateInputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        status: "error",
        message: createError(parsed.error.issues),
      };
    }

    const owner = await TeamDAL.getTeamOwner(teamId);
    if (!isOwner(this.user, { ownerId: owner?.userId })) {
      return { status: "error", message: "Нет прав на создание проекта!" };
    }

    const project = await prisma.project.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        deadline: parsed.data.deadline,
        teamId,
      },
    });

    return {
      status: "success",
      message: "Проект успешно создан!",
      data: project as ProjectWithStatusDTO,
    };
  }

  async getUserProjects(teamId: string) {
    const inTeam = await TeamDAL.isUserInTeam(teamId, this.user.id);
    if (!inTeam) return [];

    const allProjects = (await prisma.project.findMany({
      where: { teamId: teamId },
    })) as ProjectWithStatusDTO[];

    return allProjects.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async getProject(projectId: string) {
    const project = (await prisma.project.findFirst({
      where: {
        id: projectId,
      },
    })) as ProjectWithStatusDTO | null;

    if (!project) return null;

    const inTeam = await TeamDAL.isUserInTeam(project.teamId, this.user.id);
    if (!inTeam) return null;
    return project;
  }

  async updateProject(
    projectId: string,
    input: unknown,
  ): Promise<StateType<ProjectWithStatusDTO>> {
    const parsed = ProjectUpdateInputSchema.safeParse(input);
    if (!parsed.success)
      return {
        status: "error",
        message: createError(parsed.error.issues),
      };

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) return { status: "error", message: "Проект не найден" };

    const teamOwner = await TeamDAL.getTeamOwner(project.teamId);
    if (!isOwner(this.user, { ownerId: teamOwner?.userId })) {
      return { status: "error", message: "Нет прав на изменение проекта" };
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        deadline: parsed.data.deadline,
      },
    });

    return {
      status: "success",
      message: "Проект обновлён",
      data: updated as ProjectWithStatusDTO,
    };
  }

  async changeStatus(input: unknown): Promise<StateType<ProjectWithStatusDTO>> {
    const parsed = ProjectChangeStatusSchema.safeParse(input);
    if (!parsed.success) {
      return { status: "error", message: createError(parsed.error.issues) };
    }

    const project = await prisma.project.findUnique({
      where: { id: parsed.data.ProjectId },
    });

    if (!project) return { status: "error", message: "Проект не найден" };

    const owner = await TeamDAL.getTeamOwner(project.teamId);
    if (!isOwner(this.user, { ownerId: owner?.userId })) {
      return { status: "error", message: "Нет прав!" };
    }

    const updated = await prisma.project.update({
      where: { id: project.id },
      data: { status: parsed.data.answer },
    });

    return {
      status: "success",
      message: "Статус обновлён",
      data: updated as ProjectWithStatusDTO,
    };
  }

  async deleteProject(projectId: string): Promise<StateType> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) return { status: "error", message: "Проект не найден" };

    const owner = await TeamDAL.getTeamOwner(project.teamId);
    if (!isOwner(this.user, { ownerId: owner?.userId })) {
      return { status: "error", message: "Нет прав!" };
    }

    await prisma.project.delete({ where: { id: projectId } });

    return {
      status: "success",
      message: "Проект удалён",
    };
  }
}
