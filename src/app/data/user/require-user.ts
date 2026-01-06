import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import type { UserDTO } from "@/app/data/user/user.dto";
import { auth } from "@/lib/auth";

export const requireUser = cache(async (): Promise<UserDTO> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
});

export const getCurrentUser = cache(async (): Promise<UserDTO | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    username: session.user.username ?? "",
    createdAt: session.user.createdAt,
  };
});
