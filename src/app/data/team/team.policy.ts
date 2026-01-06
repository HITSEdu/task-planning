import "server-only";
import { UserDTO } from "@/app/data/user/user.dto";

export function canCreateTeam(user: UserDTO | null) {
  return Boolean(user);
}

export function isOwner(
  user: UserDTO | null | undefined,
  team: {
    ownerId: string | null | undefined;
  },
) {
  return user?.id === team.ownerId;
}
