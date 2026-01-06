import { authClient } from "@/lib/auth-client";

export default function useUserData() {
  const { data, isPending } = authClient.useSession();

  const user = data?.user;

  const dto = user
    ? {
        id: user.id,
        email: user.email,
        username: user.username!,
        createdAt: user.createdAt,
      }
    : null;

  return {
    user: dto,
    isPending: isPending,
  };
}
