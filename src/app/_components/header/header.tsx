"use client";
import Link from "next/link";
import HeaderSkeleton from "@/app/_components/header/header-skeleton";
import { ModeToggle } from "@/app/_components/header/mode-toggle";
import UserBlock from "@/app/_components/header/user-block";
import { sitePages } from "@/app/config/site.config";
import useUserData from "@/hooks/useUserData";

export default function Header() {
  const { user, isPending } = useUserData();

  if (isPending) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="flex items-center justify-between w-full px-6 py-4 shadow-md">
      <div className="text-2xl font-bold tracking-tight">
        <Link href={sitePages.teams.path}>{sitePages.teams.labelKey}</Link>
      </div>
      <div className="flex gap-8">
        {!!user && <UserBlock user={user} />}
        <div className="flex items-center justify-between gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
