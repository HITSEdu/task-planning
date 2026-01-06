import { ModeToggle } from "@/app/_components/header/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderSkeleton() {
  return (
    <header className="flex items-center justify-between w-full px-6 py-4 shadow-md">
      <div className="text-2xl font-bold tracking-tight">
        <Skeleton className="h-8 w-32 ml-[-1rem]" />
      </div>
      <div className="flex gap-8">
        <Skeleton className="h-8 w-60" />
        <div className="flex items-center justify-between gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
