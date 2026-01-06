import { UserRole } from "@/generated/prisma/enums";
import { TeamWithRoleDTO } from "@/app/data/team/team.dto";

export type UserTeam = {
  team: { id: string; name: string; createdAt: Date };
} & { createdAt: Date; role: UserRole; userId: string; teamId: string };

export const teamMapper = (
  data: UserTeam[] | UserTeam,
): TeamWithRoleDTO[] | TeamWithRoleDTO => {
  if (Array.isArray(data)) {
    return data.map((el) => ({
      id: el.team.id,
      name: el.team.name,
      createdAt: el.createdAt,
      role: el.role,
    }));
  } else {
    return {
      id: data.team.id,
      name: data.team.name,
      createdAt: data.createdAt,
      role: data.role,
    };
  }
};
